// services/ — API layer. One file per domain.
// razorpay.ts: Razorpay payment integration for Indian market.

import { supabase } from './supabaseClient';

export interface PlanPricing {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  features: string[];
}

export const PLAN_PRICING: Record<string, PlanPricing> = {
  free: {
    id: 'free',
    name: 'Free',
    monthly: 0,
    yearly: 0,
    features: [],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthly: 79900,
    yearly: 767000,
    features: [],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    monthly: 149900,
    yearly: 1439000,
    features: [],
  },
};

export function formatINR(amountPaise: number): string {
  const rupees = amountPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  plan: string;
}

export const razorpayService = {
  async createOrder(plan: string): Promise<CreateOrderResponse> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.access_token) {
      throw new Error('Please sign in to continue');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const res = await fetch(`${supabaseUrl}/functions/v1/razorpay-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.session.access_token}`,
      },
      body: JSON.stringify({ action: 'create_order', plan }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create order');
    }

    const data = await res.json();
    // Fall back to env var key ID if the edge function didn't return one
    if (!data.keyId) {
      data.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    }
    return data;
  },

  async verifyPayment(params: VerifyPaymentParams): Promise<{ verified: boolean; plan: string }> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.access_token) {
      throw new Error('Please sign in to continue');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const res = await fetch(`${supabaseUrl}/functions/v1/razorpay-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.session.access_token}`,
      },
      body: JSON.stringify({
        action: 'verify_payment',
        ...params,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Payment verification failed');
    }

    return res.json();
  },

  async getSubscription() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.access_token) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },
};

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      order_id: string;
      name: string;
      description: string;
      prefill: { name: string; email: string };
      handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
      modal: { ondismiss: () => void };
      theme: { color: string };
    }) => { open: () => void };
  }
}

export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout. Please check your internet connection.'));
    document.body.appendChild(script);
  });
}
