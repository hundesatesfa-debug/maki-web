import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';

/**
 * Syncs a Supabase Auth user into the app-level User table so Prisma
 * relations (houses, payments, favorites) can reference them.
 */
const syncSupabaseUser = async (token: string, extra: { role?: string; phoneNumber?: string; name?: string }) => {
  const decoded = jwt.verify(token, SUPABASE_JWT_SECRET) as any;
  const sub = decoded?.sub as string;
  if (!sub) throw new Error('Invalid token subject');

  const name = extra.name || decoded?.user_metadata?.full_name || decoded?.email?.split('@')[0] || 'User';
  const email = decoded?.email || `${sub}@supabase.local`;
  // If no explicit role was passed (e.g. profile auto-created at first login),
  // fall back to the role captured during Supabase signUp.
  const role = extra.role || decoded?.user_metadata?.role || 'RENTER';

  let user = await prisma.user.findUnique({ where: { id: sub } });
  if (user) {
    user = await prisma.user.update({
      where: { id: sub },
      data: {
        ...(extra.role ? { role: extra.role as any } : {}),
        ...(extra.phoneNumber !== undefined ? { phoneNumber: extra.phoneNumber } : {}),
        ...(extra.name !== undefined ? { name: extra.name } : {}),
        email,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        id: sub,
        name,
        email,
        password: null,
        phoneNumber: extra.phoneNumber,
        role: role as any,
      },
    });
  }
  return user;
};

/** Called after Supabase signUp to create the app-level profile with a chosen role. */
export const register = async (req: Request, res: Response) => {
  try {
    const { role, phoneNumber, name } = req.body;
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Missing Supabase token' });

    const user = await syncSupabaseUser(token, { role, phoneNumber, name });
    res.status(201).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Returns the current app-level profile for an authenticated Supabase user. */
export const getMe = async (req: Request, res: Response) => {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Missing Supabase token' });

    const user = await syncSupabaseUser(token, {});
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};