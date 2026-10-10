import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { deductHeartOnFailure, calculateCurrentHearts } from "@/lib/gamification/hearts";

// Middleware d'authentification interne
async function verifySession(request: NextRequest): Promise<string | null> {
  const sessionCookie = request.cookies.get("__session")?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

// POST /api/hearts/deduct — Déduit un cœur après une mauvaise réponse
export async function POST(request: NextRequest) {
  const uid = await verifySession(request);
  if (!uid) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const userRef = adminDb.collection("users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const data = snap.data()!;
    const now = Date.now();

    const result = deductHeartOnFailure({
      hearts: data.hearts ?? 5,
      lastHeartLostAt: data.lastHeartLostAt ?? null,
      nextHeartRecoveryAt: data.nextHeartRecoveryAt ?? null,
      isPremium: data.isPremium ?? false,
      now,
    });

    // Mettre à jour Firestore atomiquement
    await userRef.update({
      hearts: result.newHearts,
      lastHeartLostAt: result.lastHeartLostAt,
      nextHeartRecoveryAt: result.nextHeartRecoveryAt,
    });

    return NextResponse.json({
      hearts: result.newHearts,
      lastHeartLostAt: result.lastHeartLostAt,
      nextHeartRecoveryAt: result.nextHeartRecoveryAt,
    });
  } catch (err) {
    console.error("[API /hearts/deduct]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET /api/hearts/deduct — Récupère l'état actuel des cœurs avec recalcul serveur
export async function GET(request: NextRequest) {
  const uid = await verifySession(request);
  if (!uid) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const userRef = adminDb.collection("users").doc(uid);
    const snap = await userRef.get();
    if (!snap.exists) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const data = snap.data()!;
    const now = Date.now();

    const state = calculateCurrentHearts({
      hearts: data.hearts ?? 5,
      lastHeartLostAt: data.lastHeartLostAt ?? null,
      nextHeartRecoveryAt: data.nextHeartRecoveryAt ?? null,
      isPremium: data.isPremium ?? false,
      now,
    });

    // Si les cœurs se sont rechargés, mettre à jour Firestore
    if (state.isRecovered) {
      await userRef.update({
        hearts: 5,
        lastHeartLostAt: null,
        nextHeartRecoveryAt: null,
      });
    }

    return NextResponse.json(state);
  } catch (err) {
    console.error("[API /hearts]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
