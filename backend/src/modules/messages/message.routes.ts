import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as MessageController from './message.controller';
import { z } from 'zod';

const router = Router();

// Message validation schema
const sendMessageSchema = z.object({
  receiverId: z.string().min(1, 'Receiver ID is required'),
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message is too long'),
});

// All routes require authentication
router.use(authenticate);

// Send a message
router.post(
  '/send',
  validate(sendMessageSchema),
  MessageController.sendMessage
);

// Get conversation with another user
router.get(
  '/conversation/:userId',
  MessageController.getConversation
);

// Get all conversations for current user
router.get(
  '/conversations',
  MessageController.getConversations
);

// Mark message as read
router.patch(
  '/:messageId/read',
  MessageController.markAsRead
);

// Delete a message
router.delete(
  '/:messageId',
  MessageController.deleteMessage
);

export default router;
