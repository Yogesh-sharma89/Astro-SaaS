// hooks/ — custom React hooks shared across features.

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '@/services/chat';
import { useAuthStore } from '@/store/auth-store';

export function useChatMessages() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['chatMessages', user?.id],
    queryFn: () => chatService.getMessages(user!.id),
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
}

export function useAddChatMessage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: ({ role, content }: { role: 'user' | 'assistant'; content: string }) =>
      chatService.addMessage(user!.id, role, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', user?.id] });
    },
  });
}

export function useClearChatMessages() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: () => chatService.clearMessages(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', user?.id] });
    },
  });
}
