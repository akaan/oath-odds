// tslint:disable:no-unused-expression
import { Assertion, expect } from "chai";
import { Fraction } from "../src/math/Fraction";
import { WithOdds } from "../src/math/WithOdds";
import { arrayEquals } from "../src/utils";

Assertion.addMethod("sameFractionAs", function (expectedFraction: Fraction) {
  const actualFraction = this._obj as Fraction;
  this.assert(
    actualFraction.sameAs(expectedFraction),
    `expected ${expectedFraction.toString()} but got ${actualFraction.toString()}`,
    `not expected ${expectedFraction.toString()} but got ${actualFraction.toString()}`,
    expectedFraction,
    actualFraction,
    false
  );
});

declare global {
  export namespace Chai {
    interface Assertion {
      sameFractionAs(expectedFraction: Fraction): void;
    }
  }
}

export function arraysOfOutcomesAreSame<Outcome>(
  a: Outcome[],
  b: Outcome[]
): boolean {
  return arrayEquals(a.sort(), b.sort());
}

export function compareToExpected<Outcome>(
  expectFn: typeof expect,
  expected: WithOdds<Outcome>[],
  actual: WithOdds<Outcome>[],
  valuesAreSameFn: (a: Outcome, b: Outcome) => boolean
): void {
  expectFn(actual.length, "Sets have different lengths").to.equal(
    expected.length
  );

  if (actual.length === expected.length) {
    for (const actualResult of actual) {
      const expectedResults = expected.filter((result) =>
        valuesAreSameFn(result.value, actualResult.value)
      );

      expectFn(
        expectedResults.length,
        "There should be exactly 1 set with the same outcomes"
      ).to.equal(1);

      if (expectedResults.length === 1) {
        expectFn(
          actualResult.oddsOfValue.sameAs(expectedResults[0].oddsOfValue),
          `Result with set ${
            actualResult.value
          } does not have the same odds: expected = ${expectedResults[0].oddsOfValue.toString()}, actual = ${actualResult.oddsOfValue.toString()}`
        ).to.be.true;
      }
    }
  }
}
