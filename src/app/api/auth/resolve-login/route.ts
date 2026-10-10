import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

/**
 * Résout un pseudo en email Firebase Auth (côté serveur).
 * Utilisé uniquement pour la connexion email/mot de passe.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const raw = typeof body?.username === "string" ? body.username.trim() : "";
    if (!raw) {
      return NextResponse.json({ error: "Pseudo manquant" }, { status: 400 });
    }

    const username = raw.toLowerCase();

    // Mapping spécial admin
    if (username === "boulka-admin") {
      return NextResponse.json({ email: "boulka-admin@codingo.local" });
    }

    const usernameSnap = await adminDb.collection("usernames").doc(username).get();
    if (!usernameSnap.exists) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    const uid = usernameSnap.data()?.uid as string | undefined;
    if (!uid) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    const userSnap = await adminDb.collection("users").doc(uid).get();
    const email = userSnap.data()?.email as string | undefined;
    if (!email) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    return NextResponse.json({ email });
  } catch (err) {
    console.error("[API /auth/resolve-login]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
