// features/profile/ — user account settings and onboarding summary.

import { GlassCard } from '@/components/shared/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { useProfile } from '@/hooks/use-profile';
import { useBirthChart } from '@/hooks/use-birth-chart';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/i18n-provider';
import { ZODIAC_SYMBOLS } from '@/constants';
import {
  Calendar, Clock, MapPin, Globe,
  Heart, Target, Crown, ChevronRight,
} from 'lucide-react';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfile();
  const { data: chart } = useBirthChart();
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const dateLocale = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : lang === 'ta' ? 'ta-IN' : 'en-US';

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-display text-3xl font-semibold text-glow-gold text-foreground">
        {t.profile.title}
      </h1>

      {/* Account card */}
      <GlassCard>
        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xl font-medium text-foreground">
              {user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() ?? 'U'}
            </div>
            <div className="space-y-1">
              <p className="font-display text-xl font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">
                {t.profile.memberSince} {user ? new Date(user.createdAt).toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Astrological Profile */}
      {profile?.onboardingComplete && (
        <GlassCard glow="primary">
          <div className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-medium text-foreground">{t.profile.astrologicalProfile}</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/birth-chart')}>
                {t.profile.viewChart}
              </Button>
            </div>

            {chart && (
              <div className="flex flex-wrap gap-2">
                <Badge className="border border-primary/30 bg-primary/15 text-foreground hover:bg-primary/20">
                  {t.birthChart.sun} {ZODIAC_SYMBOLS[chart.sunSign]} {t.zodiac[chart.sunSign] ?? chart.sunSign}
                </Badge>
                <Badge className="border border-secondary/30 bg-secondary/15 text-foreground hover:bg-secondary/20">
                  {t.birthChart.moon} {ZODIAC_SYMBOLS[chart.moonSign]} {t.zodiac[chart.moonSign] ?? chart.moonSign}
                </Badge>
                {chart.ascendant && (
                  <Badge className="border border-accent/30 bg-accent/15 text-accent hover:bg-accent/20">
                    {t.birthChart.rising} {ZODIAC_SYMBOLS[chart.ascendant]} {t.zodiac[chart.ascendant] ?? chart.ascendant}
                  </Badge>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/10 p-3">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.birthDate}</p>
                  <p className="text-sm text-foreground">{new Date(profile.birthDate).toLocaleDateString(dateLocale, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/10 p-3">
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.birthTime}</p>
                  <p className="text-sm text-foreground">{profile.birthTimeUnknown ? t.profile.unknown : profile.birthTime || t.profile.unknown}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/10 p-3">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.birthPlace}</p>
                  <p className="text-sm text-foreground">{profile.birthPlace}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/10 p-3">
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.language}</p>
                  <p className="text-sm text-foreground">{profile.language}</p>
                </div>
              </div>
            </div>

            {profile.goals.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.goals}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.goals.map((g) => (
                    <Badge key={g} variant="outline" className="border-accent/20 text-foreground">
                      {t.goals[g as keyof typeof t.goals] ?? g}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.interests.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-cosmic-rose" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.profile.interests}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((i) => (
                    <Badge key={i} variant="outline" className="border-secondary/20 text-foreground">
                      {t.interests[i as keyof typeof t.interests] ?? i}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Subscription */}
      <GlassCard glow="gold" hover>
        <button onClick={() => navigate('/pricing')} className="flex w-full items-center justify-between p-6 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
              <Crown className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">{t.profile.subscription}</p>
              <p className="text-sm text-muted-foreground">{t.profile.freePlan}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-accent" />
        </button>
      </GlassCard>
    </div>
  );
}
