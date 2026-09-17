import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const CHAPA_API_BASE = 'https://api.chapa.co/v1';
const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY || '';

export interface ChapaInitResponse {
  status: string;
  message: string;
  checkout_url?: string;
  data?: { checkout_url: string; [key: string]: any };
}

const chapaHeaders = () => ({
  Authorization: `Bearer ${CHAPA_SECRET}`,
  'Content-Type': 'application/json',
});

/** Create a Chapa checkout session for a house booking/payment. */
export const initiatePayment = async (req: Request, res: Response) => {
  try {
    if (!CHAPA_SECRET) return res.status(500).json({ success: false, message: 'Chapa secret key not configured' });

    const user = (req as any).user;
    const { houseId, amount, method, email, first_name, last_name, phone } = req.body;

    if (!houseId || !amount) return res.status(400).json({ success: false, message: 'houseId and amount are required' });

    const house = await prisma.house.findUnique({ where: { id: houseId } });
    if (!house) return res.status(404).json({ success: false, message: 'House not found' });

    const txRef = `hre-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    // Persist a pending payment record first.
    const payment = await prisma.payment.create({
      data: {
        houseId,
        renterId: user.id,
        amount: Number(amount),
        method: method || 'CHAPA',
        status: 'PENDING',
        txRef,
        metadata: JSON.stringify({ houseId, title: house.title, address: house.address }),
      },
    });

    const payload = {
      amount: String(amount),
      currency: 'ETB',
      email: email || user.email,
      first_name: first_name || user.name?.split(' ')[0] || 'Renter',
      last_name: last_name || user.name?.split(' ')[1] || '',
      phone_number: phone || user.phoneNumber || '',
      tx_ref: txRef,
      callback_url: `${process.env.BACKEND_URL || 'http://localhost:5050'}/api/v1/payments/chapa-webhook`,
      return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success?ref=${txRef}`,
      customization: {
        title: house.title,
        description: house.address,
      },
    };

    const resp = await fetch(`${CHAPA_API_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: chapaHeaders(),
      body: JSON.stringify(payload),
    });
    const data = (await resp.json()) as ChapaInitResponse;

    if (!resp.ok || data.status !== 'success') {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } });
      return res.status(resp.status).json({ success: false, message: data.message || 'Chapa initialization failed' });
    }

    const checkoutUrl = data?.data?.checkout_url || data?.checkout_url;
    await prisma.payment.update({ where: { id: payment.id }, data: { reference: txRef } });

    res.status(200).json({ success: true, txRef, checkout_url: checkoutUrl, payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Chapa webhook — verifies payment and flips the local payment to PAID. */
export const chapaWebhook = async (req: Request, res: Response) => {
  try {
    const body = req.body as any;
    const txRef = body?.tx_ref || body?.transaction?.ref;
    if (!txRef) return res.status(400).json({ status: 'error', message: 'Missing tx_ref' });

    // Verify with Chapa to avoid trusting the raw webhook.
    const verifyResp = await fetch(`${CHAPA_API_BASE}/transaction/verify/${txRef}`, {
      method: 'GET',
      headers: chapaHeaders(),
    });
    const verifyData = (await verifyResp.json()) as any;

    const status = verifyData?.data?.status;
    const payment = await prisma.payment.updateMany({
      where: { txRef },
      data: {
        status: status === 'success' ? 'PAID' : 'FAILED',
        paidAt: status === 'success' ? new Date() : null,
      },
    });

    if (status === 'success') {
      // Optionally mark the house as RENTED once paid.
      const p = await prisma.payment.findFirst({ where: { txRef } });
      if (p) await prisma.house.update({ where: { id: p.houseId }, data: { status: 'RENTED' } });
    }

    res.status(200).json({ status: 'success', updated: payment.count });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/** Local method-only payment record (e.g. CBE Birr / Telebirr manual reference). */
export const recordManualPayment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { houseId, amount, method, reference } = req.body;
    if (!houseId || !amount) return res.status(400).json({ success: false, message: 'houseId and amount are required' });

    const payment = await prisma.payment.create({
      data: {
        houseId,
        renterId: user.id,
        amount: Number(amount),
        method: method || 'CBE_BIRR',
        status: 'PENDING',
        reference,
      },
    });
    res.status(201).json({ success: true, payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Payments for the current renter or (as owner) received on your houses. */
export const getPayments = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const payments = await prisma.payment.findMany({
      where: user.role === 'ADMIN' ? {} : { OR: [{ renterId: user.id }, { house: { ownerId: user.id } }] },
      include: { house: { select: { id: true, title: true, price: true, address: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};