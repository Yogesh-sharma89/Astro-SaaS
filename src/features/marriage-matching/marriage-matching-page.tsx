// features/marriage-matching/ — Vedic Ashta Koota marriage compatibility with i18n.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/i18n/i18n-provider';
import {
  Heart, Sparkles, User, Loader2,
  CheckCircle2, AlertCircle, Shield,
  ChevronRight, Moon,
} from 'lucide-react';
import { ZODIAC_SYMBOLS } from '@/constants';
import {
  calculateCompatibility, getNakshatra, SIGN_TRAITS,
  type CompatibilityResult,
} from '@/services/astrology-data';
import { generateBirthChart } from '@/services/astrology';
import { geocodingService, type GeoLocation } from '@/services/geocoding';
import { LocationInput } from '@/features/onboarding/components/location-input';
import type { UserProfile, ZodiacSign } from '@/types';
import { cn } from '@/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface PersonInput {
  name: string;
  birthDate: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  birthPlace: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
}

const EMPTY_PERSON: PersonInput = {
  name: '', birthDate: '', birthTime: '', birthTimeUnknown: false,
  birthPlace: '', latitude: null, longitude: null, timezone: null,
};

export function MarriageMatchingPage() {
  const { t } = useI18n();
  const [boy, setBoy] = useState<PersonInput>(EMPTY_PERSON);
  const [girl, setGirl] = useState<PersonInput>(EMPTY_PERSON);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [boySign, setBoySign] = useState<ZodiacSign | null>(null);
  const [girlSign, setGirlSign] = useState<ZodiacSign | null>(null);
  const [boyNakshatra, setBoyNakshatra] = useState<string>('');
  const [girlNakshatra, setGirlNakshatra] = useState<string>('');

  async function handleCalculate() {
    if (!boy.birthDate || !girl.birthDate) return;
    setLoading(true);
    setResult(null);
    try {
      const boyProfile: UserProfile = {
        ...boy,
        gender: 'male',
        language: 'English',
        relationshipStatus: 'single',
        goals: [],
        interests: [],
        onboardingComplete: true,
      };
      const girlProfile: UserProfile = {
        ...girl,
        gender: 'female',
        language: 'English',
        relationshipStatus: 'single',
        goals: [],
        interests: [],
        onboardingComplete: true,
      };

      const [boyChart, girlChart] = await Promise.all([
        generateBirthChart(boyProfile),
        generateBirthChart(girlProfile),
      ]);

      const boyMoonDegree = boyChart.planets.find((p) => p.name === 'Moon')?.degree ?? 0;
      const girlMoonDegree = girlChart.planets.find((p) => p.name === 'Moon')?.degree ?? 0;

      const bNak = getNakshatra(boyMoonDegree);
      const gNak = getNakshatra(girlMoonDegree);

      setBoySign(boyChart.moonSign);
      setGirlSign(girlChart.moonSign);
      setBoyNakshatra(bNak.name);
      setGirlNakshatra(gNak.name);

      const compat = calculateCompatibility(
        bNak.name, gNak.name,
        boyChart.moonSign, girlChart.moonSign,
      );
      setResult(compat);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setBoy(EMPTY_PERSON);
    setGirl(EMPTY_PERSON);
    setBoySign(null);
    setGirlSign(null);
    setBoyNakshatra('');
    setGirlNakshatra('');
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-2">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-cosmic-rose" />
          <h1 className="font-display text-3xl font-semibold text-glow-gold text-foreground">
            {t.marriage.title}
          </h1>
        </div>
        <p className="text-muted-foreground">{t.marriage.subtitle}</p>
      </motion.div>

      {!result && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <PersonForm
              title={t.marriage.groomsDetails}
              icon={<User className="h-5 w-5 text-primary" />}
              accent="primary"
              person={boy}
              onChange={setBoy}
            />
            <PersonForm
              title={t.marriage.bridesDetails}
              icon={<Heart className="h-5 w-5 text-cosmic-rose" />}
              accent="rose"
              person={girl}
              onChange={setGirl}
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleCalculate}
              disabled={loading || !boy.birthDate || !girl.birthDate}
              size="lg"
              className="min-w-[200px]"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.marriage.calculating}</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> {t.marriage.calculate}</>
              )}
            </Button>
          </div>
          {(!boy.birthDate || !girl.birthDate) && (
            <p className="text-center text-sm text-muted-foreground">
              {t.marriage.enterBothDates}
            </p>
          )}
        </motion.div>
      )}

      {result && boySign && girlSign && (
        <ResultDisplay
          result={result}
          boySign={boySign}
          girlSign={girlSign}
          boyNakshatra={boyNakshatra}
          girlNakshatra={girlNakshatra}
          boyName={boy.name || t.marriage.groom}
          girlName={girl.name || t.marriage.bride}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

function PersonForm({
  title, icon, person, onChange, accent,
}: {
  title: string;
  icon: React.ReactNode;
  person: PersonInput;
  onChange: (p: PersonInput) => void;
  accent: 'primary' | 'rose';
}) {
  const { t } = useI18n();
  const [resolvedLocation, setResolvedLocation] = useState<GeoLocation | null>(null);
  const ringClass = accent === 'primary' ? 'border-primary/30' : 'border-cosmic-rose/30';
  const bgClass = accent === 'primary' ? 'bg-primary/5' : 'bg-cosmic-rose/5';

  return (
    <GlassCard>
      <div className="space-y-4 p-6">
        <div className={cn('flex items-center gap-2 rounded-lg p-3', bgClass)}>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border', ringClass, bgClass)}>
            {icon}
          </div>
          <h2 className="font-display text-lg font-medium text-foreground">{title}</h2>
        </div>

        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">{t.marriage.fullName}</Label>
            <Input
              value={person.name}
              onChange={(e) => onChange({ ...person, name: e.target.value })}
              placeholder={t.onboarding.namePlaceholder}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t.marriage.dateOfBirth}</Label>
            <Input
              type="date"
              value={person.birthDate}
              onChange={(e) => onChange({ ...person, birthDate: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">{t.marriage.timeOfBirth}</Label>
            <Input
              type="time"
              value={person.birthTime}
              disabled={person.birthTimeUnknown}
              onChange={(e) => onChange({ ...person, birthTime: e.target.value })}
              className="mt-1"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={person.birthTimeUnknown}
              onChange={(e) => onChange({ ...person, birthTimeUnknown: e.target.checked, birthTime: e.target.checked ? '' : person.birthTime })}
              className="rounded"
            />
            {t.marriage.timeUnknown}
          </label>
          <LocationInput
            value={person.birthPlace}
            onChange={(value) => onChange({ ...person, birthPlace: value })}
            onResolved={(loc) => {
              setResolvedLocation(loc);
              if (loc) {
                onChange({ ...person, birthPlace: loc.displayName, latitude: loc.latitude, longitude: loc.longitude });
              }
            }}
            resolvedLocation={resolvedLocation}
          />
        </div>
      </div>
    </GlassCard>
  );
}

function ResultDisplay({
  result, boySign, girlSign, boyNakshatra, girlNakshatra, boyName, girlName, onReset,
}: {
  result: CompatibilityResult;
  boySign: ZodiacSign;
  girlSign: ZodiacSign;
  boyNakshatra: string;
  girlNakshatra: string;
  boyName: string;
  girlName: string;
  onReset: () => void;
}) {
  const { t } = useI18n();

  const verdictKey = result.verdict === 'Excellent Match' ? 'excellentMatch'
    : result.verdict === 'Very Good Match' ? 'veryGoodMatch'
    : result.verdict === 'Good Match' ? 'goodMatch'
    : result.verdict === 'Average Match' ? 'averageMatch'
    : 'challengingMatch';

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
      {/* Score Banner */}
      <GlassCard glow="gold">
        <div className="space-y-4 p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">{boyName}</p>
              <p className="text-xs text-muted-foreground">{ZODIAC_SYMBOLS[boySign]} {t.zodiac[boySign] ?? boySign}</p>
            </div>
            <Heart className="h-8 w-8 text-cosmic-rose" />
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cosmic-rose/30 bg-cosmic-rose/10">
                <Heart className="h-6 w-6 text-cosmic-rose" />
              </div>
              <p className="text-sm font-medium text-foreground">{girlName}</p>
              <p className="text-xs text-muted-foreground">{ZODIAC_SYMBOLS[girlSign]} {t.zodiac[girlSign] ?? girlSign}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-4">
              <span className="font-display text-5xl font-bold text-foreground">{result.totalScore}</span>
              <span className="font-display text-3xl text-muted-foreground">/ {result.maxScore}</span>
            </div>
            <p className={cn('font-display text-xl font-medium', result.verdictColor)}>
              {t.marriage[verdictKey as keyof typeof t.marriage] ?? result.verdict}
            </p>
            <Progress value={result.percentage} className="mx-auto h-2 max-w-xs bg-muted" />
            <p className="text-sm text-muted-foreground">{result.percentage}% {t.marriage.compatible}</p>
          </div>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
        </div>
      </GlassCard>

      {/* Nakshatra Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard>
          <div className="space-y-2 p-5">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-secondary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.marriage.groomNakshatra}</p>
            </div>
            <p className="font-display text-lg font-medium text-foreground">{boyNakshatra}</p>
            <p className="text-xs text-muted-foreground">
              {t.birthChart.moon} {t.zodiac[boySign] ?? boySign} · {SIGN_TRAITS[boySign].element}
            </p>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="space-y-2 p-5">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-cosmic-rose" />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.marriage.brideNakshatra}</p>
            </div>
            <p className="font-display text-lg font-medium text-foreground">{girlNakshatra}</p>
            <p className="text-xs text-muted-foreground">
              {t.birthChart.moon} {t.zodiac[girlSign] ?? girlSign} · {SIGN_TRAITS[girlSign].element}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Ashta Koota Breakdown */}
      <GlassCard>
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="font-display text-xl font-medium">{t.marriage.ashtaKoota}</h2>
          </div>
          <p className="text-sm text-muted-foreground">{t.marriage.ashtaKootaDesc}</p>
          <div className="space-y-3">
            {result.kootas.map((koota, i) => (
              <KootaRow key={i} koota={koota} />
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <GlassCard glow="gold">
          <div className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <h2 className="font-display text-xl font-medium">{t.marriage.recommendations}</h2>
            </div>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 p-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-xs font-bold text-accent">
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}

      {/* Action */}
      <div className="flex justify-center gap-3">
        <Button onClick={onReset} variant="outline">
          <User className="mr-2 h-4 w-4" /> {t.marriage.checkAnother}
        </Button>
      </div>
    </motion.div>
  );
}

function KootaRow({ koota }: { koota: CompatibilityResult['kootas'][number] }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const percentage = (koota.points / koota.maxPoints) * 100;
  const passed = koota.compatible;

  const kootaLabelMap: Record<string, string> = {
    'वर्ण (Varna)': t.marriage.varna,
    'वश्य (Vashya)': t.marriage.vashya,
    'तारा (Tara)': t.marriage.tara,
    'योनि (Yoni)': t.marriage.yoni,
    'ग्रह मैत्री (Graha Maitri)': t.marriage.grahaMaitri,
    'गण (Gana)': t.marriage.gana,
    'भकूट (Bhakoot)': t.marriage.bhakoot,
    'नाड़ी (Nadi)': t.marriage.nadi,
  };

  const label = kootaLabelMap[koota.name] ?? koota.englishName;

  return (
    <div className="rounded-lg border border-border/50 bg-muted/10">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', passed ? 'border-success/30 bg-success/10' : 'border-destructive/30 bg-destructive/10')}>
          {passed ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {koota.points} / {koota.maxPoints} {t.marriage.points}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{koota.englishName}</p>
          <Progress value={percentage} className="mt-1.5 h-1 bg-muted" />
        </div>
        <ChevronRight className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', expanded && 'rotate-90')} />
      </button>
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden"
        >
          <div className="space-y-3 px-4 pb-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-md border border-primary/20 bg-primary/5 p-2">
                <p className="text-muted-foreground">{t.marriage.groomValue}</p>
                <p className="font-medium text-foreground">{koota.boyValue}</p>
              </div>
              <div className="rounded-md border border-cosmic-rose/20 bg-cosmic-rose/5 p-2">
                <p className="text-muted-foreground">{t.marriage.brideValue}</p>
                <p className="font-medium text-foreground">{koota.girlValue}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{koota.description}</p>
            <div className="flex items-center gap-1.5 text-xs">
              {passed ? (
                <Badge className="bg-success/15 text-success">{t.marriage.favorable}</Badge>
              ) : (
                <Badge className="bg-warning/15 text-warning">{t.marriage.notFavorable}</Badge>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
