import { cartesianProduct, roll, WithOdds } from "./math";
import {
  AttackDie,
  AttackResult,
  CampaignResult,
  DefenseDie,
  DefenseResult,
  toAttackResult,
  toDefenseResult,
} from "./oath";

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

export { Fraction } from "./math";
