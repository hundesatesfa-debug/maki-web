import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';
import * as AuthController from './auth.controller';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.validation';

const router = Router();

// Apply strict rate limiting to auth routes
router.use(authLimiter);

router.post(
  '/register',
  validate(registerSchema),
  AuthController.register
);

router.post(
  '/login',
  validate(loginSchema),
  AuthController.login
);

router.post(
  '/logout',
  authenticate,
  AuthController.logout
);

router.post(
  '/refresh',
  AuthController.refresh
);

router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

export default router;
