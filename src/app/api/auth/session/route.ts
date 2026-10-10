import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { UserProfile } from "@/types/user";

// POST /api/auth/session — Crée une session cookie après connexion côté client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }

    // Vérifier le token et obtenir les infos utilisateur
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Mettre à jour lastActiveAt dans Firestore (merge si le doc vient d'être créé)
    const userRef = adminDb.collection("users").doc(uid);
    await userRef.set({ lastActiveAt: Date.now() }, { merge: true });

    // Créer un cookie de session (14 jours)
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 jours en ms
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[API /auth/session POST]", err);
    return NextResponse.json({ error: "Authentification échouée" }, { status: 401 });
  }
}

// DELETE /api/auth/session — Détruit la session cookie lors de la déconnexion
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("__session");
  return response;
}
