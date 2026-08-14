"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const database_1 = __importDefault(require("../../config/database"));
const apiError_1 = require("../../utils/apiError");
class MessageService {
    static async sendMessage(senderId, receiverId, content) {
        // Validate receiver exists
        const receiver = await database_1.default.user.findUnique({
            where: { id: receiverId },
        });
        if (!receiver) {
            throw apiError_1.ApiError.notFound('Receiver not found');
        }
        // Prevent sending empty messages
        if (!content || content.trim().length === 0) {
            throw apiError_1.ApiError.badRequest('Message content cannot be empty');
        }
        // Create or get conversation
        let conversation = await database_1.default.conversation.findFirst({
            where: {
                participants: {
                    every: {
                        userId: { in: [senderId, receiverId] },
                    },
                },
            },
            include: {
                participants: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
        });
        if (!conversation) {
            // Create new conversation
            conversation = await database_1.default.conversation.create({
                data: {
                    participants: {
                        create: [
                            { userId: senderId },
                            { userId: receiverId },
                        ],
                    },
                },
                include: {
                    participants: true,
                    messages: {
                        orderBy: { createdAt: 'desc' },
                        take: 1,
                    },
                },
            });
        }
        // Create message
        const message = await database_1.default.message.create({
            data: {
                content,
                senderId,
                conversationId: conversation.id,
                isRead: false,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profilePicture: true,
                    },
                },
            },
        });
        return message;
    }
    static async getConversation(userId, otherUserId) {
        const conversation = await database_1.default.conversation.findFirst({
            where: {
                participants: {
                    every: {
                        userId: { in: [userId, otherUserId] },
                    },
                },
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
                participants: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
        });
        if (!conversation) {
            throw apiError_1.ApiError.notFound('Conversation not found');
        }
        // Mark messages as read
        await database_1.default.message.updateMany({
            where: {
                conversationId: conversation.id,
                senderId: otherUserId,
            },
            data: { isRead: true },
        });
        return conversation;
    }
    static async getConversations(userId) {
        const conversations = await database_1.default.conversation.findMany({
            where: {
                participants: {
                    some: { userId },
                },
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                participants: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });
        return conversations.map(conv => ({
            ...conv,
            lastMessage: conv.messages[0],
            otherParticipant: conv.participants.find(p => p.user.id !== userId)?.user,
        }));
    }
    static async markAsRead(messageId) {
        const message = await database_1.default.message.update({
            where: { id: messageId },
            data: { isRead: true },
        });
        return message;
    }
    static async deleteMessage(messageId, userId) {
        const message = await database_1.default.message.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw apiError_1.ApiError.notFound('Message not found');
        }
        if (message.senderId !== userId) {
            throw apiError_1.ApiError.forbidden('You can only delete your own messages');
        }
        await database_1.default.message.delete({
            where: { id: messageId },
        });
    }
}
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map