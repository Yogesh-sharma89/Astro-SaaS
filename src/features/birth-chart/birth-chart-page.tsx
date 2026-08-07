// features/birth-chart/ — comprehensive birth chart with detailed analysis.

import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/use-profile';
import { useBirthChart, useGenerateBirthChart } from '@/hooks/use-birth-chart';
import { GlassCard } from '@/components/shared/glass-card';
import { LoadingState } from '@/components/shared/loading-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/i18n/i18n-provider';
import {
  AlertCircle, RefreshCw, Sparkles, Loader2, Sun, Moon, Star,
  TrendingUp, Heart, Briefcase, Shield, Zap, Crown, Home,
  Palette, Hash, Clock, Users, BookOpen, Coins, Sparkle,
} from 'lucide-react';
import { ZODIAC_SYMBOLS } from '@/constants';
import { cn } from '@/lib/utils';
import { ChartWheel } from './components/chart-wheel';
import { PlanetCard } from './components/planet-card';
import {
  SIGN_TRAITS, HOUSE_MEANINGS, VEDIC_PLANETS, getNakshatra,
  getLifeAreaPredictions, type LifeAreaPrediction,
} from '@/services/astrology-data';
import type { BirthChart, ZodiacSign } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function BirthChartPage() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: chart, isLoading: chartLoading, isError, refetch } = useBirthChart();
  const generate = useGenerateBirthChart();
  const { t } = useI18n();

  if (profileLoading || chartLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-display text-3xl font-semibold">{t.birthChart.title}</h1>
        <LoadingState variant="detail" />
      </div>
    );
  }

  if (!profile?.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-display text-3xl font-semibold">{t.birthChart.title}</h1>
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

  if (!chart) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="font-display text-3xl font-semibold">{t.birthChart.title}</h1>
        <GlassCard>
          <div className="flex flex-col items-center gap-4 p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <p className="text-muted-foreground">{t.birthChart.notGenerated}</p>
            <Button onClick={() => generate.mutate()} disabled={generate.isPending} size="lg">
              {generate.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.birthChart.generating}</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> {t.birthChart.generate}</>
              )}
            </Button>
            {generate.isError && <p className="text-sm text-destructive">{t.chat.somethingWrong}</p>}
          </div>
        </GlassCard>
      </div>
    );
  }

  return <ChartDisplay chart={chart} />;
}

function ChartDisplay({ chart }: { chart: BirthChart }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'planets' | 'houses' | 'life'>('planets');

  const moonPlanet = chart.planets.find((p) => p.name === 'Moon');
  const nakshatra = moonPlanet ? getNakshatra(moonPlanet.degree) : null;
  const predictions = getLifeAreaPredictions(chart);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-3">
        <h1 className="font-display text-3xl font-semibold text-glow-gold text-foreground">{t.birthChart.title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge className="border border-primary/30 bg-primary/15 text-foreground hover:bg-primary/20">
            <Sun className="mr-1 h-3 w-3" /> {t.birthChart.sun} {ZODIAC_SYMBOLS[chart.sunSign]} {t.zodiac[chart.sunSign] ?? chart.sunSign}
          </Badge>
          <Badge className="border border-secondary/30 bg-secondary/15 text-foreground hover:bg-secondary/20">
            <Moon className="mr-1 h-3 w-3" /> {t.birthChart.moon} {ZODIAC_SYMBOLS[chart.moonSign]} {t.zodiac[chart.moonSign] ?? chart.moonSign}
          </Badge>
          {chart.ascendant && (
            <Badge className="border border-accent/30 bg-accent/15 text-accent hover:bg-accent/20">
              <Star className="mr-1 h-3 w-3" /> {t.birthChart.rising} {ZODIAC_SYMBOLS[chart.ascendant]} {t.zodiac[chart.ascendant] ?? chart.ascendant}
            </Badge>
          )}
          {nakshatra && (
            <Badge className="border border-accent/30 bg-accent/10 text-accent">
              Nakshatra: {nakshatra.name}
            </Badge>
          )}
        </div>
        {!chart.birthTimeKnown && (
          <div className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 p-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-sm text-muted-foreground">{t.birthChart.timeUnknownNote}</p>
          </div>
        )}
      </motion.div>

      {/* Chart Wheel + Big Three */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-2">
        <GlassCard glow="primary">
          <div className="p-6">
            <ChartWheel chart={chart} />
          </div>
        </GlassCard>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-medium text-foreground">Your Cosmic Signature</h2>
          <BigThreeCard
            icon={<Sun className="h-5 w-5 text-primary" />}
            label="Sun Sign"
            sign={chart.sunSign}
            traits={SIGN_TRAITS[chart.sunSign]}
          />
          <BigThreeCard
            icon={<Moon className="h-5 w-5 text-secondary" />}
            label="Moon Sign"
            sign={chart.moonSign}
            traits={SIGN_TRAITS[chart.moonSign]}
          />
          {chart.ascendant && (
            <BigThreeCard
              icon={<Star className="h-5 w-5 text-accent" />}
              label="Rising Sign"
              sign={chart.ascendant}
              traits={SIGN_TRAITS[chart.ascendant]}
            />
          )}
        </div>
      </motion.div>

      {/* Nakshatra Detail */}
      {nakshatra && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard glow="gold">
            <div className="space-y-3 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="font-display text-xl font-medium">Your Nakshatra (Lunar Mansion)</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Nakshatra</p>
                  <p className="font-display text-lg font-medium text-accent">{nakshatra.name}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Ruling Planet</p>
                  <p className="font-medium text-foreground">{nakshatra.ruler}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Deity</p>
                  <p className="font-medium text-foreground">{nakshatra.deity}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Symbol</p>
                  <p className="font-medium text-foreground">{nakshatra.symbol}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Quality</p>
                  <p className="font-medium text-foreground">{nakshatra.quality}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/10 p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Range</p>
                  <p className="font-medium text-foreground">{nakshatra.range}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Tabbed Analysis Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <TabButton active={activeTab === 'planets'} onClick={() => setActiveTab('planets')} icon={<Sparkles className="h-4 w-4" />}>
            Planet Analysis
          </TabButton>
          <TabButton active={activeTab === 'houses'} onClick={() => setActiveTab('houses')} icon={<Home className="h-4 w-4" />}>
            House Analysis
          </TabButton>
          <TabButton active={activeTab === 'life'} onClick={() => setActiveTab('life')} icon={<TrendingUp className="h-4 w-4" />}>
            Life Predictions
          </TabButton>
        </div>

        {activeTab === 'planets' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Each planet in your chart represents a different facet of your personality and life. Click any card to reveal detailed interpretations, challenges, and remedies.
            </p>
            {chart.planets.map((planet) => (
              <PlanetCard key={planet.name} planet={planet} />
            ))}
          </div>
        )}

        {activeTab === 'houses' && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The twelve houses represent different areas of your life. Each house is ruled by a zodiac sign, showing how that life area is colored for you.
            </p>
            {chart.houses.length > 0 ? (
              chart.houses.map((house) => {
                const meaning = HOUSE_MEANINGS.find((h) => h.number === house.number);
                const traits = SIGN_TRAITS[house.sign];
                const planetsInHouse = chart.planets.filter((p) => p.house === house.number);
                return (
                  <GlassCard key={house.number} hover>
                    <div className="space-y-3 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-sm font-bold text-primary">
                              {house.number}
                            </span>
                            <div>
                              <p className="font-medium text-foreground">{meaning?.title ?? `House ${house.number}`}</p>
                              <p className="text-xs text-muted-foreground">{meaning?.area}</p>
                            </div>
                          </div>
                        </div>
                        <Badge className="border border-accent/20 bg-accent/10 text-accent">
                          {ZODIAC_SYMBOLS[house.sign]} {house.sign}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{meaning?.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {meaning?.keywords.map((kw) => (
                          <Badge key={kw} variant="outline" className="border-border text-muted-foreground">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                      {planetsInHouse.length > 0 && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary">Planets in this house</p>
                          <div className="flex flex-wrap gap-2">
                            {planetsInHouse.map((p) => (
                              <span key={p.name} className="text-sm text-foreground">
                                {p.name} in {p.sign} ({p.degree.toFixed(1)}°)
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                        <div><span className="text-muted-foreground">Element:</span> <span className="text-foreground">{traits.element}</span></div>
                        <div><span className="text-muted-foreground">Quality:</span> <span className="text-foreground">{traits.quality}</span></div>
                        <div><span className="text-muted-foreground">Ruler:</span> <span className="text-foreground">{traits.ruler}</span></div>
                        <div><span className="text-muted-foreground">Body:</span> <span className="text-foreground">{meaning?.bodyPart}</span></div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            ) : (
              <GlassCard>
                <div className="flex items-center gap-3 p-8 text-center">
                  <AlertCircle className="h-8 w-8 text-warning" />
                  <p className="text-muted-foreground">House analysis requires your birth time. Please update your profile with your birth time to see house placements.</p>
                </div>
              </GlassCard>
            )}
          </div>
        )}

        {activeTab === 'life' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Based on your planetary positions, here are predictions for key areas of your life with personalized remedies.
            </p>
            {predictions.map((pred, i) => (
              <LifeAreaCard key={i} prediction={pred} index={i} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Lucky Attributes */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <GlassCard>
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-medium">Your Lucky Attributes</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <LuckyItem icon={<Palette className="h-5 w-5 text-accent" />} label="Lucky Color" value={SIGN_TRAITS[chart.sunSign].color} />
              <LuckyItem icon={<Hash className="h-5 w-5 text-primary" />} label="Lucky Numbers" value={SIGN_TRAITS[chart.sunSign].luckyNumbers.join(', ')} />
              <LuckyItem icon={<Clock className="h-5 w-5 text-cosmic-rose" />} label="Lucky Day" value={SIGN_TRAITS[chart.sunSign].luckyDay} />
              <LuckyItem icon={<Sparkles className="h-5 w-5 text-accent" />} label="Gemstone" value={SIGN_TRAITS[chart.sunSign].gemstone} />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function BigThreeCard({ icon, label, sign, traits }: { icon: React.ReactNode; label: string; sign: ZodiacSign; traits: typeof SIGN_TRAITS[ZodiacSign] }) {
  return (
    <GlassCard hover>
      <div className="flex items-start gap-3 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
          {icon}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <span className="text-2xl">{ZODIAC_SYMBOLS[sign]}</span>
          </div>
          <p className="font-display text-lg font-medium text-foreground">{sign}</p>
          <p className="text-xs text-muted-foreground">{traits.description}</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="border-border text-muted-foreground">{traits.element}</Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">{traits.quality}</Badge>
            <Badge variant="outline" className="border-border text-muted-foreground">Ruler: {traits.ruler}</Badge>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

const LIFE_ICONS = [
  <Briefcase className="h-5 w-5 text-primary" />,
  <Heart className="h-5 w-5 text-cosmic-rose" />,
  <Shield className="h-5 w-5 text-success" />,
  <Coins className="h-5 w-5 text-accent" />,
  <Sparkle className="h-5 w-5 text-secondary" />,
];

function LifeAreaCard({ prediction, index }: { prediction: LifeAreaPrediction; index: number }) {
  const icon = LIFE_ICONS[index] ?? <TrendingUp className="h-5 w-5 text-primary" />;
  return (
    <GlassCard hover>
      <div className="space-y-4 p-6">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-display text-lg font-medium text-foreground">{prediction.title}</h3>
          <Badge className="ml-auto border border-accent/20 bg-accent/10 text-accent">
            {prediction.score}% Favorable
          </Badge>
        </div>
        <Progress value={prediction.score} className="h-2 bg-muted" />
        <p className="text-sm leading-relaxed text-muted-foreground">{prediction.description}</p>
        <div className="space-y-2 rounded-lg border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">Recommended Remedies</p>
          </div>
          <ul className="space-y-1.5">
            {prediction.remedies.map((remedy, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {remedy}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}

function LuckyItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/10 p-4 text-center">
      <div className="mb-2 flex justify-center">{icon}</div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-display text-lg font-medium text-foreground">{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
        active
          ? 'bg-primary/15 text-foreground ring-1 ring-primary/30'
          : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
      )}
    >
      {icon}
      {children}
    </button>
  );
}
