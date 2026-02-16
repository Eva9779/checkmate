
'use server'

import Stripe from 'stripe';

/**
 * STRIPE SECRET KEY
 * This is now pulled from environment variables to satisfy GitHub security rules.
 * Ensure this is set in your Vercel Environment Variables.
 */
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia' as any,
});

interface PaymentIntentResult {
  success: boolean;
  clientSecret?: string;
  intentId?: string;
  amount?: number;
  error?: string;
  declineCode?: string;
}

export async function createPaymentIntent(amount: number): Promise<PaymentIntentResult> {
  if (!STRIPE_SECRET_KEY) {
    return { success: false, error: "Payment system misconfigured. Missing API Key." };
  }

  if (!amount || amount <= 0) {
    return { success: false, error: "Invalid amount." };
  }

  try {
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
      error: e.message || "Stripe API Error",
      declineCode: e.decline_code
    };
  }
}

export async function checkPaymentStatus(intentId: string): Promise<string> {
  try {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return intent.status;
  } catch (e) {
    return 'error';
  }
}

export async function getPaymentDetails(intentId: string): Promise<PaymentIntentResult> {
  try {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return {
      success: true,
      clientSecret: intent.client_secret as string,
      amount: (intent.amount || 0) / 100
    };
  } catch (e: any) {
    return { 
      success: false, 
      error: e.message,
      declineCode: e.decline_code
    };
  }
}
