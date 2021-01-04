import { cartesianProduct, Fraction, roll, WithOdds } from "./math";
import {
  AttackDie,
  AttackResult,
  CampaignResult,
  DefenseDie,
  DefenseResult,
  toAttackResult,
  toDefenseResult,
} from "./oath";
import { replace } from "./utils";

/**
 * Lists all possible results of an attack roll.
 *
 * @param {number} diceNumber
 *   Number of attack (red) dice to roll.
 * @returns {WithOdds<AttackResult>[]}
 *   All possible results of rolling this number of attack dice.
 */
function rollAttack(diceNumber: number): WithOdds<AttackResult>[] {
  return roll(
    AttackDie,
    diceNumber,
    toAttackResult,
    (a, b) => a.attack === b.attack && a.kill === b.kill
  );
}

/**
 * Lists all possible results of defense roll.
 *
 * @param {number} diceNumber
 *   Number of defense (blue) dice to roll.
 * @returns {WithOdds<DefenseResult>[]}
 *   All possible results of rolling this number of defense dice.
 */
function rollDefense(diceNumber: number): WithOdds<DefenseResult>[] {
  return roll(
    DefenseDie,
    diceNumber,
    toDefenseResult,
    (a, b) => a.defense === b.defense
  );
}

/**
 * Lists all possible results of a campaign in Oath along with their odds.
 *
 * @param {number} attackDice
 *   Number of attack (red) dice to roll.
 * @param {number} defenseDice
 *   Number of defense (blue) dice to roll.
 * @returns {CampaignResultWithOdds[]}
 *   All possible results for this campaign along with their odds.
 */
export function rollCampaign(
  attackDice: number,
  defenseDice: number
): WithOdds<CampaignResult>[] {
  const attackRoll = rollAttack(attackDice);
  const defenseRoll = rollDefense(defenseDice);

  const product = cartesianProduct<any>(attackRoll, defenseRoll);

  return product.map((pair) =>
    merge(pair as [WithOdds<AttackResult>, WithOdds<DefenseResult>])
  );
}

function merge(
  attackDefensePair: [WithOdds<AttackResult>, WithOdds<DefenseResult>]
): WithOdds<CampaignResult> {
  const [attack, defense] = attackDefensePair;
  return {
    oddsOfValue: attack.oddsOfValue.multiply(defense.oddsOfValue),
    value: { ...attack.value, ...defense.value },
  };
}

/**
 * Type to hold information about a campaign success.
 */
export interface CampaignSuccess {
  /** Remaining warbands in attacking force after warbands have been killed
   * from the dice roll and sacrificed.
   */
  remainingWarbands: number;
  /** Odds of this particular campaign success. */
  odds: Fraction;
}

/**
 * Computes the remaining warbands in attacking force by applying the kills
 * from the dice roll and sacrificing the number of warbands needed to succeed.
 * If the result is negative, it means by this campaign can't be a success (not
 * enough warbands to sacrifice).
 *
 * @param {CampaignResult} result
 *   The campaign result.
 * @param {number} attackingForceWarbands
 *   The number of warbands in attacking force.
 * @param {number} defendingForceWarbands
 *   The number of warbands in defending force.
 * @returns {number | null}
 *   The remaining warbands or null if the campaign is a loss.
 */
function remainingWarbandsAfterSacrifice(
  result: CampaignResult,
  attackingForceWarbands: number,
  defendingForceWarbands: number
): number | null {
  const warbandsAfterKill = attackingForceWarbands - result.kill;

  const attackVsDefense =
    result.attack - result.defense - defendingForceWarbands;

  if (attackVsDefense > 0) {
    return warbandsAfterKill;
  } else {
    const warbandsToSacrifice = 1 - attackVsDefense;
    if (warbandsToSacrifice > warbandsAfterKill) {
      return null;
    } else {
      return warbandsAfterKill - warbandsToSacrifice;
    }
  }
}

export function computeCampaignSuccess(
  attackDice: number,
  attackingForceWarbands: number,
  defenseDice: number,
  defendingForceWarbands: number
): CampaignSuccess[] {
  const possibleResults = rollCampaign(attackDice, defenseDice);

  const successes = possibleResults.filter(
    (result) =>
      remainingWarbandsAfterSacrifice(
        result.value,
        attackingForceWarbands,
        defendingForceWarbands
      ) !== null
  );

  const groupedByRemainingWarbands: CampaignSuccess[] = successes.reduce(
    (acc: CampaignSuccess[], result: WithOdds<CampaignResult>) => {
      const remainingWarbands = remainingWarbandsAfterSacrifice(
        result.value,
        attackingForceWarbands,
        defendingForceWarbands
      );

      if (acc.length === 0) {
        return [
          {
            odds: result.oddsOfValue,
            remainingWarbands,
          },
        ];
      } else {
        // Find an equivalent set
        const matchingIndex = acc.findIndex(
          (item) => item.remainingWarbands === remainingWarbands
        );
        if (matchingIndex > -1) {
          // Update the existing set by adding the odds
          const updated = {
            odds: acc[matchingIndex].odds.add(result.oddsOfValue),
            remainingWarbands: acc[matchingIndex].remainingWarbands,
          };

          return replace(acc, matchingIndex, updated);
        } else {
          // Add the set
          return [
            ...acc,
            {
              odds: result.oddsOfValue,
              remainingWarbands,
            },
          ];
        }
      }
    },
    []
  );

  return groupedByRemainingWarbands.sort((a, b) =>
    a.remainingWarbands < b.remainingWarbands
      ? -1
      : a.remainingWarbands > b.remainingWarbands
      ? 1
      : 0
  );
}

export { Fraction } from "./math";
