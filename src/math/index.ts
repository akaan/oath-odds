import { arrayEquals, replace } from "../utils";
import { cartesianProduct } from "./combinatorics";
import { RandomDevice } from "./RandomDevice";
import { WithOdds } from "./WithOdds";

/**
 * Computes all possible sets from the provided list of random devices along
 * with the odds of obtaining this particular set.
 *
 * @param {Array<RandomDevice<any>>} devices
 *   The list of random devices from which to generate possible sets.
 * @returns {Array<SetWithOdds<any>>}
 *   All possible sets that can be obtainded from this lsit of random devices
 *   along with the odds of obtaining this particular set.
 */
export function odds<T>(devices: RandomDevice<T>[]): WithOdds<T[]>[] {
  const product = cartesianProduct(
    ...devices.map((d) => d.getOutcomesWithOdds())
  );

  const combined = product.map((sets) => sets.reduce(combineSetWithOdds));

  const grouped = combined.reduce(
    (acc: WithOdds<T[]>[], current: WithOdds<T[]>) => {
      if (acc.length === 0) {
        return [current];
      } else {
        // Find an equivalent set
        const matchingSetIndex = acc.findIndex(({ value }) =>
          arrayEquals(value.sort(), current.value.sort())
        );
        if (matchingSetIndex > -1) {
          // Update the existing set by adding the odds
          const updatedSet = {
            oddsOfValue: acc[matchingSetIndex].oddsOfValue.add(
              current.oddsOfValue
            ),
            value: acc[matchingSetIndex].value,
          };

          return replace(acc, matchingSetIndex, updatedSet);
        } else {
          // Add the set
          return [...acc, current];
        }
      }
    },
    []
  );

  return grouped;
}

export function roll<O, R>(
  device: RandomDevice<O>,
  numberOfDevices: number,
  resultTransformationFn: (outcomes: O[]) => R,
  resultEqualFn: (a: R, b: R) => boolean
): WithOdds<R>[] {
  const raw: WithOdds<R>[] = odds<O>([
    ...Array(numberOfDevices).fill(device),
  ]).map(({ value, oddsOfValue }) => ({
    oddsOfValue,
    value: resultTransformationFn(value),
  }));

  const sameResultsCombined = raw.reduce(
    (acc: WithOdds<R>[], current: WithOdds<R>) => {
      if (acc.length === 0) {
        return [current];
      } else {
        // Find an equivalent result
        const matchingResultIndex = acc.findIndex(({ value }) =>
          resultEqualFn(value, current.value)
        );
        if (matchingResultIndex > -1) {
          // Update the existing result by adding the odds
          const updatedResult = {
            oddsOfValue: acc[matchingResultIndex].oddsOfValue.add(
              current.oddsOfValue
            ),
            value: acc[matchingResultIndex].value,
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

/**
 * Combine two sets with odds into a single one. Sets are merged and odds are
 * multiplied.
 *
 * @param O
 *   Type for the first set.
 * @param P
 *   Type for the second set.
 * @param {WithOdds<O[]>} first
 *   The first set to be combined.
 * @param {WithOdds<P[]>} second
 *   The second set to be combined.
 * @returns {WithOdds<(O | P)[]>}
 *   The result of combining the two sets.
 */
export function combineSetWithOdds<O, P>(
  first: WithOdds<O[]>,
  second: WithOdds<P[]>
): WithOdds<(O | P)[]> {
  return {
    oddsOfValue: first.oddsOfValue.multiply(second.oddsOfValue),
    value: [...first.value, ...second.value],
  };
}

export * from "./combinatorics";
export * from "./Fraction";
export * from "./RandomDevice";
export * from "./WithOdds";
