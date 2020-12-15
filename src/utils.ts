/**
 * Flattens an array of arrays.
 *
 * @param T
 *   The type of the elements contained in the arrays.
 * @param {T[][]} elems
 *   An array of arrays.
 * @returns {T[]}
 *   A flattened array.
 */
export function flatten<T>(elems: T[][]): T[] {
  return [].concat.apply([], elems);
}

/**
 * Compare 2 arrays using `===`. No deep comparaison.
 *
 * @param T
 *   The type of the elements contained in the arrays.
 * @param {T[]} a
 *   First array.
 * @param {T[]} b
 *   Second array.
 * @return {boolean}
 *   True if `a` and `b` contains the same values in the same order.
 */
export function arrayEquals<T>(a: T[], b: T[]): boolean {
  if (!(Array.isArray(a) && Array.isArray(b))) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Returns a new array with element at index `idx` replaced with `elem`.
 *
 * @param T
 *   The type of the elements contained in the array.
 * @param {T[]} elems
 *   The original array.
 * @param {number} idx
 *   The index at which to replace.
 * @param {T} elem
 *   The element to place at the specified index.
 * @return {T[]}
 *   A new array with the element replaced.
 */
export function replace<T>(elems: T[], idx: number, elem: T): T[] {
  if (idx >= 0 && idx < elems.length) {
    return [...elems.slice(0, idx), elem, ...elems.slice(idx + 1)];
  } else {
    return [...elems];
  }
}
