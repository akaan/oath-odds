import { Fraction, odds as computeOdds } from "./math";
import {
  AttackDie,
  CampaignResult,
  campaignResultCompareFn,
  DefenseDie,
  toCampaignResult,
} from "./oath";
import { replace } from "./utils";

/**
 * A campaign result along with the odds of obtaining this particular result.
 */
export interface CampaignResultWithOdds {
  /** The campaign result. */
  result: CampaignResult;
  /** The odds of obtaining this particular result. */
  odds: Fraction;
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
): CampaignResultWithOdds[] {
  const raw: CampaignResultWithOdds[] = computeOdds([
    ...Array(attackDice).fill(AttackDie),
    ...Array(defenseDice).fill(DefenseDie),
  ]).map(({ set, odds }) => ({
    odds,
    result: toCampaignResult(set),
  }));

  const sameResultsCombined = raw.reduce(
    (acc: CampaignResultWithOdds[], current: CampaignResultWithOdds) => {
      if (acc.length === 0) {
        return [current];
      } else {
        // Find an equivalent result
        const matchingResultIndex = acc.findIndex(
          ({ result }) => campaignResultCompareFn(result, current.result) === 0
        );
        if (matchingResultIndex > -1) {
          // Update the existing result by adding the odds
          const updatedResult = {
            odds: acc[matchingResultIndex].odds.add(current.odds),
            result: acc[matchingResultIndex].result,
          };

          return replace(acc, matchingResultIndex, updatedResult);
        } else {
          // Add the set
          return [...acc, current];
        }
      }
    },
    []
  );

  return sameResultsCombined;
}

export { Fraction } from "./math";
