import prisma from '../../config/database';
import { ApiError } from '../../utils/apiError';

export class MessageService {
  static async sendMessage(senderId: string, receiverId: string, content: string) {
    // Validate receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw ApiError.notFound('Receiver not found');
    }

    // Prevent sending empty messages
    if (!content || content.trim().length === 0) {
      throw ApiError.badRequest('Message content cannot be empty');
    }

    // Create or get conversation
    let conversation = await prisma.conversation.findFirst({
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
      conversation = await prisma.conversation.create({
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
    const message = await prisma.message.create({
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

  static async getConversation(userId: string, otherUserId: string) {
    const conversation = await prisma.conversation.findFirst({
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
      throw ApiError.notFound('Conversation not found');
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: conversation.id,
        senderId: otherUserId,
      },
      data: { isRead: true },
    });

    return conversation;
  }

  static async getConversations(userId: string) {
    const conversations = await prisma.conversation.findMany({
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

  static async markAsRead(messageId: string) {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    return message;
  }

  static async deleteMessage(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw ApiError.notFound('Message not found');
    }

    if (message.senderId !== userId) {
      throw ApiError.forbidden('You can only delete your own messages');
    }

    await prisma.message.delete({
      where: { id: messageId },
    });
  }
}
