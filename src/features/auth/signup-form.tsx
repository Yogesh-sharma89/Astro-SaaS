// features/auth/ — authentication: login, signup forms, and the protected-route wrapper.

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/shared/glass-card';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';
import { useI18n } from '@/i18n/i18n-provider';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function getPostAuthRoute() {
  return '/onboarding';
}

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-destructive' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-warning' };
  return { score, label: 'Strong', color: 'bg-success' };
}

interface SignupProps {
  onSwitch: () => void;
}

export function SignupForm({ onSwitch }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  const strength = password.length > 0 ? getPasswordStrength(password) : null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 1) {
      toast.error(t.auth.name);
      return;
    }
    if (!email.includes('@')) {
      toast.error(t.auth.email);
      return;
    }
    if (password.length < 6) {
      toast.error(t.auth.atLeast6);
      return;
    }
    setLoading(true);
    try {
      await authService.signup(email, password, name);
      toast.success(t.auth.beginJourney);
      navigate(getPostAuthRoute(), { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard glow="primary" className="w-full max-w-md">
      <div className="space-y-6 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-1 text-center"
        >
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {t.auth.beginJourney}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.auth.createAccountUnlock}
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signup-name" className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.auth.name}
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="signup-name"
                type="text"
                placeholder={t.onboarding.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="h-11 pl-10 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.auth.email}
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 pl-10 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.auth.newPassword}
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t.auth.atLeast6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="h-11 pl-10 pr-10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {strength && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn('h-1 flex-1 rounded-full transition-all', i <= strength.score ? strength.color : 'bg-muted')}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{strength.label}</p>
              </div>
            )}
            {password.length > 0 && password.length < 6 && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <X className="h-3 w-3" /> {t.auth.atLeast6}
              </p>
            )}
            {password.length >= 6 && (
              <p className="flex items-center gap-1 text-xs text-success">
                <Check className="h-3 w-3" /> {t.auth.atLeast6}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="h-11 w-full" size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                {t.auth.creatingAccount}
              </span>
            ) : (
              t.auth.createAccount
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {t.auth.alreadyHaveAccount}{' '}
          <button
            onClick={onSwitch}
            className="font-medium text-accent hover:underline"
          >
            {t.auth.signIn}
          </button>
        </p>
      </div>
    </GlassCard>
  );
}
