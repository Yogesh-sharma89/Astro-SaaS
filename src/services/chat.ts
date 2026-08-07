// services/ — API layer. One file per domain.
// chat.ts: CRUD for chat_messages table via Supabase.

import { supabase } from './supabaseClient';
import type { ChatMessage } from '@/types';

interface ChatMessageRow {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

function rowToMessage(row: ChatMessageRow): ChatMessage {
  return {
    id: row.id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
  };
}

export const chatService = {
  /** Fetch all chat messages for the current user, ordered by time. */
  async getMessages(userId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    if (!data) return [];
    return (data as ChatMessageRow[]).map(rowToMessage);
  },

  /** Insert a single message. Returns the inserted row. */
  async addMessage(userId: string, role: ChatMessage['role'], content: string): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ user_id: userId, role, content })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return rowToMessage(data as ChatMessageRow);
  },

  /** Clear all messages for the current user. */
  async clearMessages(userId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  },
};
