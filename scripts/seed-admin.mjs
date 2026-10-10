#!/usr/bin/env node
/**
 * CODINGO - Script d'initialisation du compte administrateur
 *
 * Usage : node scripts/seed-admin.mjs
 *
 * Ce script crée le compte Firebase Auth "boulka-admin@codingo.local"
 * et le profil Firestore correspondant.
 *
 * Prérequis :
 * - Avoir rempli .env.local avec les variables FIREBASE_ADMIN_*
 * - Avoir ADMIN_INITIAL_PASSWORD dans .env.local
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Charger .env.local manuellement (pas de dotenv nécessaire avec Node 22+)
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
  process.env[key] = value;
}

// Vérifications
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

if (!projectId || projectId.startsWith("REMPLACE")) {
  console.error("❌  NEXT_PUBLIC_FIREBASE_PROJECT_ID n'est pas configuré dans .env.local");
  process.exit(1);
}
if (!clientEmail || clientEmail.startsWith("REMPLACE")) {
  console.error("❌  FIREBASE_ADMIN_CLIENT_EMAIL n'est pas configuré dans .env.local");
  process.exit(1);
}
if (!privateKeyRaw || privateKeyRaw.startsWith("REMPLACE")) {
  console.error("❌  FIREBASE_ADMIN_PRIVATE_KEY n'est pas configuré dans .env.local");
  process.exit(1);
}
if (!adminPassword || adminPassword.startsWith("REMPLACE")) {
  console.error("❌  ADMIN_INITIAL_PASSWORD n'est pas configuré dans .env.local");
  process.exit(1);
}

const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

// Initialiser Firebase Admin
const { initializeApp, cert, getApps } = await import("firebase-admin/app");
const { getAuth } = await import("firebase-admin/auth");
const { getFirestore } = await import("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

const adminAuth = getAuth();
const adminDb = getFirestore();

const ADMIN_EMAIL = "boulka-admin@codingo.local";
const ADMIN_USERNAME = "boulka-admin";

console.log(`\n🚀 Codingo — Initialisation du compte administrateur`);
console.log(`   Projet Firebase : ${projectId}`);
console.log(`   Email admin     : ${ADMIN_EMAIL}\n`);

try {
  // Vérifier si le compte existe déjà
  let userRecord;
  try {
    userRecord = await adminAuth.getUserByEmail(ADMIN_EMAIL);
    console.log("✅  Compte Firebase Auth trouvé :", userRecord.uid);
  } catch {
    // Créer le compte
    userRecord = await adminAuth.createUser({
      email: ADMIN_EMAIL,
      password: adminPassword,
      displayName: "Boulka Admin",
      emailVerified: true,
    });
    console.log("✅  Compte Firebase Auth créé :", userRecord.uid);
  }

  // Custom claims admin
  await adminAuth.setCustomUserClaims(userRecord.uid, { role: "admin" });
  console.log("✅  Custom claims 'admin' appliqués");

  // Créer/mettre à jour le profil Firestore
  const userRef = adminDb.collection("users").doc(userRecord.uid);
  const snap = await userRef.get();

  const adminProfile = {
    uid: userRecord.uid,
    email: ADMIN_EMAIL,
    username: ADMIN_USERNAME,
    displayName: "Boulka Admin",
    firstName: "Boulka",
    lastName: "Admin",
    avatarUrl: null,
    bio: "Administrateur de la plateforme Codingo.",
    role: "admin",
    isPremium: true,
    premiumExpiresAt: null,
    gems: 9999,
    createdAt: snap.exists ? snap.data().createdAt : Date.now(),
    lastActiveAt: Date.now(),
    onboardingCompleted: true,
    selectedLanguages: ["html", "css"],
    startingLevel: "beginner",
    totalXp: 0,
    leagueId: "diamant",
    leagueXp: 0,
    streakDays: 0,
    lastStreakDate: null,
    streakFrozen: false,
    timezone: "Europe/Paris",
    hearts: 5,
    lastHeartLostAt: null,
    nextHeartRecoveryAt: null,
    mustChangePassword: true,
    settings: {
      soundEffects: true,
      notificationsEnabled: true,
      dailyGoalMinutes: 10,
      interfaceLanguage: "fr",
    },
  };

  await userRef.set(adminProfile, { merge: true });
  await adminDb.collection("usernames").doc(ADMIN_USERNAME).set({
    uid: userRecord.uid,
    username: ADMIN_USERNAME,
    createdAt: Date.now(),
  });
  console.log("✅  Profil Firestore créé/mis à jour\n");

  console.log("============================================================");
  console.log("  COMPTE ADMIN PRET");
  console.log("  Pseudo   : boulka-admin");
  console.log(`  Email    : ${ADMIN_EMAIL}`);
  console.log(`  Mot de passe : valeur de ADMIN_INITIAL_PASSWORD dans .env.local`);
  console.log("  URL panel : http://localhost:3000/panel-codingo");
  console.log("============================================================\n");
} catch (err) {
  console.error("❌  Erreur lors de l'initialisation :", err);
  process.exit(1);
}
