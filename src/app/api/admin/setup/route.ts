import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const ADMIN_EMAIL = "boulka-admin@codingo.local";
const ADMIN_USERNAME = "boulka-admin";

// POST /api/admin/setup — Initialise ou met à jour le compte administrateur
export async function POST(request: NextRequest) {
  try {
    const adminPassword =
      process.env.ADMIN_INITIAL_PASSWORD || "Mon_Motdepasse_2026";

    // 1. Vérifier si le compte Auth existe
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(ADMIN_EMAIL);
    } catch {
      userRecord = await adminAuth.createUser({
        email: ADMIN_EMAIL,
        password: adminPassword,
        displayName: "Boulka Admin",
        emailVerified: true,
      });
    }

    // 2. Mettre à jour le mot de passe et les custom claims
    await adminAuth.updateUser(userRecord.uid, {
      password: adminPassword,
      displayName: "Boulka Admin",
    });

    await adminAuth.setCustomUserClaims(userRecord.uid, { role: "admin" });

    // 3. Mettre à jour le profil Firestore
    const userRef = adminDb.collection("users").doc(userRecord.uid);
    await userRef.set(
      {
        uid: userRecord.uid,
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        displayName: "Boulka Admin",
        firstName: "Boulka",
        lastName: "Admin",
        avatarUrl: null,
        bio: "Administrateur officiel de Codingo",
        role: "admin",
        isPremium: true,
        premiumExpiresAt: null,
        gems: 9999,
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
        onboardingCompleted: true,
        selectedLanguages: ["html", "css", "javascript"],
        startingLevel: "beginner",
        totalXp: 1500,
        leagueId: "diamant",
        leagueXp: 500,
        streakDays: 42,
        lastStreakDate: new Date().toISOString().split("T")[0],
        streakFrozen: false,
        timezone: "Europe/Paris",
        hearts: 5,
        lastHeartLostAt: null,
        nextHeartRecoveryAt: null,
        mustChangePassword: false,
        settings: {
          soundEffects: true,
          notificationsEnabled: true,
          dailyGoalMinutes: 15,
          interfaceLanguage: "fr",
        },
      },
      { merge: true }
    );

    // 4. Indexer le pseudo
    await adminDb.collection("usernames").doc(ADMIN_USERNAME).set({
      uid: userRecord.uid,
      username: ADMIN_USERNAME,
      createdAt: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Compte administrateur initialisé avec succès",
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      uid: userRecord.uid,
    });
  } catch (err: unknown) {
    console.error("[API /admin/setup]", err);
    return NextResponse.json(
      { error: "Échec de l'initialisation", details: (err as Error).message },
      { status: 500 }
    );
  }
}

// GET /api/admin/setup — Vérifie l'état de l'administrateur
export async function GET() {
  try {
    const userRecord = await adminAuth.getUserByEmail(ADMIN_EMAIL);
    return NextResponse.json({
      initialized: true,
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      uid: userRecord.uid,
    });
  } catch {
    return NextResponse.json({
      initialized: false,
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
    });
  }
}
