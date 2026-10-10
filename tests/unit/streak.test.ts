import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  updateStreakOnLessonComplete,
  getDaysDifference,
} from "../../src/lib/gamification/streak.js";

describe("Logique de Série (Streak) Codingo", () => {
  it("Calcul de la différence de jours entre dates ISO", () => {
    assert.strictEqual(getDaysDifference("2026-10-08", "2026-10-09"), 1);
    assert.strictEqual(getDaysDifference("2026-10-07", "2026-10-09"), 2);
  });

  it("Terminer une leçon consécutive le lendemain incrémente la série", () => {
    const result = updateStreakOnLessonComplete({
      currentStreakDays: 5,
      lastStreakDate: "2026-10-08",
      streakFrozen: false,
      todayDateStr: "2026-10-09",
    });

    assert.strictEqual(result.streakDays, 6);
    assert.strictEqual(result.isIncremented, true);
    assert.strictEqual(result.lastStreakDate, "2026-10-09");
  });

  it("Terminer une deuxième leçon le même jour ne double pas la série", () => {
    const result = updateStreakOnLessonComplete({
      currentStreakDays: 5,
      lastStreakDate: "2026-10-09",
      streakFrozen: false,
      todayDateStr: "2026-10-09",
    });

    assert.strictEqual(result.streakDays, 5);
    assert.strictEqual(result.isIncremented, false);
  });

  it("Sauter 2 jours sans gel réinitialise la série à 1", () => {
    const result = updateStreakOnLessonComplete({
      currentStreakDays: 14,
      lastStreakDate: "2026-10-06",
      streakFrozen: false,
      todayDateStr: "2026-10-09",
    });

    assert.strictEqual(result.streakDays, 1);
    assert.strictEqual(result.isMaintained, false);
  });

  it("Sauter un jour avec un gel de série protège et incrémente la série", () => {
    const result = updateStreakOnLessonComplete({
      currentStreakDays: 14,
      lastStreakDate: "2026-10-07",
      streakFrozen: true,
      todayDateStr: "2026-10-09",
    });

    assert.strictEqual(result.streakDays, 15);
    assert.strictEqual(result.streakSavedByFreeze, true);
    assert.strictEqual(result.streakFrozen, false); // Le gel a été consommé
  });
});
