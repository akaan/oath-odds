import { Fraction } from "./math";
import { SetWithOdds } from "./SetWithOdds";

/**
 * A device generating random outcomes with specific odds. For example, a
 * classic 6-sided can be created with the following code:
 *
 * ```javascript
 * const d6 = new RandomDevice<number>([
 *   [1, new Fraction(1, 6)],
 *   [2, new Fraction(1, 6)],
 *   [3, new Fraction(1, 6)],
 *   [4, new Fraction(1, 6)],
 *   [5, new Fraction(1, 6)],
 *   [6, new Fraction(1, 6)]
 * ]);
 * ```
 *
 * @param Outcome
 *   The type of the outcome generated from this random device.
 */
export class RandomDevice<Outcome> {
  /** The sets and associated odds this random device generates. */
  private _outcomesWithOdds: SetWithOdds<Outcome>[] = [];

  /**
   * Constructor for a random device.
   *
   * @param {ReadonlyArray<[Outcome, Fraction]>} outcomesWithOdds
   *   An array of (outcome, odds) pairs.
   */
  constructor(outcomesWithOdds: ReadonlyArray<[Outcome, Fraction]>) {
    for (const elem of outcomesWithOdds) {
      this._outcomesWithOdds.push({
        odds: elem[1],
        set: [elem[0]],
      });
    }
  }

  /**
   * Get the possible outcomes and odds for this random device.
   *
   * @returns {SetWithOdds<Outcome>[]}
   *   The possible outcomes (as sets) this random device can generate along
   * with the odds of each outcome.
   */
  public getOutcomesWithOdds(): SetWithOdds<Outcome>[] {
    return this._outcomesWithOdds;
  }
}
