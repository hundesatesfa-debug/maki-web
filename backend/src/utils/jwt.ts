import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
}

export const generateAccessToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { sub: userId, email, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRY }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { sub: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRY }
  );
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): { sub: string } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
};
