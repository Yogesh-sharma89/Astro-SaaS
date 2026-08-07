// components/shared/ — composed components built FROM shadcn primitives + custom styling.

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'gold' | 'primary' | 'none';
  hover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = 'none', hover = false, children, ...props }, ref) => {
    const glowClass =
      glow === 'gold'
        ? 'shadow-[0_0_40px_-12px_hsl(38_92%_60%/0.25)]'
        : glow === 'primary'
          ? 'shadow-[0_0_40px_-12px_hsl(258_75%_56%/0.25)]'
          : '';

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-[var(--radius)] p-[1px] transition-all duration-300',
          hover && 'hover:shadow-[0_0_50px_-8px_hsl(258_75%_56%/0.2)] hover:-translate-y-0.5',
          glowClass,
          className
        )}
        {...props}
      >
        <div className="glass-gradient-border absolute inset-0 rounded-[inherit] opacity-50" />
        <Card
          className="relative rounded-[calc(var(--radius)-1px)] border-transparent bg-card/70 backdrop-blur-xl"
        >
          {children}
        </Card>
      </div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
