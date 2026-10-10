import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  addXpAndCheckLeaguePromotion,
} from "../../src/lib/gamification/leagues.ts";

describe("Logique des Ligues Codingo", () => {
  it("Gagner de l'XP en dessous de 500 maintient dans la ligue actuelle", () => {
    const result = addXpAndCheckLeaguePromotion({
      currentLeagueId: "bronze",
      currentLeagueXp: 300,
      xpGained: 50,
    });

    assert.strictEqual(result.newLeagueId, "bronze");
    assert.strictEqual(result.newLeagueXp, 350);
    assert.strictEqual(result.isPromoted, false);
  });

  it("Atteindre ou dépasser 500 XP promeut dans la ligue suivante (Bronze -> Argent)", () => {
    const result = addXpAndCheckLeaguePromotion({
      currentLeagueId: "bronze",
      currentLeagueXp: 490,
      xpGained: 25,
    });

    assert.strictEqual(result.newLeagueId, "argent");
    assert.strictEqual(result.newLeagueXp, 15); // 515 - 500 = 15
    assert.strictEqual(result.isPromoted, true);
    assert.strictEqual(result.promotedFrom, "bronze");
  });

  it("La ligue Diamant est le palier maximal et continue d'accumuler l'XP", () => {
    const result = addXpAndCheckLeaguePromotion({
      currentLeagueId: "diamant",
      currentLeagueXp: 1200,
      xpGained: 25,
    });

    assert.strictEqual(result.newLeagueId, "diamant");
    assert.strictEqual(result.newLeagueXp, 1225);
    assert.strictEqual(result.isPromoted, false);
  });
});
