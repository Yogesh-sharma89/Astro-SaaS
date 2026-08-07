// Edge function: razorpay-payment
// Creates Razorpay orders and verifies payments.
// Reads RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from the app_secrets table.

import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PLAN_AMOUNTS: Record<string, number> = {
  pro_monthly: 79900,
  pro_yearly: 767000,
  premium_monthly: 149900,
  premium_yearly: 1439000,
};

interface RazorpayCredentials {
  keyId: string;
  keySecret: string;
}

async function getRazorpayCredentials(supabase: ReturnType<typeof createClient>): Promise<RazorpayCredentials | null> {
  // Try edge function env vars first, then fall back to app_secrets table
  const envKeyId = Deno.env.get("RAZORPAY_KEY_ID");
  const envKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (envKeyId && envKeySecret) {
    return { keyId: envKeyId, keySecret: envKeySecret };
  }

  // Read from app_secrets table using service role
  const { data, error } = await supabase
    .from("app_secrets")
    .select("key, value")
    .in("key", ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET"]);

  if (error || !data || data.length < 2) return null;

  const keyId = data.find((r: { key: string; value: string }) => r.key === "RAZORPAY_KEY_ID")?.value;
  const keySecret = data.find((r: { key: string; value: string }) => r.key === "RAZORPAY_KEY_SECRET")?.value;

  if (!keyId || !keySecret) return null;
  return { keyId, keySecret };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action } = body;

    // Get credentials
    const credentials = await getRazorpayCredentials(supabase);
    if (!credentials) {
      return new Response(JSON.stringify({
        error: "Razorpay credentials not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the app_secrets table or edge function secrets.",
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- CREATE ORDER ---
    if (action === "create_order") {
      const { plan } = body;
      const amount = PLAN_AMOUNTS[plan];
      if (!amount) {
        return new Response(JSON.stringify({ error: "Invalid plan" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(credentials.keyId + ":" + credentials.keySecret),
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `sub_${userData.user.id.slice(0, 8)}_${Date.now()}`,
          notes: { user_id: userData.user.id, plan },
        }),
      });

      if (!orderRes.ok) {
        const errText = await orderRes.text();
        return new Response(JSON.stringify({ error: `Razorpay order creation failed: ${errText}` }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const order = await orderRes.json();

      // Store pending subscription
      await supabase.from("subscriptions").upsert({
        user_id: userData.user.id,
        plan: plan.startsWith("pro") ? "pro" : "premium",
        status: "pending",
        razorpay_order_id: order.id,
      });

      return new Response(JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: credentials.keyId,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- VERIFY PAYMENT ---
    if (action === "verify_payment") {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, plan } = body;

      // Validate required fields
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return new Response(JSON.stringify({ error: "Missing payment fields" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Generate HMAC-SHA256 signature
      const crypto = (globalThis as any).crypto;
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(credentials.keySecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(razorpayOrderId + "|" + razorpayPaymentId)
      );
      const expectedSignature = Array.from(new Uint8Array(signature))
        .map((b: number) => b.toString(16).padStart(2, "0"))
        .join("");

      // Compare signatures — do NOT mark as paid if mismatch
      if (expectedSignature !== razorpaySignature) {
        return new Response(JSON.stringify({ error: "Payment verification failed — signature mismatch" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update subscription to active
      const planName = plan.startsWith("pro") ? "pro" : "premium";
      const isYearly = plan.endsWith("yearly");
      const periodEnd = new Date();
      periodEnd.setFullYear(periodEnd.getFullYear() + (isYearly ? 1 : 0));
      periodEnd.setMonth(periodEnd.getMonth() + (isYearly ? 0 : 1));

      await supabase.from("subscriptions").upsert({
        user_id: userData.user.id,
        plan: planName,
        status: "active",
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        current_period_end: periodEnd.toISOString(),
      });

      return new Response(JSON.stringify({ verified: true, plan: planName }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
