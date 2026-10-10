import type { LeagueId } from "../../types/user.ts";

export interface LeagueDefinition {
  id: LeagueId;
  name: string;
  order: number;
  xpThreshold: number; // XP requise dans cette ligue pour être promu
  badgeColor: string;
}

export const LEAGUES_ORDER: LeagueId[] = [
  "bronze",
  "argent",
  "or",
  "saphir",
  "rubis",
  "emeraude",
  "amethyste",
  "perle",
  "obsidienne",
  "diamant",
];

export const LEAGUES_DATA: Record<LeagueId, LeagueDefinition> = {
  bronze: { id: "bronze", name: "Bronze", order: 1, xpThreshold: 500, badgeColor: "#CD7F32" },
  argent: { id: "argent", name: "Argent", order: 2, xpThreshold: 500, badgeColor: "#94A3B8" },
  or: { id: "or", name: "Or", order: 3, xpThreshold: 500, badgeColor: "#FFC83D" },
  saphir: { id: "saphir", name: "Saphir", order: 4, xpThreshold: 500, badgeColor: "#4CC2FF" },
  rubis: { id: "rubis", name: "Rubis", order: 5, xpThreshold: 500, badgeColor: "#FF5353" },
  emeraude: { id: "emeraude", name: "Émeraude", order: 6, xpThreshold: 500, badgeColor: "#2CD98F" },
  amethyste: { id: "amethyste", name: "Améthyste", order: 7, xpThreshold: 500, badgeColor: "#A855F7" },
  perle: { id: "perle", name: "Perle", order: 8, xpThreshold: 500, badgeColor: "#E2E8F0" },
  obsidienne: { id: "obsidienne", name: "Obsidienne", order: 9, xpThreshold: 500, badgeColor: "#0B3A5B" },
  diamant: { id: "diamant", name: "Diamant", order: 10, xpThreshold: 500, badgeColor: "#38BDF8" },
};

/**
 * Calcule l'évolution de la ligue après un gain d'XP
 */
export function addXpAndCheckLeaguePromotion(params: {
  currentLeagueId: LeagueId;
  currentLeagueXp: number;
  xpGained: number;
}): {
  newLeagueId: LeagueId;
  newLeagueXp: number;
  isPromoted: boolean;
  promotedFrom?: LeagueId;
} {
  const { currentLeagueId, currentLeagueXp, xpGained } = params;
  const currentDef = LEAGUES_DATA[currentLeagueId] || LEAGUES_DATA.bronze;
  const totalLeagueXp = currentLeagueXp + xpGained;

  // Si on est déjà en Diamant (ligue suprême)
  if (currentLeagueId === "diamant") {
    return {
      newLeagueId: "diamant",
      newLeagueXp: totalLeagueXp,
      isPromoted: false,
    };
  }

  // Vérifier si le seuil est franchi (ex: 500 XP)
  if (totalLeagueXp >= currentDef.xpThreshold) {
    const currentIndex = LEAGUES_ORDER.indexOf(currentLeagueId);
    const nextLeagueId = LEAGUES_ORDER[currentIndex + 1] || "diamant";
    const remainingXp = totalLeagueXp - currentDef.xpThreshold;

    return {
      newLeagueId: nextLeagueId,
      newLeagueXp: remainingXp,
      isPromoted: true,
      promotedFrom: currentLeagueId,
    };
  }

  return {
    newLeagueId: currentLeagueId,
    newLeagueXp: totalLeagueXp,
    isPromoted: false,
  };
}
