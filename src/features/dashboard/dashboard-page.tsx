// features/dashboard/ — the main landing screen after sign-in.

import { useQuery } from '@tanstack/react-query';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/use-profile';
import { getTodayHoroscope } from '@/services/horoscope';
import { getMoonPhase } from '@/utils/moon-phase';
import { GlassCard } from '@/components/shared/glass-card';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/i18n-provider';
import {
  AlertCircle, RefreshCw, Sparkles, Moon, Quote, ArrowRight,
  MessageSquare, CircleDot, Crown, Heart, Briefcase, Zap, Palette, Hash, Clock,
} from 'lucide-react';

export function useTodayHoroscope() {
  const { data: profile } = useProfile();
  return useQuery({
    queryKey: ['todayHoroscope', profile?.birthDate],
    queryFn: () => getTodayHoroscope(profile!),
    enabled: !!profile?.onboardingComplete,
    staleTime: 5 * 60 * 1000,
  });
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const { data: horoscope, isLoading, isError, refetch } = useTodayHoroscope();

  const dateLocale = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : lang === 'ta' ? 'ta-IN' : 'en-US';

  if (profileLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <LoadingState variant="detail" />
      </div>
    );
  }

  if (!profile?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="font-display text-4xl font-semibold">
          {t.dashboard.welcome}, {profile.name.split(' ')[0]}
        </h1>
        <LoadingState variant="detail" />
      </div>
    );
  }

  if (isError || !horoscope) {
    return (
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="font-display text-4xl font-semibold">
          {t.dashboard.welcome}, {profile.name.split(' ')[0]}
        </h1>
        <GlassCard>
          <div className="flex flex-col items-center gap-4 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-muted-foreground">{t.common.retry}</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> {t.common.retry}
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const moon = getMoonPhase();
  const firstName = profile.name.split(' ')[0];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Welcome header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <h1 className="font-display text-4xl font-semibold text-foreground text-glow-gold">
          {t.dashboard.welcome}, {firstName}
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString(dateLocale, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Today's Horoscope */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard glow="gold">
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-medium">{t.dashboard.todaysHoroscope}</h2>
              <span className="ml-auto text-xs text-muted-foreground">{t.zodiac[horoscope.sign] ?? horoscope.sign}</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{horoscope.general}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2 rounded-lg bg-cosmic-rose/5 p-3">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-cosmic-rose" />
                <div>
                  <p className="text-xs font-medium text-foreground">{t.dashboard.love}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{horoscope.love}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-secondary/5 p-3">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-xs font-medium text-foreground">{t.dashboard.career}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{horoscope.career}</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Lucky stats */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-3">
        <GlassCard hover>
          <div className="space-y-2 p-5 text-center">
            <Palette className="mx-auto h-5 w-5 text-accent" />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.dashboard.luckyColor}</p>
            <p className="font-display text-2xl font-medium text-accent">{horoscope.luckyColor}</p>
          </div>
        </GlassCard>
        <GlassCard hover>
          <div className="space-y-2 p-5 text-center">
            <Hash className="mx-auto h-5 w-5 text-primary" />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.dashboard.luckyNumber}</p>
            <p className="font-display text-2xl font-medium text-primary">{horoscope.luckyNumber}</p>
          </div>
        </GlassCard>
        <GlassCard hover>
          <div className="space-y-2 p-5 text-center">
            <Clock className="mx-auto h-5 w-5 text-cosmic-rose" />
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.dashboard.luckyTime}</p>
            <p className="font-display text-2xl font-medium text-cosmic-rose">{horoscope.luckyTime}</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Moon phase + Guidance */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-cosmic-rose" />
              <h2 className="font-display text-xl font-medium">{t.dashboard.moonPhase}</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{moon.emoji}</span>
              <div>
                <p className="font-medium text-foreground">{moon.phase}</p>
                <p className="text-sm text-muted-foreground">{moon.illumination}% · {moon.age}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Quote className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-medium">{t.dashboard.todaysGuidance}</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{horoscope.guidance}</p>
            <div className="border-l-2 border-accent/40 pl-3">
              <p className="font-display text-sm italic text-foreground/80">"{horoscope.quote}"</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick access */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <button onClick={() => navigate('/birth-chart')} className="text-left">
          <GlassCard glow="primary" hover className="group h-full">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <CircleDot className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{t.dashboard.viewBirthChart}</p>
                  <p className="text-sm text-muted-foreground">{t.dashboard.explorePlanetary}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </GlassCard>
        </button>
        <button onClick={() => navigate('/marriage-matching')} className="text-left">
          <GlassCard glow="gold" hover className="group h-full">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-cosmic-rose" />
                <div>
                  <p className="font-medium text-foreground">Marriage Matching</p>
                  <p className="text-sm text-muted-foreground">Check Vedic compatibility</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </GlassCard>
        </button>
        <button onClick={() => navigate('/astrologer')} className="text-left">
          <GlassCard glow="gold" hover className="group h-full">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-accent" />
                <div>
                  <p className="font-medium text-foreground">{t.dashboard.askAstrologer}</p>
                  <p className="text-sm text-muted-foreground">{t.dashboard.getPersonalized}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
          </GlassCard>
        </button>
      </motion.div>

      {/* Kundali upsell */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <button onClick={() => navigate('/kundali')} className="block w-full text-left">
          <GlassCard glow="gold" hover className="group">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                  <Crown className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.dashboard.personalizedKundali}</p>
                  <p className="text-sm text-muted-foreground">{t.dashboard.deepAnalysis}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
            </div>
          </GlassCard>
        </button>
      </motion.div>
    </div>
  );
}
