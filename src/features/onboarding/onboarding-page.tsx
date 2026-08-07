// features/onboarding/ — multi-step onboarding form collecting birth info + preferences.

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/shared/glass-card';
import { LoadingState } from '@/components/shared/loading-state';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useUpsertProfile } from '@/hooks/use-profile';
import { generateBirthChart } from '@/services/astrology';
import { useUserProfileStore } from '@/store/user-profile-store';
import { toast } from 'sonner';
import { LocationInput } from './components/location-input';
import type { GeoLocation } from '@/services/geocoding';
import {
  GENDER_OPTIONS, RELATIONSHIP_OPTIONS,
  GOAL_OPTIONS, INTEREST_OPTIONS,
} from '@/constants';
import type { UserProfile } from '@/types';
import { cn } from '@/lib/utils';
import { ProgressDots, ChipSelector } from './stepper-ui';
import { step1Schema, step2Schema, step3Schema, type Step1Data, type Step2Data, type Step3Data } from './schemas';
import { useI18n } from '@/i18n/i18n-provider';

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<UserProfile>>({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const upsertProfile = useUpsertProfile();
  const setChart = useUserProfileStore((s) => s.setChart);
  const { t, lang } = useI18n();

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema), defaultValues: { name: '', gender: 'female', language: 'English' } });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema), defaultValues: { birthDate: '', birthTime: '', birthTimeUnknown: false, birthPlace: '', latitude: null, longitude: null } });
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null);
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema), defaultValues: { relationshipStatus: 'single', goals: [], interests: [] } });

  async function handleFinalize(combined: UserProfile) {
    setGenerating(true);
    setError(null);
    try {
      const chart = await generateBirthChart(combined);
      combined.chartGeneratedAt = chart.generatedAt;
      combined.onboardingComplete = true;
      await upsertProfile.mutateAsync(combined);
      setChart(chart);
      toast.success(t.onboarding.generatingChart);
      navigate('/dashboard', { replace: true });
    } catch {
      setError(t.chat.somethingWrong);
    } finally {
      setGenerating(false);
    }
  }

  function nextStep1(values: Step1Data) { setData((d) => ({ ...d, ...values })); setStep(1); }
  function nextStep2(values: Step2Data) {
    const lat = geoLocation?.latitude ?? values.latitude ?? null;
    const lng = geoLocation?.longitude ?? values.longitude ?? null;
    setData((d) => ({ ...d, ...values, latitude: lat, longitude: lng, timezone: geoLocation ? Intl.DateTimeFormat().resolvedOptions().timeZone : null }));
    setStep(2);
  }
  async function submitStep3(values: Step3Data) {
    const combined: UserProfile = {
      name: data.name!, gender: data.gender!, language: data.language!,
      birthDate: data.birthDate!, birthTime: data.birthTimeUnknown ? '' : (data.birthTime ?? ''),
      birthTimeUnknown: data.birthTimeUnknown ?? false, birthPlace: data.birthPlace!,
      latitude: data.latitude ?? null, longitude: data.longitude ?? null, timezone: data.timezone ?? null,
      relationshipStatus: values.relationshipStatus, goals: values.goals, interests: values.interests,
      onboardingComplete: false,
    };
    await handleFinalize(combined);
  }

  if (generating) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <h2 className="text-center font-display text-2xl font-semibold">
          {t.onboarding.generatingChart}
        </h2>
        <LoadingState variant="detail" />
      </div>
    );
  }

  // Translate goal and interest options
  const goalOptions = GOAL_OPTIONS.map((g) => t.goals[g as keyof typeof t.goals] ?? g);
  const interestOptions = INTEREST_OPTIONS.map((i) => t.interests[i as keyof typeof t.interests] ?? i);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <ProgressDots current={step} />
        <GlassCard glow="primary">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <FormProvider {...form1}>
                    <form onSubmit={form1.handleSubmit(nextStep1)} className="space-y-5">
                      <h2 className="font-display text-2xl font-semibold">{t.onboarding.tellUsAboutYou}</h2>
                      <div className="space-y-2">
                        <Label htmlFor="ob-name">{t.onboarding.name}</Label>
                        <Input id="ob-name" {...form1.register('name')} placeholder={t.onboarding.namePlaceholder} />
                        {form1.formState.errors.name && <p className="text-xs text-destructive">{form1.formState.errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>{t.onboarding.gender}</Label>
                        <div className="flex flex-wrap gap-2">
                          {GENDER_OPTIONS.map((g) => (
                            <button key={g.value} type="button" onClick={() => form1.setValue('gender', g.value as Step1Data['gender'])}
                              className={cn('rounded-full border px-4 py-2 text-sm transition-all', form1.watch('gender') === g.value ? 'border-primary bg-primary/20 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
                              {t.genders[g.value as keyof typeof t.genders] ?? g.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ob-lang">{t.onboarding.language}</Label>
                        <select id="ob-lang" {...form1.register('language')} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground">
                          <option value="English" className="bg-popover">English</option>
                          <option value="Hindi" className="bg-popover">हिन्दी (Hindi)</option>
                          <option value="Marathi" className="bg-popover">मराठी (Marathi)</option>
                          <option value="Tamil" className="bg-popover">தமிழ் (Tamil)</option>
                        </select>
                      </div>
                      <Button type="submit" className="w-full" size="lg">{t.onboarding.continue}</Button>
                    </form>
                  </FormProvider>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <FormProvider {...form2}>
                    <form onSubmit={form2.handleSubmit(nextStep2)} className="space-y-5">
                      <h2 className="font-display text-2xl font-semibold">{t.onboarding.yourBirthDetails}</h2>
                      <div className="space-y-2">
                        <Label htmlFor="ob-date">{t.onboarding.birthDate}</Label>
                        <Input id="ob-date" type="date" {...form2.register('birthDate')} />
                        {form2.formState.errors.birthDate && <p className="text-xs text-destructive">{form2.formState.errors.birthDate.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ob-time">{t.onboarding.birthTime}</Label>
                        <Input id="ob-time" type="time" {...form2.register('birthTime')} disabled={form2.watch('birthTimeUnknown')} />
                        <label className="flex items-center gap-2 text-sm text-muted-foreground">
                          <input type="checkbox" {...form2.register('birthTimeUnknown')} className="accent-primary" />
                          {t.onboarding.dontKnowTime}
                        </label>
                        {form2.formState.errors.birthTime && <p className="text-xs text-destructive">{form2.formState.errors.birthTime.message}</p>}
                      </div>
                      <LocationInput
                        value={form2.watch('birthPlace')}
                        onChange={(v) => form2.setValue('birthPlace', v)}
                        onResolved={(loc) => {
                          setGeoLocation(loc);
                          if (loc) {
                            form2.setValue('latitude', loc.latitude);
                            form2.setValue('longitude', loc.longitude);
                          } else {
                            form2.setValue('latitude', null);
                            form2.setValue('longitude', null);
                          }
                        }}
                        resolvedLocation={geoLocation}
                      />
                      {form2.formState.errors.birthPlace && <p className="text-xs text-destructive">{form2.formState.errors.birthPlace.message}</p>}
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setStep(0)}>{t.onboarding.back}</Button>
                        <Button type="submit" className="flex-1" size="lg">{t.onboarding.continue}</Button>
                      </div>
                    </form>
                  </FormProvider>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                  <FormProvider {...form3}>
                    <form onSubmit={form3.handleSubmit(submitStep3)} className="space-y-5">
                      <h2 className="font-display text-2xl font-semibold">{t.onboarding.yourIntentions}</h2>
                      <div className="space-y-2">
                        <Label>{t.onboarding.relationshipStatus}</Label>
                        <div className="flex flex-wrap gap-2">
                          {RELATIONSHIP_OPTIONS.map((r) => (
                            <button key={r.value} type="button" onClick={() => form3.setValue('relationshipStatus', r.value as Step3Data['relationshipStatus'])}
                              className={cn('rounded-full border px-4 py-2 text-sm transition-all', form3.watch('relationshipStatus') === r.value ? 'border-primary bg-primary/20 text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}>
                              {t.relationships[r.value as keyof typeof t.relationships] ?? r.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.onboarding.goals}</Label>
                        <ChipSelector options={goalOptions} selected={form3.watch('goals')} onToggle={(v) => {
                          const cur = form3.getValues('goals');
                          const original = GOAL_OPTIONS[cur.indexOf(v) >= 0 ? cur.indexOf(v) : cur.length];
                          form3.setValue('goals', cur.includes(v) ? cur.filter((g) => g !== v) : [...cur, v]);
                        }} />
                        {form3.formState.errors.goals && <p className="text-xs text-destructive">{form3.formState.errors.goals.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>{t.onboarding.interests}</Label>
                        <ChipSelector options={interestOptions} selected={form3.watch('interests')} onToggle={(v) => {
                          const cur = form3.getValues('interests');
                          form3.setValue('interests', cur.includes(v) ? cur.filter((g) => g !== v) : [...cur, v]);
                        }} />
                        {form3.formState.errors.interests && <p className="text-xs text-destructive">{form3.formState.errors.interests.message}</p>}
                      </div>
                      {error && <p className="text-sm text-destructive">{error}</p>}
                      <div className="flex gap-3">
                        <Button type="button" variant="outline" onClick={() => setStep(1)}>{t.onboarding.back}</Button>
                        <Button type="submit" className="flex-1" size="lg">{t.onboarding.generateMyChart}</Button>
                      </div>
                    </form>
                  </FormProvider>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
