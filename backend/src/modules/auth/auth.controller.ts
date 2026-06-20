import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendResponse } from '../../utils/apiResponse';
import { verifyRefreshToken } from '../../utils/jwt';
import { env } from '../../config/env';
import { ApiError } from '../../utils/apiError';

const setTokenCookies = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.register(req.body);
    setTokenCookies(res, result.refreshToken);

    sendResponse(res, 201, true, 'Registration successful', {
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);
    setTokenCookies(res, result.refreshToken);

    sendResponse(res, 200, true, 'Login successful', {
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await AuthService.logout(req.user.userId);
    }
    
    res.clearCookie('refreshToken');
    sendResponse(res, 200, true, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    // Verify token expiration and signature
    verifyRefreshToken(refreshToken);

    const result = await AuthService.refreshToken(refreshToken);
    setTokenCookies(res, result.refreshToken);

    sendResponse(res, 200, true, 'Token refreshed successfully', {
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.clearCookie('refreshToken');
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.forgotPassword(req.body.email);
    
    // Always return success to prevent email enumeration
    sendResponse(res, 200, true, 'If that email exists, a password reset link has been sent');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.resetPassword(req.body);
    sendResponse(res, 200, true, 'Password has been reset successfully');
  } catch (error) {
    next(error);
  }
};
