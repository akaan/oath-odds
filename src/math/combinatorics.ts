import { flatten } from "../utils";

/**
 * Computes the cartesian product of arrays of elements.
 *
 * ```javascript
 * cartesianProduct([1, 2], [3, 4]) // [[1, 3], [1, 4], [2, 3], [2, 4]]
 * ```
 *
 * @param T`
 *   Type of the elements in the arrays.
 * @param {T[][]} sets
 *   The sets to use for the cartesian product.
 * @returns {T[][]}
 *   The cartesian product of all provided sets.
 */
export function cartesianProduct<T>(...sets: T[][]): T[][] {
  return sets.reduce(
    (acc: T[][], set: T[]) => {
      return flatten(
        acc.map((x: T[]) => {
          return set.map((y: T) => {
            return [...x, y];
          });
        })
      );
    },
    [[]] as T[][]
  );
}
