import { cartesianProduct } from "combinatorics";
import { RandomDevice } from "./RandomDevice";
import { combineSetWithOdds, SetWithOdds } from "./SetWithOdds";
import { arrayEquals, replace } from "./utils";

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
export function odds(devices: RandomDevice<any>[]): SetWithOdds<any>[] {
  const product = cartesianProduct(
    ...devices.map((d) => d.getOutcomesWithOdds())
  );

  const combined = product.map((sets) => sets.reduce(combineSetWithOdds));

  const grouped = combined.reduce(
    (acc: SetWithOdds<any>[], current: SetWithOdds<any>) => {
      if (acc.length === 0) {
        return [current];
      } else {
        // Find an equivalent set
        const matchingSetIndex = acc.findIndex(({ set }) =>
          arrayEquals(set.sort(), current.set.sort())
        );
        if (matchingSetIndex > -1) {
          // Update the existing set by adding the odds
          const updatedSet = {
            odds: acc[matchingSetIndex].odds.add(current.odds),
            set: acc[matchingSetIndex].set,
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
