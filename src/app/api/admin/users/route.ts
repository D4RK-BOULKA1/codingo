import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { UserProfile } from "@/types/user";

async function verifyCaller(request: NextRequest): Promise<string | null> {
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

// GET /api/admin/users — Liste les utilisateurs (admin seulement)
export async function GET(request: NextRequest) {
  const uid = await verifyCaller(request);
  if (!uid) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Vérifier le rôle admin dans Firestore
  const adminSnap = await adminDb.collection("users").doc(uid).get();
  if (!adminSnap.exists || adminSnap.data()?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "50");

    const snapshot = await adminDb
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const users = snapshot.docs.map((doc) => {
      const data = doc.data() as UserProfile;
      // Ne pas exposer d'infos sensibles
      return {
        uid: data.uid,
        email: data.email,
        username: data.username,
        displayName: data.displayName,
        role: data.role,
        isPremium: data.isPremium,
        totalXp: data.totalXp,
        leagueId: data.leagueId,
        streakDays: data.streakDays,
        hearts: data.hearts,
        gems: data.gems,
        createdAt: data.createdAt,
        lastActiveAt: data.lastActiveAt,
      };
    });

    return NextResponse.json({ users, total: snapshot.size });
  } catch (err) {
    console.error("[API /admin/users]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/admin/users — Modifier le rôle ou le statut premium d'un utilisateur
export async function PATCH(request: NextRequest) {
  const uid = await verifyCaller(request);
  if (!uid) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const adminSnap = await adminDb.collection("users").doc(uid).get();
  if (!adminSnap.exists || adminSnap.data()?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { targetUid, updates } = body;

    if (!targetUid || !updates) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    // Champs autorisés à modifier par l'admin
    const allowedFields = ["role", "isPremium", "premiumExpiresAt", "gems", "hearts", "totalXp"];
    const filteredUpdates: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    await adminDb.collection("users").doc(targetUid).update(filteredUpdates);

    // Si rôle admin → custom claims Firebase Auth
    if ("role" in filteredUpdates) {
      await adminAuth.setCustomUserClaims(targetUid, {
        role: filteredUpdates.role,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API /admin/users PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
