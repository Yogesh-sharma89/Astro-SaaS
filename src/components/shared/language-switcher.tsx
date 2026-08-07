// components/shared/ — language switcher dropdown.

import { Check, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/i18n-provider';
import { LANGUAGES } from '@/i18n/translations';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{current?.nativeLabel ?? 'English'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              l.code === lang && 'bg-primary/10'
            )}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{l.flag}</span>
              <span className="font-medium">{l.nativeLabel}</span>
            </span>
            {l.code === lang && <Check className="h-4 w-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
