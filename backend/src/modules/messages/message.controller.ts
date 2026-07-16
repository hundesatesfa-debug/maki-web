import { Request, Response, NextFunction } from 'express';
import { MessageService } from './message.service';
import { sendResponse } from '../../utils/apiResponse';
import { ApiError } from '../../utils/apiError';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const { receiverId, content } = req.body;

    const message = await MessageService.sendMessage(
      req.user.userId,
      receiverId,
      content
    );

    sendResponse(res, 201, true, 'Message sent successfully', message);
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const { userId } = req.params;

    const messages = await MessageService.getConversation(req.user.userId, userId);

    sendResponse(res, 200, true, 'Conversation retrieved', messages);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const conversations = await MessageService.getConversations(req.user.userId);

    sendResponse(res, 200, true, 'Conversations retrieved', conversations);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const { messageId } = req.params;

    await MessageService.markAsRead(messageId);

    sendResponse(res, 200, true, 'Message marked as read');
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    const { messageId } = req.params;

    await MessageService.deleteMessage(messageId, req.user.userId);

    sendResponse(res, 200, true, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};
