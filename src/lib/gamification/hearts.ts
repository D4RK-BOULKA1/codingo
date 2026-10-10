// Logique de gestion des cœurs (100% basée sur les timestamps serveur)

export const MAX_HEARTS = 5;
export const HEART_RECOVERY_HOURS = 5;
export const HEART_RECOVERY_DURATION_MS = HEART_RECOVERY_HOURS * 60 * 60 * 1000; // 18 000 000 ms

export interface HeartCalculationResult {
  hearts: number;
  isRecovered: boolean;
  timeLeftMs: number;
  timeLeftFormatted: string | null;
  lastHeartLostAt: number | null;
  nextHeartRecoveryAt: number | null;
}

/**
 * Calcule l'état actuel des cœurs en tenant compte du temps écoulé côté serveur
 */
export function calculateCurrentHearts(params: {
  hearts: number;
  lastHeartLostAt: number | null;
  nextHeartRecoveryAt: number | null;
  isPremium?: boolean;
  now?: number;
}): HeartCalculationResult {
  const { isPremium = false, now = Date.now() } = params;

  // Utilisateur Premium : cœurs illimités
  if (isPremium) {
    return {
      hearts: MAX_HEARTS,
      isRecovered: false,
      timeLeftMs: 0,
      timeLeftFormatted: null,
      lastHeartLostAt: null,
      nextHeartRecoveryAt: null,
    };
  }

  const currentHearts = Math.max(0, Math.min(MAX_HEARTS, params.hearts));

  // Si l'utilisateur est déjà au maximum de cœurs
  if (currentHearts >= MAX_HEARTS) {
    return {
      hearts: MAX_HEARTS,
      isRecovered: false,
      timeLeftMs: 0,
      timeLeftFormatted: null,
      lastHeartLostAt: null,
      nextHeartRecoveryAt: null,
    };
  }

  // Si un cœur manque, on vérifie l'échéance des 5 heures
  const nextRecovery =
    params.nextHeartRecoveryAt ||
    (params.lastHeartLostAt ? params.lastHeartLostAt + HEART_RECOVERY_DURATION_MS : now + HEART_RECOVERY_DURATION_MS);

  // Le délai de 5h est écoulé -> Réinitialisation complète à 5 cœurs !
  if (now >= nextRecovery) {
    return {
      hearts: MAX_HEARTS,
      isRecovered: true,
      timeLeftMs: 0,
      timeLeftFormatted: null,
      lastHeartLostAt: null,
      nextHeartRecoveryAt: null,
    };
  }

  // Le compte à rebours est toujours actif
  const timeLeftMs = nextRecovery - now;
  const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

  const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;

  return {
    hearts: currentHearts,
    isRecovered: false,
    timeLeftMs,
    timeLeftFormatted: formatted,
    lastHeartLostAt: params.lastHeartLostAt || now,
    nextHeartRecoveryAt: nextRecovery,
  };
}

/**
 * Déduit un cœur lors d'une mauvaise réponse.
 * Le minuteur de 5 heures démarre dès la perte du premier cœur.
 */
export function deductHeartOnFailure(params: {
  hearts: number;
  lastHeartLostAt: number | null;
  nextHeartRecoveryAt: number | null;
  isPremium?: boolean;
  now?: number;
}): {
  newHearts: number;
  lastHeartLostAt: number | null;
  nextHeartRecoveryAt: number | null;
} {
  const { isPremium = false, now = Date.now() } = params;

  if (isPremium) {
    return {
      newHearts: MAX_HEARTS,
      lastHeartLostAt: null,
      nextHeartRecoveryAt: null,
    };
  }

  // D'abord recalculer si les cœurs s'étaient déjà rechargés
  const state = calculateCurrentHearts({ ...params, now });
  const startHearts = state.hearts;

  const newHearts = Math.max(0, startHearts - 1);

  // Si c'est le premier cœur perdu (on passe de 5 à 4), le minuteur démarre maintenant
  if (startHearts === MAX_HEARTS) {
    const nextRecovery = now + HEART_RECOVERY_DURATION_MS;
    return {
      newHearts,
      lastHeartLostAt: now,
      nextHeartRecoveryAt: nextRecovery,
    };
  }

  // Si un cœur avait déjà été perdu, on conserve le minuteur initial en cours
  return {
    newHearts,
    lastHeartLostAt: state.lastHeartLostAt,
    nextHeartRecoveryAt: state.nextHeartRecoveryAt,
  };
}
