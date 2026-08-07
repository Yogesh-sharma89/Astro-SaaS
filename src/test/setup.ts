// test/ — global test setup for vitest.
// Mocks browser APIs that jsdom doesn't provide and sets up
// common stubs used across all test files.

import { vi } from 'vitest';

// jsdom doesn't provide crypto.randomUUID
if (!globalThis.crypto) {
  globalThis.crypto = {} as Crypto;
}
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = (() => 'test-uuid-' + Math.random().toString(36).slice(2, 9)) as Crypto['randomUUID'];
}

// Helper to create a mock Supabase client chain
export function createMockSupabaseClient(overrides: Record<string, unknown> = {}) {
  const chain = {
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
  };
  return { ...chain, ...overrides };
}
