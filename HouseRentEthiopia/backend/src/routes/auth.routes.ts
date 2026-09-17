import { Router } from 'express';
import { register, logout, getMe } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';
const router = Router();
router.post('/register', register);
router.get('/me', protect, getMe);
router.post('/logout', logout);
export default router;