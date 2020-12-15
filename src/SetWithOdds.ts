import { Fraction } from "./Fraction";

/**
 * This type encapsulate a set and the odds of obtaining this set from a random
 * device.
 *
 * @param Outcome The type of element in the set.
 */
export interface SetWithOdds<Outcome> {
  /** The set. */
  set: Outcome[];
  /** The odds of obtaining this set from a random device. */
  odds: Fraction;
}

/**
 * Combine two sets with odds into a single one. Sets are merged and odds are
 * multiplied.
 *
 * @param O
 *   Type for the first set.
 * @param P
 *   Type for the second set.
 * @param {SetWithOdds<O>} first
 *   The first set to be combined.
 * @param {SetWithOdds<P>} second
 *   The second set to be combined.
 * @returns {SetWithOdds<O | P>}
 *   The result of combining the two sets.
 */
export function combineSetWithOdds<O, P>(
  first: SetWithOdds<O>,
  second: SetWithOdds<P>
): SetWithOdds<O | P> {
  return {
    odds: first.odds.multiply(second.odds),
    set: [...first.set, ...second.set],
  };
}
