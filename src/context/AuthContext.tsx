"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase/client";
import { UserProfile, LeagueId, StartingLevel } from "@/types/user";
import {
  createServerSession,
  clearServerSession,
} from "@/lib/auth/session-client";
import {
  isUsernameTaken,
  isValidUsername,
  normalizeUsername,
} from "@/lib/auth/username";

const ADMIN_USERNAME = "boulka-admin";
const ADMIN_EMAIL = "boulka-admin@codingo.local";

export type OnboardingPayload = {
  selectedLanguages: string[];
  dailyGoalMinutes: number;
  startingLevel: StartingLevel;
  notificationsEnabled: boolean;
  timezone?: string;
};

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (payload: OnboardingPayload) => Promise<void>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Paris";
  } catch {
    return "Europe/Paris";
  }
}

function createDefaultProfile(
  uid: string,
  email: string,
  username: string,
  displayName: string,
  avatarUrl: string | null = null
): UserProfile {
  const isAdmin = email === ADMIN_EMAIL;
  return {
    uid,
    email,
    username: normalizeUsername(username),
    displayName,
    firstName: "",
    lastName: "",
    avatarUrl,
    bio: "",
    role: isAdmin ? "admin" : "user",
    isPremium: isAdmin,
    premiumExpiresAt: null,
    gems: isAdmin ? 9999 : 50,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    onboardingCompleted: isAdmin,
    selectedLanguages: isAdmin ? ["html", "css"] : [],
    startingLevel: "beginner",
    totalXp: 0,
    leagueId: (isAdmin ? "diamant" : "bronze") as LeagueId,
    leagueXp: 0,
    streakDays: 0,
    lastStreakDate: null,
    streakFrozen: false,
    timezone: detectTimezone(),
    hearts: 5,
    lastHeartLostAt: null,
    nextHeartRecoveryAt: null,
    mustChangePassword: isAdmin,
    settings: {
      soundEffects: true,
      notificationsEnabled: false,
      dailyGoalMinutes: 10,
      interfaceLanguage: "fr",
    },
  };
}

async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as UserProfile;
    return {
      ...createDefaultProfile(uid, data.email, data.username, data.displayName),
      ...data,
      onboardingCompleted: data.onboardingCompleted ?? false,
      selectedLanguages: data.selectedLanguages ?? [],
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      startingLevel: data.startingLevel ?? "beginner",
    };
  } catch (err) {
    console.error("[AuthContext] Erreur lecture Firestore:", err);
    return null;
  }
}

async function claimUsername(username: string, uid: string): Promise<void> {
  const normalized = normalizeUsername(username);
  await setDoc(doc(db, "usernames", normalized), {
    uid,
    username: normalized,
    createdAt: Date.now(),
  });
}

async function releaseUsername(username: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "usernames", normalizeUsername(username)));
  } catch {
    // Ignorer si le doc n'existe pas
  }
}

async function persistProfile(profile: UserProfile): Promise<void> {
  const ref = doc(db, "users", profile.uid);
  await setDoc(ref, { ...profile, lastActiveAt: Date.now() }, { merge: true });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        let profile = await fetchUserProfile(fbUser.uid);
        if (!profile) {
          const username =
            fbUser.displayName?.toLowerCase().replace(/\s+/g, "_") ||
            `user_${fbUser.uid.slice(0, 6)}`;
          profile = createDefaultProfile(
            fbUser.uid,
            fbUser.email || "",
            username,
            fbUser.displayName || "Utilisateur",
            fbUser.photoURL
          );
          await persistProfile(profile);
          try {
            await claimUsername(profile.username, profile.uid);
          } catch {
            // Pseudo déjà pris : suffixe uid
            profile.username = `${profile.username}_${fbUser.uid.slice(0, 4)}`;
            await persistProfile(profile);
            await claimUsername(profile.username, profile.uid);
          }
        }
        setUser(profile);
        try {
          await createServerSession();
        } catch (err) {
          console.error("[AuthContext] Session serveur:", err);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (emailOrUsername: string, password: string) => {
    const trimmed = emailOrUsername.trim();
    let email = trimmed;

    // Pseudo → email (admin inclus) via route serveur
    if (!trimmed.includes("@")) {
      const res = await fetch("/api/auth/resolve-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });
      if (!res.ok) {
        throw Object.assign(new Error("Identifiant inconnu"), {
          code: "auth/user-not-found",
        });
      }
      const data = (await res.json()) as { email?: string };
      if (!data.email) {
        throw Object.assign(new Error("Identifiant inconnu"), {
          code: "auth/user-not-found",
        });
      }
      email = data.email;
    }

    await signInWithEmailAndPassword(auth, email, password);
    await createServerSession();
  }, []);

  const signup = useCallback(
    async (email: string, username: string, password: string) => {
      const normalized = normalizeUsername(username);
      if (!isValidUsername(normalized)) {
        throw Object.assign(new Error("Pseudo invalide"), {
          code: "auth/invalid-username",
        });
      }
      if (await isUsernameTaken(normalized)) {
        throw Object.assign(new Error("Pseudo déjà pris"), {
          code: "auth/username-taken",
        });
      }

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: normalized });

      const profile = createDefaultProfile(
        cred.user.uid,
        email.trim(),
        normalized,
        normalized
      );
      await persistProfile(profile);
      await claimUsername(normalized, cred.user.uid);
      setUser(profile);

      try {
        await sendEmailVerification(cred.user);
      } catch {
        // Non bloquant
      }

      await createServerSession();
    },
    []
  );

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    let existing = await fetchUserProfile(fbUser.uid);
    if (!existing) {
      let username =
        fbUser.displayName?.toLowerCase().replace(/\s+/g, "_") ||
        `user_${fbUser.uid.slice(0, 6)}`;
      username = normalizeUsername(username);
      if (!isValidUsername(username) || (await isUsernameTaken(username))) {
        username = `user_${fbUser.uid.slice(0, 8)}`;
      }

      existing = createDefaultProfile(
        fbUser.uid,
        fbUser.email || "",
        username,
        fbUser.displayName || "Utilisateur",
        fbUser.photoURL
      );
      await persistProfile(existing);
      await claimUsername(username, fbUser.uid);
      setUser(existing);
    }

    await createServerSession();
  }, []);

  const logout = useCallback(async () => {
    await clearServerSession();
    await signOut(auth);
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  }, []);

  const updateProfileData = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!user) return;

      const next = { ...user, ...data, lastActiveAt: Date.now() };

      if (data.username && data.username !== user.username) {
        const normalized = normalizeUsername(data.username);
        if (!isValidUsername(normalized)) {
          throw Object.assign(new Error("Pseudo invalide"), {
            code: "auth/invalid-username",
          });
        }
        if (await isUsernameTaken(normalized, user.uid)) {
          throw Object.assign(new Error("Pseudo déjà pris"), {
            code: "auth/username-taken",
          });
        }

        const batch = writeBatch(db);
        batch.delete(doc(db, "usernames", user.username));
        batch.set(doc(db, "usernames", normalized), {
          uid: user.uid,
          username: normalized,
          createdAt: Date.now(),
        });
        batch.update(doc(db, "users", user.uid), {
          username: normalized,
          displayName: data.displayName ?? user.displayName,
          lastActiveAt: Date.now(),
        });
        await batch.commit();
        next.username = normalized;
      }

      // Champs modifiables côté client uniquement
      const allowed: Partial<UserProfile> = {};
      const keys: (keyof UserProfile)[] = [
        "displayName",
        "firstName",
        "lastName",
        "bio",
        "avatarUrl",
        "timezone",
        "settings",
        "selectedLanguages",
        "startingLevel",
        "onboardingCompleted",
        "mustChangePassword",
        "totalXp",
        "leagueXp",
        "gems",
        "streakDays",
        "hearts",
      ];
      for (const key of keys) {
        if (key in data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (allowed as any)[key] = data[key];
        }
      }
      if (data.username) allowed.username = next.username;

      setUser(next);
      try {
        if (Object.keys(allowed).length > 0) {
          await updateDoc(doc(db, "users", user.uid), {
            ...allowed,
            lastActiveAt: Date.now(),
          });
        }
      } catch (err) {
        console.error("[AuthContext] Erreur mise à jour profil:", err);
        setUser(user);
        throw err;
      }
    },
    [user]
  );

  const completeOnboarding = useCallback(
    async (payload: OnboardingPayload) => {
      if (!user) return;
      await updateProfileData({
        onboardingCompleted: true,
        selectedLanguages: payload.selectedLanguages,
        startingLevel: payload.startingLevel,
        timezone: payload.timezone || detectTimezone(),
        settings: {
          ...user.settings,
          dailyGoalMinutes: payload.dailyGoalMinutes,
          notificationsEnabled: payload.notificationsEnabled,
        },
      });
    },
    [user, updateProfileData]
  );

  const checkUsernameAvailable = useCallback(
    async (username: string) => {
      const normalized = normalizeUsername(username);
      if (!isValidUsername(normalized)) return false;
      return !(await isUsernameTaken(normalized, user?.uid));
    },
    [user?.uid]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfileData,
        completeOnboarding,
        checkUsernameAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé au sein d'un AuthProvider");
  }
  return context;
};
