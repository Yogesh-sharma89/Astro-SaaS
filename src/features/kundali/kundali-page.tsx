// features/kundali/ — personalized kundali with pro features and PDF export.

import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/use-profile';
import { useBirthChart } from '@/hooks/use-birth-chart';
import { useSubscription } from '@/hooks/use-subscription';
import { GlassCard } from '@/components/shared/glass-card';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/i18n/i18n-provider';
import {
  Sparkles, Lock, Sun, Moon, Star, TrendingUp, Heart, Briefcase,
  Shield, Zap, Crown, AlertCircle, ChevronRight, Download, FileText, CheckCircle2,
  Calendar, Globe, Sparkle,
} from 'lucide-react';
import { ZODIAC_SYMBOLS, PLANET_SYMBOLS } from '@/constants';
import {
  SIGN_TRAITS, VEDIC_PLANETS, getNakshatra, getLifeAreaPredictions,
  type LifeAreaPrediction,
} from '@/services/astrology-data';
import type { BirthChart, ZodiacSign, PlanetName } from '@/types';
import { generateKundaliPDF } from './pdf-generator';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const DASHA_PERIODS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function getPlanet(chart: BirthChart | null, name: PlanetName) {
  return chart?.planets.find((p) => p.name === name) ?? null;
}

function CompatibilityMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5 bg-muted" />
    </div>
  );
}

function LockedFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/20 p-5">
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
            <Lock className="h-5 w-5 text-accent" />
          </div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="space-y-3 opacity-30">
        <div className="h-3 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
    </div>
  );
}

export function KundaliPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: chart, isLoading: chartLoading } = useBirthChart();
  const { data: subscription } = useSubscription();
  const { t } = useI18n();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const isPaid = subscription?.status === 'active' && (subscription.plan === 'pro' || subscription.plan === 'premium');
  const isPremium = subscription?.status === 'active' && subscription.plan === 'premium';

  if (profileLoading || chartLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-display text-3xl font-semibold">{t.kundali.title}</h1>
        <LoadingState variant="detail" />
      </div>
    );
  }

  if (!profile?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!chart) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-display text-3xl font-semibold">{t.kundali.title}</h1>
        <GlassCard>
          <div className="flex flex-col items-center gap-4 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">{t.birthChart.notGenerated}</p>
            <Button onClick={() => window.location.href = '/birth-chart'}>
              {t.nav.birthChart}
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  const moonPlanet = chart.planets.find((p) => p.name === 'Moon');
  const nakshatra = moonPlanet ? getNakshatra(moonPlanet.degree) : null;
  const predictions = getLifeAreaPredictations(chart);

  // Dasha calculation
  const nakshatraIndex = moonPlanet ? Math.floor((moonPlanet.degree / 360) * 27) : 0;
  const dashaStartIndex = nakshatraIndex % 9;
  const birthYear = new Date(profile.birthDate).getFullYear();
  const dashaSequence = DASHA_ORDER.map((_, i) => DASHA_ORDER[(dashaStartIndex + i) % 9]);
  let currentYear = birthYear;
  const dashaTimeline = dashaSequence.map((lord) => {
    const years = DASHA_PERIODS[lord] ?? 7;
    const start = currentYear;
    const end = currentYear + years;
    currentYear = end;
    return { lord, start, end, years };
  });
  const now = new Date().getFullYear();
  const currentDasha = dashaTimeline.find((d) => now >= d.start && now < d.end);
  const nextDasha = dashaTimeline.find((d) => d.start >= now);

  async function handleGeneratePDF() {
    if (!chart || !profile) return;
    setGenerating(true);
    try {
      const url = generateKundaliPDF(chart, profile, { nakshatra: nakshatra?.name ?? 'Unknown', isPaid });
      setPdfUrl(url);
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-accent" />
          <h1 className="font-display text-3xl font-semibold text-foreground">{t.kundali.title}</h1>
          {isPaid && (
            <Badge className="bg-accent/20 text-accent">
              <CheckCircle2 className="mr-1 h-3 w-3" /> {subscription!.plan === 'premium' ? 'Premium' : 'Pro'}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{t.kundali.subtitle}</p>
      </motion.div>

      {/* PDF Download / Viewer section for paid users */}
      {isPaid && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard glow="gold">
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl font-medium">{t.kundaliDetails.pdfTitle}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{t.kundaliDetails.pdfDesc}</p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleGeneratePDF} disabled={generating}>
                  {generating ? (
                    <><Zap className="mr-2 h-4 w-4 animate-spin" /> {t.kundaliDetails.generatePdf}…</>
                  ) : pdfUrl ? (
                    <><Download className="mr-2 h-4 w-4" /> {t.kundaliDetails.regeneratePdf}</>
                  ) : (
                    <><Download className="mr-2 h-4 w-4" /> {t.kundaliDetails.generatePdf}</>
                  )}
                </Button>
                {pdfUrl && (
                  <a href={pdfUrl} download="kundali-future-prediction.html">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" /> {t.kundaliDetails.download}
                    </Button>
                  </a>
                )}
              </div>
              {pdfUrl && (
                <div className="overflow-hidden rounded-lg border border-border">
                  <iframe src={pdfUrl} title="Kundali PDF Preview" className="h-[600px] w-full" />
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Big Three Summary */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard glow="gold">
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-medium">{t.birthChartDetails.cosmicSignature}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {getPlanet(chart, 'Sun') && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                  <Sun className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.birthChart.sun}</p>
                  <p className="font-display text-2xl font-medium text-foreground">
                    {ZODIAC_SYMBOLS[chart.sunSign]} {t.zodiac[chart.sunSign] ?? chart.sunSign}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{SIGN_TRAITS[chart.sunSign].element} · {SIGN_TRAITS[chart.sunSign].quality}</p>
                </div>
              )}
              {getPlanet(chart, 'Moon') && (
                <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4 text-center">
                  <Moon className="mx-auto mb-2 h-6 w-6 text-secondary" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.birthChart.moon}</p>
                  <p className="font-display text-2xl font-medium text-foreground">
                    {ZODIAC_SYMBOLS[chart.moonSign]} {t.zodiac[chart.moonSign] ?? chart.moonSign}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{SIGN_TRAITS[chart.moonSign].element} · {SIGN_TRAITS[chart.moonSign].quality}</p>
                </div>
              )}
              {chart.ascendant && (
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-center">
                  <Star className="mx-auto mb-2 h-6 w-6 text-accent" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.birthChart.rising}</p>
                  <p className="font-display text-2xl font-medium text-foreground">
                    {ZODIAC_SYMBOLS[chart.ascendant]} {t.zodiac[chart.ascendant] ?? chart.ascendant}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{SIGN_TRAITS[chart.ascendant].element} · {SIGN_TRAITS[chart.ascendant].quality}</p>
                </div>
              )}
            </div>
            {isPaid && nakshatra && (
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-center">
                <p className="text-xs text-muted-foreground">{t.birthChartDetails.nakshatra}</p>
                <p className="font-display text-lg font-medium text-accent">{nakshatra.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.birthChartDetails.rulingPlanet}: {nakshatra.ruler} · {t.birthChartDetails.deity}: {nakshatra.deity}
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </motion.div>

      {/* Life Aspect Scores */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <div className="space-y-5 p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-medium">{t.kundali.lifeAspect}</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-4 rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-medium">{t.dashboard.career}</h3>
                </div>
                <CompatibilityMeter label={t.kundali.careerPotential} value={predictions[0]?.score ?? 60} />
              </div>
              <div className="space-y-4 rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-cosmic-rose" />
                  <h3 className="text-sm font-medium">{t.dashboard.love}</h3>
                </div>
                <CompatibilityMeter label={t.kundali.relationshipHarmony} value={predictions[1]?.score ?? 60} />
              </div>
              <div className="space-y-4 rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-success" />
                  <h3 className="text-sm font-medium">{t.horoscope.health}</h3>
                </div>
                <CompatibilityMeter label={t.kundali.physicalEnergy} value={predictions[2]?.score ?? 60} />
              </div>
              <div className="space-y-4 rounded-lg border border-border/50 p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-medium">{t.kundali.growthPotential}</h3>
                </div>
                <CompatibilityMeter label={t.kundali.growthPotential} value={predictions[3]?.score ?? 60} />
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Dasha Timeline (Pro feature) */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-medium text-foreground">{t.kundaliDetails.dashaTimeline}</h2>
          {!isPaid && <Badge className="border border-accent/20 bg-accent/10 text-accent">Pro</Badge>}
        </div>
        {isPaid ? (
          <GlassCard>
            <div className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">{t.kundali.dashaDesc}</p>
              {currentDasha && (
                <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <p className="font-medium text-foreground">{t.kundaliDetails.currentDasha}: {currentDasha.lord}</p>
                    <Badge className="ml-auto bg-accent/20 text-accent">{currentDasha.start} – {currentDasha.end}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{getDashaEffectText(currentDasha.lord)}</p>
                </div>
              )}
              {nextDasha && (
                <div className="rounded-lg border border-border/50 bg-muted/10 p-4">
                  <p className="text-sm font-medium text-foreground">{t.kundaliDetails.dashaNext}: {nextDasha.lord} ({nextDasha.start})</p>
                  <p className="mt-1 text-sm text-muted-foreground">{getDashaEffectText(nextDasha.lord)}</p>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Timeline</p>
                {dashaTimeline.map((d, i) => (
                  <div key={i} className={cn('flex items-center gap-3 rounded-lg border p-3', currentDasha?.lord === d.lord ? 'border-accent/30 bg-accent/5' : 'border-border/50')}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{d.lord}</p>
                      <p className="text-xs text-muted-foreground">{d.start} – {d.end} ({d.years} years)</p>
                    </div>
                    {currentDasha?.lord === d.lord && <Badge className="bg-accent/20 text-accent">Current</Badge>}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        ) : (
          <LockedFeature title={t.kundali.dashaPeriods} description={t.kundali.dashaDesc} />
        )}
      </motion.div>

      {/* Yearly Transits (Pro feature) */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-medium text-foreground">{t.kundaliDetails.yearlyTransitForecast}</h2>
          {!isPaid && <Badge className="border border-accent/20 bg-accent/10 text-accent">Pro</Badge>}
        </div>
        {isPaid ? (
          <GlassCard>
            <div className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">{t.kundali.transitsDesc}</p>
              <div className="space-y-3">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="font-medium text-foreground">Saturn Transit in Pisces</p>
                  <p className="mt-1 text-sm text-muted-foreground">Saturn brings spiritual discipline and emotional restructuring. A time for building lasting inner strength and facing karmic lessons.</p>
                  <p className="mt-1 text-xs text-muted-foreground"><span className="font-medium">Life Area:</span> Spirituality, emotional foundation · <span className="font-medium">Timing:</span> Throughout the year</p>
                </div>
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                  <p className="font-medium text-foreground">Jupiter Transit in Gemini</p>
                  <p className="mt-1 text-sm text-muted-foreground">Jupiter expands communication, learning, and social connections. New opportunities for education and networking arise.</p>
                  <p className="mt-1 text-xs text-muted-foreground"><span className="font-medium">Life Area:</span> Communication, education · <span className="font-medium">Timing:</span> Mid-year peak</p>
                </div>
              </div>
            </div>
          </GlassCard>
        ) : (
          <LockedFeature title={t.kundali.yearlyTransits} description={t.kundali.transitsDesc} />
        )}
      </motion.div>

      {/* Remedial Measures (Premium feature) */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-success" />
          <h2 className="font-display text-xl font-medium text-foreground">{t.kundali.remedialMeasures}</h2>
          {!isPremium && <Badge className="border border-accent/20 bg-accent/10 text-accent">Premium</Badge>}
        </div>
        {isPremium ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {chart.planets.filter((p) => VEDIC_PLANETS[p.name]).map((p) => {
              const vedic = VEDIC_PLANETS[p.name];
              return (
                <GlassCard key={p.name} hover>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-accent">{PLANET_SYMBOLS[p.name]}</span>
                      <p className="font-medium text-foreground">{p.name} in {p.sign}</p>
                    </div>
                    <div className="rounded-md border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
                      <p><span className="font-medium text-foreground">{t.birthChartDetails.deityLabel}</span> {vedic.deity} · <span className="font-medium text-foreground">{t.birthChartDetails.dayLabel}</span> {vedic.day}</p>
                      <p><span className="font-medium text-foreground">{t.birthChartDetails.gemstoneLabel}</span> {vedic.gemstone} · <span className="font-medium text-foreground">{t.birthChartDetails.colorLabel}</span> {vedic.color}</p>
                      <p className="mt-1"><span className="font-medium text-foreground">{t.birthChartDetails.mantra}</span> {vedic.mantra}</p>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        ) : (
          <LockedFeature title={t.kundali.remedialMeasures} description={t.kundali.remedialDesc} />
        )}
      </motion.div>

      {/* Upgrade prompt for free users */}
      {!isPaid && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard glow="gold" hover>
            <button onClick={() => window.location.href = '/pricing'} className="flex w-full items-center justify-between p-6 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10">
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-display text-lg font-medium text-foreground">{t.kundali.unlockAll}</p>
                  <p className="text-sm text-muted-foreground">{t.kundali.unlockPro}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-accent" />
            </button>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}

function getDashaEffectText(lord: string): string {
  const effects: Record<string, string> = {
    Ketu: 'A period of spiritual growth, detachment, and introspection. Past karmas surface for resolution.',
    Venus: 'A period of love, luxury, comfort, and artistic expression. Relationships flourish.',
    Sun: 'A period of authority, recognition, and career advancement.',
    Moon: 'A period of emotional growth, family, and public life.',
    Mars: 'A period of energy, courage, and action. Career takes off but conflicts may arise.',
    Rahu: 'A period of ambition, worldly desires, and unconventional paths.',
    Jupiter: 'A period of wisdom, expansion, and good fortune. A blessed period.',
    Saturn: 'A period of discipline, hard work, and karmic lessons. Slow but steady progress.',
    Mercury: 'A period of intellect, communication, and business.',
  };
  return effects[lord] ?? 'This period brings the energies of the ruling planet into focus.';
}
