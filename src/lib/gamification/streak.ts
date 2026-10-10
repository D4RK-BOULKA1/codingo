export interface StreakCalculationResult {
  streakDays: number;
  lastStreakDate: string;
  isMaintained: boolean;
  isIncremented: boolean;
  streakSavedByFreeze: boolean;
  streakFrozen: boolean;
}

/**
 * Obtient la date sous format YYYY-MM-DD selon le fuseau horaire de l'utilisateur
 */
export function getLocalDateString(date: Date = new Date(), timezone: string = "Europe/Paris"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(date); // Retourne YYYY-MM-DD
  } catch {
    // Repli sur UTC si timezone invalide
    return date.toISOString().split("T")[0];
  }
}

/**
 * Calcule l'écart en jours entre deux dates YYYY-MM-DD
 */
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(`${dateStr1}T00:00:00Z`).getTime();
  const d2 = new Date(`${dateStr2}T00:00:00Z`).getTime();
  const diffMs = Math.abs(d2 - d1);
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Met à jour la série (streak) lorsqu'une leçon est terminée
 */
export function updateStreakOnLessonComplete(params: {
  currentStreakDays: number;
  lastStreakDate: string | null;
  streakFrozen: boolean;
  timezone?: string;
  todayDateStr?: string;
}): StreakCalculationResult {
  const timezone = params.timezone || "Europe/Paris";
  const today = params.todayDateStr || getLocalDateString(new Date(), timezone);

  // Premier jour de série de l'utilisateur
  if (!params.lastStreakDate || params.currentStreakDays === 0) {
    return {
      streakDays: 1,
      lastStreakDate: today,
      isMaintained: true,
      isIncremented: true,
      streakSavedByFreeze: false,
      streakFrozen: params.streakFrozen,
    };
  }

  // Si l'utilisateur a déjà terminé une leçon aujourd'hui
  if (params.lastStreakDate === today) {
    return {
      streakDays: params.currentStreakDays,
      lastStreakDate: today,
      isMaintained: true,
      isIncremented: false,
      streakSavedByFreeze: false,
      streakFrozen: params.streakFrozen,
    };
  }

  const diff = getDaysDifference(params.lastStreakDate, today);

  // Leçon terminée le jour consécutif suivant (hier -> aujourd'hui)
  if (diff === 1) {
    return {
      streakDays: params.currentStreakDays + 1,
      lastStreakDate: today,
      isMaintained: true,
      isIncremented: true,
      streakSavedByFreeze: false,
      streakFrozen: params.streakFrozen,
    };
  }

  // Plus de 24h d'écart (au moins 1 jour sauté)
  if (params.streakFrozen) {
    // La série est sauvée grâce au gel de série !
    return {
      streakDays: params.currentStreakDays + 1,
      lastStreakDate: today,
      isMaintained: true,
      isIncremented: true,
      streakSavedByFreeze: true,
      streakFrozen: false, // Le gel a été consommé
    };
  }

  // Série rompue : repart à 1
  return {
    streakDays: 1,
    lastStreakDate: today,
    isMaintained: false,
    isIncremented: false,
    streakSavedByFreeze: false,
    streakFrozen: false,
  };
}
