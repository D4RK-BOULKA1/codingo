import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateCurrentHearts,
  deductHeartOnFailure,
  MAX_HEARTS,
  HEART_RECOVERY_DURATION_MS,
} from "../../src/lib/gamification/hearts.ts";

describe("Logique des Cœurs Codingo (Calcul serveur par timestamps)", () => {
  const baseTime = 1700000000000;

  it("Un nouvel utilisateur a 5 cœurs et aucun minuteur", () => {
    const result = calculateCurrentHearts({
      hearts: 5,
      lastHeartLostAt: null,
      nextHeartRecoveryAt: null,
      isPremium: false,
      now: baseTime,
    });

    assert.strictEqual(result.hearts, 5);
    assert.strictEqual(result.isRecovered, false);
    assert.strictEqual(result.timeLeftFormatted, null);
  });

  it("Perdre un premier cœur (5 -> 4) déclenche le minuteur de 5 heures", () => {
    const deducted = deductHeartOnFailure({
      hearts: 5,
      lastHeartLostAt: null,
      nextHeartRecoveryAt: null,
      isPremium: false,
      now: baseTime,
    });

    assert.strictEqual(deducted.newHearts, 4);
    assert.strictEqual(deducted.lastHeartLostAt, baseTime);
    assert.strictEqual(deducted.nextHeartRecoveryAt, baseTime + HEART_RECOVERY_DURATION_MS);
  });

  it("Perdre un deuxième cœur après 1 heure conserve le minuteur initial de 5h", () => {
    const initialHeartLost = baseTime;
    const initialNextRecovery = baseTime + HEART_RECOVERY_DURATION_MS;
    const oneHourLater = baseTime + 1 * 60 * 60 * 1000;

    const deducted = deductHeartOnFailure({
      hearts: 4,
      lastHeartLostAt: initialHeartLost,
      nextHeartRecoveryAt: initialNextRecovery,
      isPremium: false,
      now: oneHourLater,
    });

    assert.strictEqual(deducted.newHearts, 3);
    assert.strictEqual(deducted.nextHeartRecoveryAt, initialNextRecovery);

    const state = calculateCurrentHearts({
      hearts: deducted.newHearts,
      lastHeartLostAt: deducted.lastHeartLostAt,
      nextHeartRecoveryAt: deducted.nextHeartRecoveryAt,
      now: oneHourLater,
    });

    assert.strictEqual(state.hearts, 3);
    assert.strictEqual(state.timeLeftFormatted, "04:00:00");
  });

  it("Après 5 heures complètes, les cœurs sont restaurés à 5", () => {
    const fiveHoursAndOneMinuteLater = baseTime + HEART_RECOVERY_DURATION_MS + 60 * 1000;

    const state = calculateCurrentHearts({
      hearts: 2,
      lastHeartLostAt: baseTime,
      nextHeartRecoveryAt: baseTime + HEART_RECOVERY_DURATION_MS,
      isPremium: false,
      now: fiveHoursAndOneMinuteLater,
    });

    assert.strictEqual(state.hearts, MAX_HEARTS);
    assert.strictEqual(state.isRecovered, true);
    assert.strictEqual(state.timeLeftFormatted, null);
  });

  it("Un utilisateur Premium a toujours des cœurs infinis (ne perd jamais de cœur)", () => {
    const deducted = deductHeartOnFailure({
      hearts: 5,
      lastHeartLostAt: null,
      nextHeartRecoveryAt: null,
      isPremium: true,
      now: baseTime,
    });

    assert.strictEqual(deducted.newHearts, 5);
    assert.strictEqual(deducted.nextHeartRecoveryAt, null);
  });
});
