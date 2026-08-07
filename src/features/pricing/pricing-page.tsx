// features/pricing/ — subscription tiers and pricing page with Razorpay (INR).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/shared/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Star, Zap, Lock, ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useI18n } from '@/i18n/i18n-provider';
import { useAuthStore } from '@/store/auth-store';
import {
  razorpayService, loadRazorpayScript, formatINR,
  type PlanPricing,
} from '@/services/razorpay';
import { useSubscription, useInvalidateSubscription } from '@/hooks/use-subscription';

interface PlanTier {
  id: string;
  nameKey: 'free' | 'pro' | 'premium';
  monthlyPaise: number;
  yearlyPaise: number;
  descKey: 'freeDesc' | 'proDesc' | 'premiumDesc';
  icon: typeof Crown;
  highlight?: boolean;
}

const TIERS: PlanTier[] = [
  {
    id: 'free', nameKey: 'free', monthlyPaise: 0, yearlyPaise: 0,
    descKey: 'freeDesc', icon: Sparkles,
  },
  {
    id: 'pro', nameKey: 'pro', monthlyPaise: 79900, yearlyPaise: 767000,
    descKey: 'proDesc', icon: Crown, highlight: true,
  },
  {
    id: 'premium', nameKey: 'premium', monthlyPaise: 149900, yearlyPaise: 1439000,
    descKey: 'premiumDesc', icon: Star,
  },
];

const PLAN_FEATURES: Record<string, string[]> = {
  free: [
    'Daily horoscope (राशिफल)',
    'Basic birth chart (जन्म पत्रिका)',
    'Sun, Moon & Rising signs',
    'AI Astrologer (5 messages/day)',
    'Moon phase tracker',
  ],
  pro: [
    'Everything in Free',
    'Personalized Kundali (कुंडली)',
    'Planet-by-planet analysis',
    'House analysis & life aspects',
    'Unlimited AI Astrologer',
    'Career & relationship scores',
    'Yearly transit forecast (गोचर)',
  ],
  premium: [
    'Everything in Pro',
    'Vimshottari Dasha periods (दशा)',
    'Relationship compatibility (मिलन)',
    'Remedial measures & gemstones (उपाय)',
    'Personalized mantras & rituals',
    'Priority support',
    'Early access to new features',
  ],
};

export function PricingPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);
  const { data: subscription } = useSubscription();
  const invalidateSubscription = useInvalidateSubscription();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState<string | null>(null);

  const currentPlan = subscription?.status === 'active' ? subscription.plan : 'free';
  const isPaid = currentPlan === 'pro' || currentPlan === 'premium';

  async function handleSelect(tier: PlanTier) {
    if (tier.id === 'free') return;

    try {
      setProcessing(tier.id);
      await loadRazorpayScript();

      const planKey = `${tier.id}_${billing}`;
      const order = await razorpayService.createOrder(planKey);

      if (!order.keyId) {
        toast.error('Razorpay is not configured. Please contact support.');
        return;
      }

      const rzp = new window.Razorpay!({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Astralis',
        description: `${tier.nameKey === 'pro' ? 'Pro' : 'Premium'} — ${billing === 'yearly' ? 'Yearly' : 'Monthly'}`,
        prefill: {
          name: user?.name ?? '',
          email: user?.email ?? '',
        },
        handler: async (response) => {
          try {
            const result = await razorpayService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan: planKey,
            });
            if (result.verified) {
              toast.success(`Payment successful! You are now on ${result.plan === 'pro' ? 'Pro' : 'Premium'} plan.`);
              invalidateSubscription();
              navigate('/kundali');
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled. You can try again anytime.');
          },
        },
        theme: { color: '#7c3aed' },
      });

      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setProcessing(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> {t.pricing.back}
        </button>
      </div>

      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-7 w-7 text-accent" />
          <h1 className="font-display text-4xl font-semibold text-foreground">
            {t.pricing.title}
          </h1>
        </div>
        <p className="mx-auto max-w-xl text-muted-foreground">
          {t.pricing.subtitle}
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card/50 p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              billing === 'monthly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.pricing.monthly}
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all',
              billing === 'yearly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t.pricing.yearly}
            <Badge className="bg-accent/20 text-accent text-xs">{t.pricing.save20}</Badge>
          </button>
        </div>
      </div>

      {/* Tier cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const isYearly = billing === 'yearly';
          const displayAmount = isYearly ? tier.yearlyPaise : tier.monthlyPaise;
          const yearlyMonthly = isYearly && tier.yearlyPaise > 0 ? tier.yearlyPaise / 12 : null;

          return (
            <GlassCard
              key={tier.id}
              glow={tier.highlight ? 'gold' : 'none'}
              hover
              className={cn(tier.highlight && 'lg:scale-105')}
            >
              <div className="space-y-5 p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border',
                      tier.highlight
                        ? 'border-accent/30 bg-accent/10'
                        : 'border-primary/30 bg-primary/10'
                    )}>
                      <Icon className={cn('h-5 w-5', tier.highlight ? 'text-accent' : 'text-primary')} />
                    </div>
                    {tier.highlight && (
                      <Badge className="bg-accent/20 text-accent text-xs">
                        {t.pricing.mostPopular}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground">
                    {t.pricing[tier.nameKey]}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t.pricing[tier.descKey]}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold text-foreground">
                      {displayAmount === 0 ? '₹0' : formatINR(displayAmount)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {displayAmount === 0
                        ? t.pricing.forever
                        : isYearly
                          ? t.pricing.perYear
                          : t.pricing.perMonth}
                    </span>
                  </div>
                  {isYearly && yearlyMonthly && (
                    <p className="text-xs text-muted-foreground">
                      {formatINR(yearlyMonthly)}{t.pricing.perMonthBilledYearly}
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handleSelect(tier)}
                  disabled={tier.id === currentPlan || tier.id === 'free' || processing === tier.id}
                  variant={tier.highlight ? 'default' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {processing === tier.id ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                  ) : tier.id === currentPlan ? (
                    <><Check className="mr-2 h-4 w-4" /> {t.pricing.currentPlan}</>
                  ) : tier.id === 'free' && isPaid ? (
                    <><Check className="mr-2 h-4 w-4" /> Included</>
                  ) : (
                    <><Zap className="mr-2 h-4 w-4" /> {tier.nameKey === 'pro' ? t.pricing.upgradePro : t.pricing.goPremium}</>
                  )}
                </Button>

                <div className="space-y-2.5">
                  {PLAN_FEATURES[tier.id].map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Pro feature preview */}
      <GlassCard>
        <div className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            <h2 className="font-display text-xl font-medium">{t.pricing.whatYouGet}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-lg border border-border/50 bg-muted/10 p-4">
              <p className="font-medium text-foreground">{t.pricing.personalizedKundali}</p>
              <p className="text-sm text-muted-foreground">
                {t.kundali.subtitle}
              </p>
            </div>
            <div className="space-y-2 rounded-lg border border-border/50 bg-muted/10 p-4">
              <p className="font-medium text-foreground">{t.pricing.unlimitedAI}</p>
              <p className="text-sm text-muted-foreground">
                {t.chat.askAnything}
              </p>
            </div>
            <div className="space-y-2 rounded-lg border border-border/50 bg-muted/10 p-4">
              <p className="font-medium text-foreground">{t.pricing.yearlyTransits}</p>
              <p className="text-sm text-muted-foreground">
                {t.kundali.transitsDesc}
              </p>
            </div>
            <div className="space-y-2 rounded-lg border border-border/50 bg-muted/10 p-4">
              <p className="font-medium text-foreground">{t.pricing.dashaPeriods}</p>
              <p className="text-sm text-muted-foreground">
                {t.kundali.dashaDesc}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Payment info */}
      <p className="text-center text-xs text-muted-foreground">
        Payments secured by Razorpay · UPI, Cards, Net Banking, Wallets accepted
      </p>
    </div>
  );
}
