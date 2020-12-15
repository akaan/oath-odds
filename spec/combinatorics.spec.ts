// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { cartesianProduct } from "../src/combinatorics";

describe("combinatorics", () => {
  describe("cartesianProduct", () => {
    it("should compute cartesian product of 2 arrays", () => {
      const arr1 = [1, 2];
      const arr2 = [3, 4];
      const expected = [
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
      ];
      expect(cartesianProduct(arr1, arr2)).to.deep.equals(expected);
    });
  });
});
