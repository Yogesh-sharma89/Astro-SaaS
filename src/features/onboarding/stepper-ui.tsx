// features/onboarding/ — multi-step onboarding form collecting birth info + preferences.

import { cn } from '@/lib/utils';
import { ONBOARDING_STEPS } from '@/constants';

export function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: ONBOARDING_STEPS }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i === current
              ? 'w-8 bg-accent'
              : i < current
                ? 'w-2 bg-primary'
                : 'w-2 bg-border'
          )}
        />
      ))}
    </div>
  );
}

export function ChipSelector({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={cn(
            'rounded-full border px-4 py-2 text-sm transition-all',
            selected.includes(opt)
              ? 'border-primary bg-primary/20 text-foreground'
              : 'border-border bg-transparent text-muted-foreground hover:border-primary/50 hover:text-foreground'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
