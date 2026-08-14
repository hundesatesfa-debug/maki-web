"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.markAsRead = exports.getConversations = exports.getConversation = exports.sendMessage = void 0;
const message_service_1 = require("./message.service");
const apiResponse_1 = require("../../utils/apiResponse");
const apiError_1 = require("../../utils/apiError");
const sendMessage = async (req, res, next) => {
    try {
        if (!req.user) {
            throw apiError_1.ApiError.unauthorized('User not authenticated');
        }
        const { receiverId, content } = req.body;
        const message = await message_service_1.MessageService.sendMessage(req.user.userId, receiverId, content);
        (0, apiResponse_1.sendResponse)(res, 201, true, 'Message sent successfully', message);
    }
    catch (error) {
        next(error);
    }
};
exports.sendMessage = sendMessage;
const getConversation = async (req, res, next) => {
    try {
        if (!req.user) {
            throw apiError_1.ApiError.unauthorized('User not authenticated');
        }
        const { userId } = req.params;
        const messages = await message_service_1.MessageService.getConversation(req.user.userId, userId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Conversation retrieved', messages);
    }
    catch (error) {
        next(error);
    }
};
exports.getConversation = getConversation;
const getConversations = async (req, res, next) => {
    try {
        if (!req.user) {
            throw apiError_1.ApiError.unauthorized('User not authenticated');
        }
        const conversations = await message_service_1.MessageService.getConversations(req.user.userId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Conversations retrieved', conversations);
    }
    catch (error) {
        next(error);
    }
};
exports.getConversations = getConversations;
const markAsRead = async (req, res, next) => {
    try {
        if (!req.user) {
            throw apiError_1.ApiError.unauthorized('User not authenticated');
        }
        const { messageId } = req.params;
        await message_service_1.MessageService.markAsRead(messageId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Message marked as read');
    }
    catch (error) {
        next(error);
    }
};
exports.markAsRead = markAsRead;
const deleteMessage = async (req, res, next) => {
    try {
        if (!req.user) {
            throw apiError_1.ApiError.unauthorized('User not authenticated');
        }
        const { messageId } = req.params;
        await message_service_1.MessageService.deleteMessage(messageId, req.user.userId);
        (0, apiResponse_1.sendResponse)(res, 200, true, 'Message deleted successfully');
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=message.controller.js.map