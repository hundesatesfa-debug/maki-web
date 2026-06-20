import { create } from 'zustand';

interface ChatState {
  activeConversationId: string | null;
  onlineUsers: Set<string>;
  setActiveConversation: (id: string | null) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  onlineUsers: new Set(),

  setActiveConversation: (id) =>
    set({ activeConversationId: id }),

  addOnlineUser: (userId) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.add(userId);
      return { onlineUsers: newSet };
    }),

  removeOnlineUser: (userId) =>
    set((state) => {
      const newSet = new Set(state.onlineUsers);
      newSet.delete(userId);
      return { onlineUsers: newSet };
    }),
}));
