import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body.event || body.type;
    const data = body.data || body;

    console.log(`[Webhook SaaSpay] Événement reçu: ${event}`, JSON.stringify(body));

    // Trouver l'ID utilisateur via userId, metadata.userId ou email
    let targetUid: string | null = data?.metadata?.userId || data?.userId || null;
    const userEmail: string | null = data?.customer_email || data?.email || data?.metadata?.email || null;

    if (!targetUid && userEmail) {
      const userQuery = await adminDb
        .collection("users")
        .where("email", "==", userEmail)
        .limit(1)
        .get();
      if (!userQuery.empty) {
        targetUid = userQuery.docs[0].id;
      }
    }

    const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours
    const expiresAt = data?.expiresAt || (Date.now() + ONE_MONTH_MS);

    // Événements d'activation Premium
    const isActivationEvent =
      event === "subscription.active" ||
      event === "subscription.created" ||
      event === "checkout.session.completed" ||
      event === "payment.success" ||
      event === "charge.success";

    // Événements de résiliation ou expiration
    const isCancellationEvent =
      event === "subscription.canceled" ||
      event === "subscription.expired" ||
      event === "payment.failed";

    if (isActivationEvent && targetUid) {
      const userRef = adminDb.collection("users").doc(targetUid);
      await userRef.set(
        {
          isPremium: true,
          premiumExpiresAt: expiresAt,
          hearts: 5,
          lastActiveAt: Date.now(),
        },
        { merge: true }
      );

      // Enregistrer l'historique de paiement
      await adminDb.collection("payments").add({
        userId: targetUid,
        userEmail: userEmail || "inconnu",
        amount: data?.amount || 2500,
        currency: data?.currency || "EUR",
        event,
        status: "success",
        expiresAt,
        receivedAt: Date.now(),
      });

      console.log(`[Webhook SaaSpay] Premium 30 jours activé avec succès pour ${targetUid} (${userEmail})`);
      return NextResponse.json({
        success: true,
        message: `Premium activé pour 30 jours`,
        userId: targetUid,
        expiresAt,
      });
    }

    if (isCancellationEvent && targetUid) {
      const userRef = adminDb.collection("users").doc(targetUid);
      await userRef.update({
        isPremium: false,
        premiumExpiresAt: null,
      });

      await adminDb.collection("payments").add({
        userId: targetUid,
        userEmail: userEmail || "inconnu",
        event,
        status: "canceled",
        receivedAt: Date.now(),
      });

      console.log(`[Webhook SaaSpay] Premium désactivé pour ${targetUid}`);
      return NextResponse.json({
        success: true,
        message: `Premium résilié pour ${targetUid}`,
      });
    }

    return NextResponse.json({
      received: true,
      event,
      targetUid: targetUid || "non_identifié",
    });
  } catch (err: unknown) {
    console.error("[Webhook SaaSpay Error]", err);
    return NextResponse.json(
      { error: "Webhook processing failed", details: (err as Error).message },
      { status: 400 }
    );
  }
}

// GET /api/webhooks/saaspay — Endpoint de santé / diagnostic pour le webhook
export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/saaspay",
    provider: "SaaSpay",
    supportedEvents: [
      "subscription.active",
      "subscription.created",
      "checkout.session.completed",
      "payment.success",
      "subscription.canceled",
    ],
    timestamp: Date.now(),
  });
}
