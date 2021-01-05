// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { arrayEquals, flatten, replace } from "../../src/utils/arrays";

describe("utils", () => {
  describe("flatten", () => {
    it("flattens an array", () => {
      expect(flatten([[], [1], [2]])).to.deep.equal([1, 2]);
    });
  });

  describe("arrayEquals", () => {
    it("returns false if comparing to something else than an array", () => {
      expect(arrayEquals("thing" as any, [1, 2])).to.be.false;
      expect(arrayEquals([1, 2], "thing" as any)).to.be.false;
    });

    it("returns false if the arrays are not of the same length", () => {
      expect(arrayEquals([1, 2, 3], [1, 2, 3, 4])).to.be.false;
    });

    it("returns true if the arrays contain the same values in the same order", () => {
      expect(arrayEquals([1, 2, 3], [1, 2, 3])).to.be.true;
    });

    it("returns false if the arrays do not contain the same values", () => {
      expect(arrayEquals([1, 2, 3], [1, 2, 4])).to.be.false;
    });

    it("returns false if the arrays contain the same values but in a different order", () => {
      expect(arrayEquals([1, 2, 3], [3, 1, 2])).to.be.false;
    });

    it("can compare different primitives", () => {
      expect(arrayEquals(["a", "b"], ["a", "b"])).to.be.true;
      expect(arrayEquals([1.0, 2.5], [1.0, 2.5])).to.be.true;
      expect(arrayEquals([true, false], [true, false])).to.be.true;
      expect(arrayEquals([1, null, undefined], [1, null, undefined])).to.be
        .true;
    });
  });

  describe("replace", () => {
    it("should replace at specified index", () => {
      const arr = ["a", "b", "c"];
      const replaced = replace(arr, 1, "x");
      expect(replaced).to.deep.equal(["a", "x", "c"]);
    });

    it("should be able to replace at first position", () => {
      const arr = ["a", "b", "c"];
      const replaced = replace(arr, 0, "x");
      expect(replaced).to.deep.equal(["x", "b", "c"]);
    });

    it("should be able to replace at last position", () => {
      const arr = ["a", "b", "c"];
      const replaced = replace(arr, 2, "x");
      expect(replaced).to.deep.equal(["a", "b", "x"]);
    });

    it("should return the same array if specified index is < 0", () => {
      const arr = ["a", "b", "c"];
      const replaced = replace(arr, -1, "x");
      expect(replaced).to.deep.equal(["a", "b", "c"]);
    });

    it("should return the same array if specified index is > array length", () => {
      const arr = ["a", "b", "c"];
      const replaced = replace(arr, 3, "x");
      expect(replaced).to.deep.equal(["a", "b", "c"]);
    });

    it("should leave the original array untouched", () => {
      const arr = ["a", "b", "c"];
      replace(arr, 1, "x");
      expect(arr).to.deep.equal(["a", "b", "c"]);
    });
  });
});
