export type UserRole = "user" | "admin";

export type LeagueId =
  | "bronze"
  | "argent"
  | "or"
  | "saphir"
  | "rubis"
  | "emeraude"
  | "amethyste"
  | "perle"
  | "obsidienne"
  | "diamant";

export interface UserSettings {
  soundEffects: boolean;
  notificationsEnabled: boolean;
  dailyGoalMinutes: number; // 5, 10, 15, 20
  interfaceLanguage: "fr" | "en";
}

export type StartingLevel = "beginner" | "placement";

export interface UserProfile {
  uid: string;
  email: string;
  username: string; // Ex: 'alexdev', 'boulka-admin'
  displayName: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio?: string;
  role: UserRole;
  isPremium: boolean;
  premiumExpiresAt: number | null;
  gems: number; // Monnaie virtuelle gagnée en cours de jeu
  createdAt: number;
  lastActiveAt: number;

  // Onboarding
  onboardingCompleted: boolean;
  selectedLanguages: string[]; // Ex: ['html', 'css']
  startingLevel: StartingLevel;

  // Gamification Globale
  totalXp: number;
  leagueId: LeagueId;
  leagueXp: number; // XP accumulée dans la ligue courante (seuil 500)

  // Système de Série Quotidienne (Streak)
  streakDays: number;
  lastStreakDate: string | null; // Format YYYY-MM-DD
  streakFrozen: boolean;
  timezone: string; // Ex: 'Europe/Paris'

  // Système de Cœurs Serveur (Calculé par timestamps)
  hearts: number; // 0 à 5 (ou illimité si isPremium)
  lastHeartLostAt: number | null; // Timestamp en ms du premier cœur perdu
  nextHeartRecoveryAt: number | null; // Timestamp en ms où les 5 cœurs sont restaurés

  // Admin : forcer un changement de mot de passe à la 1re connexion
  mustChangePassword?: boolean;

  settings: UserSettings;
}

export interface LanguageProgress {
  languageId: string; // 'html' | 'css' | 'javascript' ...
  currentUnitId: string;
  currentChapterId: string;
  currentLessonId: string;
  completedLessons: string[];
  completedProjects: string[];
  languageXp: number;
  accuracyRate: number; // Pourcentage de précision
  weakPoints: string[]; // Notions à réviser dans l'entraînement
  startedAt: number;
  updatedAt: number;
}
