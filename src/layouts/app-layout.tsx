// layouts/ — page-level layout shells (app shell, auth shell, etc.).

import { NavLink, useNavigate } from 'react-router-dom';
import { Sparkles, CircleDot, Sun, MessageSquare, User, LogOut, Menu, Crown, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NAV_ITEMS, APP_NAME } from '@/constants';
import { useAuthStore } from '@/store/auth-store';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Starfield } from '@/components/shared/starfield';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useI18n } from '@/i18n/i18n-provider';
import { useSubscription } from '@/hooks/use-subscription';

const ICONS = { Sparkles, CircleDot, Sun, MessageSquare, User, Crown, Heart } as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const navLabels: Record<string, string> = {
    '/dashboard': t.nav.dashboard,
    '/birth-chart': t.nav.birthChart,
    '/kundali': t.nav.kundali,
    '/marriage-matching': 'Marriage Match',
    '/astrologer': t.nav.astrologer,
    '/profile': t.nav.profile,
  };
  return (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon as keyof typeof ICONS] ?? Sparkles;
        return (
          <NavLink
            key={item.to}
            to={item.disabled ? '#' : item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                item.disabled && 'cursor-not-allowed opacity-40',
                !item.disabled && isActive
                  ? 'bg-primary/15 text-foreground'
                  : 'text-muted-foreground hover:bg-primary/8 hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
                )}
                <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive && 'text-accent')} />
                <span>{navLabels[item.to] ?? item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { t } = useI18n();
  const { data: subscription } = useSubscription();
  const isPaid = subscription?.status === 'active' && (subscription.plan === 'pro' || subscription.plan === 'premium');
  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  async function handleLogout() {
    await authService.logout();
    toast(t.common.signOut);
    navigate('/login', { replace: true });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full outline-none ring-offset-background transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-9 w-9 border border-primary/30 bg-primary/10">
            <AvatarFallback className="bg-transparent text-sm font-medium text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          {t.nav.profile}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/kundali')}>
          <Star className="mr-2 h-4 w-4" />
          {t.nav.kundali}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/pricing')}>
          <Crown className="mr-2 h-4 w-4 text-accent" />
          {isPaid ? 'My Plan' : t.common.upgrade}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          {t.common.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Cosmic background */}
      <div className="cosmic-bg fixed inset-0 -z-20" />
      <Starfield count={60} />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border/50 bg-card/30 backdrop-blur-md lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <span className="font-display text-xl font-semibold tracking-wide text-foreground">
            {APP_NAME}
          </span>
        </div>
        <div className="mt-2 flex-1">
          <SidebarContent />
        </div>
        <div className="border-t border-border/50 p-4">
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-accent" />
              <p className="text-xs font-medium text-foreground">Unlock Premium</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Get your personalized kundali</p>
            <Button
              size="sm"
              className="mt-2 h-7 w-full bg-accent/20 text-xs text-accent hover:bg-accent/30"
              variant="secondary"
              onClick={() => window.location.href = '/pricing'}
            >
              Upgrade
            </Button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/50 px-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-r border-border/50 bg-card/95 backdrop-blur-xl">
                <SheetTitle className="flex items-center gap-2.5 px-4 pb-4 pt-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                    <Sparkles className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-display text-lg font-semibold">
                    {APP_NAME}
                  </span>
                </SheetTitle>
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
                <div className="mt-auto px-4 pb-4">
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-accent" />
                      <p className="text-xs font-medium text-foreground">Unlock Premium</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Get your personalized kundali</p>
                    <Button
                      size="sm"
                      className="mt-2 h-7 w-full bg-accent/20 text-xs text-accent hover:bg-accent/30"
                      variant="secondary"
                      onClick={() => { setMobileOpen(false); window.location.href = '/pricing'; }}
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-display text-lg font-medium text-foreground lg:hidden">
              {APP_NAME}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
