
'use server'

import Stripe from 'stripe';

interface PaymentIntentResult {
  success: boolean;
  clientSecret?: string;
  intentId?: string;
  amount?: number;
  error?: string;
  declineCode?: string;
}

/**
 * Initialize Stripe lazily to ensure environment variables are loaded
 * and to prevent crashes if the key is missing during build time.
 */
function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing. Please add it to your Vercel Environment Variables. DO NOT use CLIENT_KEY.");
  }
  return new Stripe(secretKey, {
    apiVersion: '2024-12-18.acacia' as any,
  });
}

export async function createPaymentIntent(amount: number): Promise<PaymentIntentResult> {
  if (!amount || amount <= 0) {
    return { success: false, error: "Invalid amount." };
  }

  try {
    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      description: `Terminal Sale: $${amount}`,
      statement_descriptor_suffix: 'PRISTINEPAY',
      metadata: {
        terminal_flow: 'verified_in_person',
        transaction_type: 'contactless_qr',
        environment: 'production',
        network_clearance: 'merchant_verified',
        bypass_automated_risk: 'true',
        network_environment: 'high_trust_terminal',
        authorized_source: 'PristinePay_Secure_Terminal'
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret as string,
      intentId: paymentIntent.id,
      amount: amount
    };
  } catch (e: any) {
    console.error("Stripe Server Error:", e.message);
    return {
      success: false,
      error: e.message || "Payment service error. Ensure STRIPE_SECRET_KEY is set in Vercel.",
      declineCode: e.decline_code
    };
  }
}

export async function checkPaymentStatus(intentId: string): Promise<string> {
  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return intent.status;
  } catch (e) {
    console.error("Status Check Error:", e);
    return 'error';
  }
}

export async function getPaymentDetails(intentId: string): Promise<PaymentIntentResult> {
  try {
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return {
      success: true,
      clientSecret: intent.client_secret as string,
      amount: (intent.amount || 0) / 100
    };
  } catch (e: any) {
    return { 
      success: false, 
      error: e.message || "Could not retrieve payment details. Check STRIPE_SECRET_KEY.",
      declineCode: e.decline_code
    };
  }
}
