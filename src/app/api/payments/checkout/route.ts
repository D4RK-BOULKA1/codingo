import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { saaspay } from "@/lib/payments/saaspay";

async function verifySession(request: NextRequest): Promise<string | null> {
  const sessionCookie = request.cookies.get("__session")?.value;
  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decoded.uid;
    } catch {
      // Fallback Bearer ci-dessous
    }
  }

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const decoded = await adminAuth.verifyIdToken(authHeader.slice(7));
      return decoded.uid;
    } catch {
      return null;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  const uid = await verifySession(request);
  if (!uid) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const userSnap = await adminDb.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const userData = userSnap.data()!;
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const checkoutUrl = await saaspay.createCheckoutSession({
      userId: uid,
      userEmail: userData.email,
      priceId: "price_codingo_premium_monthly",
      successUrl: `${origin}/parametres?success=true`,
      cancelUrl: `${origin}/tarifs?canceled=true`,
    });

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("[API Checkout]", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}
