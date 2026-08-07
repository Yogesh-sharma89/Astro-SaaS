// Tests for services/chat.ts — Supabase chat_messages CRUD.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/supabaseClient', () => {
  const chain = {
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
  return {
    supabase: {
      from: vi.fn(() => chain),
    },
  };
});

import { supabase } from '@/services/supabaseClient';
import { chatService } from '@/services/chat';

describe('chatService.getMessages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns an array of ChatMessage when rows exist', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [
          { id: 'm1', user_id: 'u1', role: 'user', content: 'Hello', created_at: '2024-01-01T00:00:00Z' },
          { id: 'm2', user_id: 'u1', role: 'assistant', content: 'Hi there', created_at: '2024-01-01T00:00:01Z' },
        ],
        error: null,
      }),
    });

    const result = await chatService.getMessages('u1');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('m1');
    expect(result[0].role).toBe('user');
    expect(result[0].content).toBe('Hello');
    expect(result[1].role).toBe('assistant');
  });

  it('returns empty array when no rows', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: null }),
    });

    const result = await chatService.getMessages('u1');
    expect(result).toEqual([]);
  });

  it('throws on supabase error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: { message: 'RLS denied' } }),
    });

    await expect(chatService.getMessages('u1')).rejects.toThrow('RLS denied');
  });
});

describe('chatService.addMessage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('inserts and returns the new message', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'm3', user_id: 'u1', role: 'user', content: 'Test', created_at: '2024-01-01T00:00:02Z' },
        error: null,
      }),
    });

    const result = await chatService.addMessage('u1', 'user', 'Test');
    expect(result.id).toBe('m3');
    expect(result.role).toBe('user');
    expect(result.content).toBe('Test');
  });

  it('throws on supabase error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
    });

    await expect(chatService.addMessage('u1', 'user', 'Test')).rejects.toThrow('Insert failed');
  });
});

describe('chatService.clearMessages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('deletes messages without error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    await expect(chatService.clearMessages('u1')).resolves.toBeUndefined();
  });

  it('throws on supabase error', async () => {
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: { message: 'Delete failed' } }),
    });

    await expect(chatService.clearMessages('u1')).rejects.toThrow('Delete failed');
  });
});
