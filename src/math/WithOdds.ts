import { Fraction } from "./Fraction";

/**
 * A value and the odds attached to it.
 */
export interface WithOdds<T> {
  /** The value. */
  value: T;
  /** The odds of obtaining this value. */
  oddsOfValue: Fraction;
}
