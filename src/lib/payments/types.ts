export interface CheckoutSessionOptions {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  expiresAt: number | null;
  planId: string | null;
}

export abstract class PaymentProvider {
  abstract createCheckoutSession(options: CheckoutSessionOptions): Promise<string>;
  abstract verifyWebhook(body: any, signature: string): Promise<any>;
}
