import prisma from '../../config/database';
import { ApiError } from '../../utils/apiError';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { sendPasswordResetEmail } from '../../utils/email';
import crypto from 'crypto';

export class AuthService {
  static async register(data: any) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      },
    });

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const { password, refreshToken: _, ...userWithoutSensitiveInfo } = user;

    return { user: userWithoutSensitiveInfo, accessToken, refreshToken };
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.isBanned) {
      throw ApiError.forbidden('Your account has been banned. Please contact support.');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const { password, refreshToken: _, ...userWithoutSensitiveInfo } = user;

    return { user: userWithoutSensitiveInfo, accessToken, refreshToken };
  }

  static async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  static async refreshToken(oldRefreshToken: string) {
    // Note: The actual JWT verification is done in the controller
    // Here we just check if it matches what's in the DB
    const user = await prisma.user.findFirst({
      where: { refreshToken: oldRefreshToken },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const payload = { userId: user.id, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // We don't throw an error here to prevent email enumeration attacks
      return;
    }

    // Generate a random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save token with 1 hour expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send email (un-hashed token sent to user)
    await sendPasswordResetEmail(user.email, resetToken);
  }

  static async resetPassword(data: any) {
    const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(data.password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        // Optionally invalidate all sessions by clearing refresh token
        refreshToken: null,
      },
    });
  }
}
