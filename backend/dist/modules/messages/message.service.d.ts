export declare class MessageService {
    static sendMessage(senderId: string, receiverId: string, content: string): Promise<{
        sender: {
            id: string;
            firstName: string;
            lastName: string;
            profilePicture: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
    }>;
    static getConversation(userId: string, otherUserId: string): Promise<{
        messages: ({
            sender: {
                id: string;
                firstName: string;
                lastName: string;
                profilePicture: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            content: string;
            isRead: boolean;
        })[];
        participants: {
            user: {
                id: string;
                firstName: string;
                lastName: string;
                profilePicture: string | null;
            };
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string | null;
    }>;
    static getConversations(userId: string): Promise<{
        lastMessage: {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            content: string;
            isRead: boolean;
        };
        otherParticipant: {
            id: string;
            firstName: string;
            lastName: string;
            profilePicture: string | null;
        } | undefined;
        messages: {
            id: string;
            createdAt: Date;
            conversationId: string;
            senderId: string;
            content: string;
            isRead: boolean;
        }[];
        participants: {
            user: {
                id: string;
                firstName: string;
                lastName: string;
                profilePicture: string | null;
            };
        }[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string | null;
    }[]>;
    static markAsRead(messageId: string): Promise<{
        id: string;
        createdAt: Date;
        conversationId: string;
        senderId: string;
        content: string;
        isRead: boolean;
    }>;
    static deleteMessage(messageId: string, userId: string): Promise<void>;
}
//# sourceMappingURL=message.service.d.ts.map