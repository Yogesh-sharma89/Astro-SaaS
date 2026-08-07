// features/ai-astrologer/ — chat interface with AI astrologer.

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/i18n-provider';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  showSuggestions?: boolean;
}

export function ChatInput({ onSend, disabled, showSuggestions }: ChatInputProps) {
  const [value, setValue] = useState('');
  const { t } = useI18n();

  const suggestions = [t.suggestions.prompt1, t.suggestions.prompt2, t.suggestions.prompt3, t.suggestions.prompt4];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  }

  function handleSuggestion(prompt: string) {
    onSend(prompt);
  }

  return (
    <div className="w-full max-w-3xl space-y-3">
      {showSuggestions && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSuggestion(prompt)}
              disabled={disabled}
              className={cn(
                'rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-foreground',
                disabled && 'opacity-50'
              )}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={t.chat.askStars}
          disabled={disabled}
          rows={1}
          className="min-h-[44px] max-h-32 resize-none bg-card/50"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !value.trim()}
          className="h-11 w-11 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
