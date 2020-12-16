// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { CampaignResultWithOdds, Fraction, rollCampaign } from "../src";
import {
  CampaignResult,
  campaignResultCompareFn,
} from "../src/oath/CampaignResult";

function printCampaignResult(result: CampaignResult): string {
  return `{ attack: ${result.attack}, defense: ${result.defense}, kill: ${result.kill} }`;
}

function compareToExpected(
  expectFn: typeof expect,
  expected: CampaignResultWithOdds[],
  actual: CampaignResultWithOdds[]
): void {
  expectFn(actual.length, "Sets have different lengths").to.equal(
    expected.length
  );

  if (actual.length === expected.length) {
    for (const actualResult of actual) {
      const expectedResults = expected.filter(
        (result) =>
          campaignResultCompareFn(result.result, actualResult.result) === 0
      );

      expectFn(
        expectedResults.length,
        "There should be exactly 1 set with the same campaign result"
      ).to.equal(1);

      if (expectedResults.length === 1) {
        expectFn(
          actualResult.odds.sameAs(expectedResults[0].odds),
          `Result with campaign result ${printCampaignResult(
            actualResult.result
          )} does not have the same odds: expected = ${expectedResults[0].odds.toString()}, actual = ${actualResult.odds.toString()}`
        ).to.be.true;
      }
    }
  }
}

describe("OathOdds", () => {
  describe("rollCampaign", () => {
    it("", () => {
      const expected = [
        {
          odds: new Fraction(1, 12),
          result: { attack: 2, defense: 0, kill: 1 },
        },
        {
          odds: new Fraction(1, 18),
          result: { attack: 2, defense: 1, kill: 1 },
        },
        {
          odds: new Fraction(1, 36),
          result: { attack: 2, defense: 2, kill: 1 },
        },
        {
          odds: new Fraction(1, 6),
          result: { attack: 1, defense: 0, kill: 0 },
        },
        {
          odds: new Fraction(1, 9),
          result: { attack: 1, defense: 1, kill: 0 },
        },
        {
          odds: new Fraction(1, 18),
          result: { attack: 1, defense: 2, kill: 0 },
        },
        {
          odds: new Fraction(1, 4),
          result: { attack: 0, defense: 0, kill: 0 },
        },
        {
          odds: new Fraction(1, 6),
          result: { attack: 0, defense: 1, kill: 0 },
        },
        {
          odds: new Fraction(1, 12),
          result: { attack: 0, defense: 2, kill: 0 },
        },
      ];
      const results: CampaignResultWithOdds[] = rollCampaign(1, 1);
      compareToExpected(expect, expected, results);
    });
  });
});
