// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { Fraction, odds, RandomDevice, SetWithOdds } from "../../src/math";
import { arrayEquals } from "../../src/utils";

function compareToExpected<Outcome>(
  expectFn: typeof expect,
  expected: SetWithOdds<Outcome>[],
  actual: SetWithOdds<Outcome>[]
): void {
  expectFn(actual.length, "Sets have different lengths").to.equal(
    expected.length
  );

  if (actual.length === expected.length) {
    for (const actualResult of actual) {
      const expectedResults = expected.filter((result) =>
        arrayEquals(result.set.sort(), actualResult.set.sort())
      );

      expectFn(
        expectedResults.length,
        "There should be exactly 1 set with the same outcomes"
      ).to.equal(1);

      if (expectedResults.length === 1) {
        expectFn(
          actualResult.odds.sameAs(expectedResults[0].odds),
          `Result with set ${actualResult.set} does not have the same odds`
        ).to.be.true;
      }
    }
  }
}

describe("odds", () => {
  it("with only 1 random device", () => {
    const d6 = new RandomDevice<number>([
      [1, new Fraction(1, 6)],
      [2, new Fraction(1, 6)],
      [3, new Fraction(1, 6)],
      [4, new Fraction(1, 6)],
      [5, new Fraction(1, 6)],
      [6, new Fraction(1, 6)],
    ]);

    const expected: SetWithOdds<number>[] = [
      { set: [1], odds: new Fraction(1, 6) },
      { set: [2], odds: new Fraction(1, 6) },
      { set: [3], odds: new Fraction(1, 6) },
      { set: [4], odds: new Fraction(1, 6) },
      { set: [5], odds: new Fraction(1, 6) },
      { set: [6], odds: new Fraction(1, 6) },
    ];

    const results: SetWithOdds<number>[] = odds([d6]);

    compareToExpected(expect, expected, results);
  });

  it("with 2 random devices", () => {
    const d4 = new RandomDevice<number>([
      [1, new Fraction(1, 4)],
      [2, new Fraction(1, 4)],
      [3, new Fraction(1, 4)],
      [4, new Fraction(1, 4)],
    ]);

    const abcDie = new RandomDevice<string>([
      ["a", new Fraction(1, 3)],
      ["b", new Fraction(1, 3)],
      ["c", new Fraction(1, 3)],
    ]);

    const expected: SetWithOdds<any>[] = [
      { set: [1, "a"], odds: new Fraction(1, 12) },
      { set: [1, "b"], odds: new Fraction(1, 12) },
      { set: [1, "c"], odds: new Fraction(1, 12) },
      { set: [2, "a"], odds: new Fraction(1, 12) },
      { set: [2, "b"], odds: new Fraction(1, 12) },
      { set: [2, "c"], odds: new Fraction(1, 12) },
      { set: [3, "a"], odds: new Fraction(1, 12) },
      { set: [3, "b"], odds: new Fraction(1, 12) },
      { set: [3, "c"], odds: new Fraction(1, 12) },
      { set: [4, "a"], odds: new Fraction(1, 12) },
      { set: [4, "b"], odds: new Fraction(1, 12) },
      { set: [4, "c"], odds: new Fraction(1, 12) },
    ];

    const results: SetWithOdds<number>[] = odds([d4, abcDie]);

    compareToExpected(expect, expected, results);
  });

  it("combines identical sets", () => {
    const d2 = new RandomDevice<number>([
      [1, new Fraction(1, 2)],
      [2, new Fraction(1, 2)],
    ]);

    const expected: SetWithOdds<any>[] = [
      { set: [1, 1], odds: new Fraction(1, 4) },
      { set: [1, 2], odds: new Fraction(1, 2) },
      { set: [2, 2], odds: new Fraction(1, 4) },
    ];

    const results: SetWithOdds<number>[] = odds([d2, d2]);

    compareToExpected(expect, expected, results);
  });
});
