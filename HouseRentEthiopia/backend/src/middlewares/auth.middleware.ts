import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request { user?: any; }

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';

/**
 * Verifies a Supabase Auth access token and syncs the app-level User row.
 * The Supabase JWT secret can be found at: Supabase Dashboard -> Project Settings -> API -> JWT Secret.
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET) as any;
    const sub = decoded?.sub; // Supabase auth users.uid
    if (!sub) return res.status(401).json({ success: false, message: 'Not authorized, token failed' });

    // Upsert the app User row so Prisma relations (houses, payments) can reference it.
    let user = await prisma.user.findUnique({ where: { id: sub } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: sub,
          name: decoded?.user_metadata?.full_name || decoded?.email || 'User',
          email: decoded?.email || `${sub}@supabase.local`,
          password: null,
        },
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'User role not authorized' });
    next();
  };
};