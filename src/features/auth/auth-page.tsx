// features/auth/ — authentication: login, signup forms, and the protected-route wrapper.

import { useState } from 'react';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';
import { Sparkles, Moon, Star, Sun } from 'lucide-react';
import { APP_NAME } from '@/constants';
import { Starfield } from '@/components/shared/starfield';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { useI18n } from '@/i18n/i18n-provider';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="cosmic-bg fixed inset-0 -z-20" />
      <Starfield count={60} />

      {/* Language switcher */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="absolute right-4 top-4 z-10"
      >
        <LanguageSwitcher />
      </motion.div>

      {/* Brand */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-8 flex flex-col items-center gap-4 text-center"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-accent/20 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-primary/10 shadow-[0_0_40px_-8px_hsl(38_92%_60%/0.4)]">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          {/* Orbiting planets */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3"
          >
            <Sun className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 text-amber-400/70" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-5"
          >
            <Moon className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 text-secondary/60" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-7"
          >
            <Star className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 text-primary/50" />
          </motion.div>
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-wide text-foreground text-glow-gold">
            {t.app.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.app.tagline}</p>
        </div>
      </motion.div>

      <motion.div
        key={mode}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {mode === 'login' ? (
          <LoginForm onSwitch={() => setMode('signup')} />
        ) : (
          <SignupForm onSwitch={() => setMode('login')} />
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8 text-center text-xs text-muted-foreground/60"
      >
        {t.app.tagline} · {new Date().getFullYear()}
      </motion.p>
    </div>
  );
}
