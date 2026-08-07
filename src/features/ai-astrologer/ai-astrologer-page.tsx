// features/ai-astrologer/ — conversational AI astrologer with streaming-style responses.

import { useState, useCallback, useRef, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '@/hooks/use-profile';
import { useBirthChart } from '@/hooks/use-birth-chart';
import { useChatMessages, useAddChatMessage, useClearChatMessages } from '@/hooks/use-chat-messages';
import { useChatStore } from '@/store/chat-store';
import { streamAstrologerResponse } from '@/services/ai';
import { translateAIResponse } from '@/services/ai-i18n';
import type { Language } from '@/i18n/translations';
import { useAuthStore } from '@/store/auth-store';
import { GlassCard } from '@/components/shared/glass-card';
import { ChatInput } from './components/chat-input';
import type { ChatMessage } from '@/types';
import { Sparkles, Trash2, Bot, User as UserIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/i18n/i18n-provider';

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export function AiAstrologerPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: chart } = useBirthChart();
  const user = useAuthStore((s) => s.user);
  const { data: messages, isLoading: messagesLoading } = useChatMessages();
  const addMessage = useAddChatMessage();
  const clearMessages = useClearChatMessages();
  const isStreaming = useChatStore((s) => s.isStreaming);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const setStreamingContent = useChatStore((s) => s.setStreamingContent);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useI18n();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming, streamingContent]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!profile || !user) return;
      setError(null);

      try {
        await addMessage.mutateAsync({ role: 'user', content: text });
        setStreaming(true);
        setStreamingContent('');

        const history = messages ?? [];
        let accumulated = '';
        for await (const token of streamAstrologerResponse(text, profile, chart ?? null, history, lang)) {
          accumulated += token;
          setStreamingContent(accumulated);
        }

        await addMessage.mutateAsync({ role: 'assistant', content: accumulated });
      } catch {
        setError(t.chat.somethingWrong);
      } finally {
        setStreaming(false);
        setStreamingContent('');
      }
    },
    [profile, user, chart, messages, addMessage, setStreaming, setStreamingContent, lang]
  );

  const handleClear = useCallback(async () => {
    if (!user) return;
    try {
      await clearMessages.mutateAsync();
    } catch {
      setError(t.chat.somethingWrong);
    }
  }, [user, clearMessages]);

  if (profileLoading || messagesLoading) {
    return <div className="mx-auto max-w-3xl"><div className="h-32" /></div>;
  }

  if (!profile?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  const allMessages: ChatMessage[] = (() => {
    const baseMessages = isStreaming && streamingContent
      ? [...(messages ?? []), {
          id: 'streaming',
          role: 'assistant' as const,
          content: streamingContent,
          createdAt: new Date().toISOString(),
        }]
      : messages ?? [];

    if (lang === 'en') return baseMessages;
    return baseMessages.map((msg) => ({
      ...msg,
      content: translateAIResponse(msg.content, lang as Language),
    }));
  })();

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col">
      <div className="mb-4 shrink-0 space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h1 className="font-display text-2xl font-semibold text-foreground">{t.nav.astrologer}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t.chat.askAnything}
        </p>
      </div>

      <GlassCard glow="primary" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col p-4">
          {allMessages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center space-y-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10"
              >
                <Sparkles className="h-8 w-8 text-accent" />
              </motion.div>
              <div className="space-y-2">
                <p className="font-display text-xl text-foreground">{t.chat.welcome}, {profile.name.split(' ')[0]}</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  {t.chat.askAnything}
                </p>
              </div>
            </div>
          ) : (
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto scrollbar-cosmic px-1 py-2">
              <AnimatePresence initial={false}>
                {allMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {msg.role === 'assistant' && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                        <Bot className="h-4 w-4 text-accent" />
                      </div>
                    )}
                    {msg.role === 'user' && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                        <UserIcon className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div className={cn('flex flex-col gap-1', msg.role === 'user' ? 'items-end' : 'items-start')}>
                      <div className={cn(
                        'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed',
                        msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card/80 border border-border text-foreground'
                      )}>
                        {msg.content}
                        {msg.id === 'streaming' && (
                          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-accent align-middle" />
                        )}
                      </div>
                      {msg.id !== 'streaming' && (
                        <span className="px-1 text-[10px] text-muted-foreground/60">
                          {formatTime(msg.createdAt)}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator before first token arrives */}
              {isStreaming && !streamingContent && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                    <Bot className="h-4 w-4 text-accent" />
                  </div>
                  <div className="rounded-2xl border border-border bg-card/80 px-2 py-1">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-center gap-2 py-2 text-xs text-destructive"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex shrink-0 items-center justify-between border-t border-border pt-3">
            {allMessages.length > 0 && !isStreaming && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> {t.chat.clearChat}
              </button>
            )}
            <div className="ml-auto">
              <ChatInput
                onSend={handleSend}
                disabled={isStreaming}
                showSuggestions={allMessages.length === 0}
              />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
