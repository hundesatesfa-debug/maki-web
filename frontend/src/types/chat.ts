import { User } from './user';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: Pick<User, 'id' | 'firstName' | 'lastName' | 'profilePicture'>;
}

export interface Conversation {
  id: string;
  listingId: string | null;
  listing: {
    id: string;
    title: string;
    images: { url: string }[];
  } | null;
  participants: {
    user: Pick<User, 'id' | 'firstName' | 'lastName' | 'profilePicture'>;
  }[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}
