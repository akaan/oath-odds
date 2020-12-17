// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { Fraction, rollCampaign } from "../src";
import {
  CampaignResult,
  campaignResultCompareFn,
} from "../src/oath/CampaignResult";
import { WithOdds } from "../src/math/WithOdds";

function printCampaignResult(result: CampaignResult): string {
  return `{ attack: ${result.attack}, defense: ${result.defense}, kill: ${result.kill} }`;
}

function compareToExpected(
  expectFn: typeof expect,
  expected: WithOdds<CampaignResult>[],
  actual: WithOdds<CampaignResult>[]
): void {
  expectFn(actual.length, "Sets have different lengths").to.equal(
    expected.length
  );

  if (actual.length === expected.length) {
    for (const actualResult of actual) {
      const expectedResults = expected.filter(
        (result) =>
          campaignResultCompareFn(result.value, actualResult.value) === 0
      );

      expectFn(
        expectedResults.length,
        "There should be exactly 1 set with the same campaign result"
      ).to.equal(1);

      if (expectedResults.length === 1) {
        expectFn(
          actualResult.oddsOfValue.sameAs(expectedResults[0].oddsOfValue),
          `Result with campaign result ${printCampaignResult(
            actualResult.value
          )} does not have the same odds: expected = ${expectedResults[0].oddsOfValue.toString()}, actual = ${actualResult.oddsOfValue.toString()}`
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
          oddsOfValue: new Fraction(1, 12),
          value: { attack: 2, defense: 0, kill: 1 },
        },
        {
          oddsOfValue: new Fraction(1, 18),
          value: { attack: 2, defense: 1, kill: 1 },
        },
        {
          oddsOfValue: new Fraction(1, 36),
          value: { attack: 2, defense: 2, kill: 1 },
        },
        {
          oddsOfValue: new Fraction(1, 6),
          value: { attack: 1, defense: 0, kill: 0 },
        },
        {
          oddsOfValue: new Fraction(1, 9),
          value: { attack: 1, defense: 1, kill: 0 },
        },
        {
          oddsOfValue: new Fraction(1, 18),
          value: { attack: 1, defense: 2, kill: 0 },
        },
        {
          oddsOfValue: new Fraction(1, 4),
          value: { attack: 0, defense: 0, kill: 0 },
        },
        {
          oddsOfValue: new Fraction(1, 6),
          value: { attack: 0, defense: 1, kill: 0 },
        },
        {
          oddsOfValue: new Fraction(1, 12),
          value: { attack: 0, defense: 2, kill: 0 },
        },
      ];
      const results: WithOdds<CampaignResult>[] = rollCampaign(1, 1);
      compareToExpected(expect, expected, results);
    });
  });
});
