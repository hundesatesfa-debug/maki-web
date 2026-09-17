import { Router } from 'express';
import { initiatePayment, chapaWebhook, recordManualPayment, getPayments } from '../controllers/payment.controller';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

router.post('/checkout', protect, initiatePayment);
router.post('/manual', protect, authorizeRoles('RENTER'), recordManualPayment);
router.get('/', protect, getPayments);
// Chapa webhook — security is enforced by re-verifying the transaction via the Chapa API.
router.post('/chapa-webhook', chapaWebhook);

export default router;