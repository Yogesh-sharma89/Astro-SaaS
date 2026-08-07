// components/shared/ — composed components built FROM shadcn primitives + custom styling.

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  variant?: 'card' | 'list' | 'detail';
  className?: string;
}

export function LoadingState({ variant = 'card', className }: LoadingStateProps) {
  if (variant === 'list') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'detail') {
    return (
      <div className={cn('space-y-6', className)}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-40 w-full rounded-[var(--radius)]" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 rounded-[var(--radius)]" />
          <Skeleton className="h-24 rounded-[var(--radius)]" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-[var(--radius)] border border-border p-6">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="mt-4 h-20 w-full rounded-[var(--radius)]" />
        </div>
      ))}
    </div>
  );
}
