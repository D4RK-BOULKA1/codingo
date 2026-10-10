import { PaymentProvider, CheckoutSessionOptions } from "./types";

const API_URL = "https://api.saspay.me/api/v1";

// Prix de l'abonnement Premium, en francs CFA (environ 25 euros). Modifie ce chiffre si besoin.
const PREMIUM_AMOUNT = "16400.00";
const PREMIUM_CURRENCY = "XOF";

/**
 * Implémentation SasPay pour Codingo (checkout hébergé).
 * Doc : https://docs.saspay.me/api-reference/payments/checkout-create
 */
export class SaaspayProvider extends PaymentProvider {
  private apiKey: string;
  private webhookSecret: string;

  constructor() {
    super();
    this.apiKey = process.env.SAASPAY_API_KEY || "";
    this.webhookSecret = process.env.SAASPAY_WEBHOOK_SECRET || "";
  }

  async createCheckoutSession(options: CheckoutSessionOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error("SAASPAY_API_KEY manquante");
    }

    const email = options.userEmail || "client@codingo.local";

    const response = await fetch(`${API_URL}/checkout-sessions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: PREMIUM_AMOUNT,
        currency: PREMIUM_CURRENCY,
        description: "Abonnement Codingo Premium",
        customer_email: email,
        customer_name: email.split("@")[0],
        return_url: options.successUrl,
        metadata: {
          userId: options.userId,
          priceId: options.priceId,
        },
      }),
    });

    const text = await response.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = null;
    }

    if (!response.ok) {
      throw new Error(`SasPay ${response.status}: ${text.slice(0, 500)}`);
    }

    const data = json?.data ?? json;
    const url = data?.checkout_url;
    if (!url) {
      throw new Error(`SasPay n'a pas renvoyé checkout_url: ${text.slice(0, 500)}`);
    }

    return url;
  }

  async verifyWebhook(body: any, signature: string): Promise<any> {
    // À sécuriser plus tard (signature HMAC SasPay).
    return body;
  }
}

export const saaspay = new SaaspayProvider();