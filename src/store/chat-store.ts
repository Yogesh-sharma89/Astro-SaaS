// store/ — Zustand stores for client-side state. One file per domain.
// chat-store: holds ephemeral streaming state only. Message history is
// persisted to Supabase (chat_messages table) and loaded via TanStack Query.

import { create } from 'zustand';

interface ChatState {
  isStreaming: boolean;
  streamingContent: string;
  setStreaming: (streaming: boolean) => void;
  setStreamingContent: (content: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isStreaming: false,
  streamingContent: '',
  setStreaming: (isStreaming) => set({ isStreaming }),
  setStreamingContent: (streamingContent) => set({ streamingContent }),
  reset: () => set({ isStreaming: false, streamingContent: '' }),
}));
