// features/auth/ — authentication: login, signup forms, and the protected-route wrapper.

import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/shared/glass-card';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useI18n } from '@/i18n/i18n-provider';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function getPostAuthRoute() {
  return '/onboarding';
}

interface LoginProps {
  onSwitch: () => void;
}

export function LoginForm({ onSwitch }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const from = (location.state as { from?: string })?.from ?? getPostAuthRoute();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
      await authService.login(email, password);
      toast.success(t.auth.welcomeBack);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
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
            {t.auth.welcomeBack}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t.auth.signInContinue}
          </p>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.auth.email}
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="login-email"
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
            <Label htmlFor="login-password" className="text-xs uppercase tracking-wide text-muted-foreground">
              {t.auth.password}
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
          </div>
          <Button type="submit" disabled={loading} className="h-11 w-full" size="lg">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                {t.auth.signingIn}
              </span>
            ) : (
              t.auth.signIn
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          {t.auth.newToAstralis}{' '}
          <button
            onClick={onSwitch}
            className="font-medium text-accent hover:underline"
          >
            {t.auth.createAccount}
          </button>
        </p>
      </div>
    </GlassCard>
  );
}
