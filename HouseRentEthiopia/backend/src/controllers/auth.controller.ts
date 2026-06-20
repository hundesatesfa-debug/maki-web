import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phoneNumber } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword, role: role || 'RENTER', phoneNumber } });
    const token = generateToken(user.id, user.role);
    res.status(201).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user.id, user.role);
    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) { res.status(500).json({ success: false, message: error.message }); }
};

export const logout = (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};