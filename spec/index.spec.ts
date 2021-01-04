// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { computeCampaignSuccess, Fraction, rollCampaign } from "../src";
import { WithOdds } from "../src/math/WithOdds";
import {
  CampaignResult,
  campaignResultCompareFn,
} from "../src/oath/CampaignResult";
import { compareToExpected } from "./support";

describe("OathOdds", () => {
  describe("rollCampaign", () => {
    it("returns all possible result of the campaign along with their odds", () => {
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
      compareToExpected<CampaignResult>(
        expect,
        expected,
        results,
        (a, b) => campaignResultCompareFn(a, b) === 0
      );
    });
  });

  describe("computeCampaignSuccess", () => {
    it("returns remaining warbands along with odds", () => {
      const results = computeCampaignSuccess(3, 3, 2, 2);
      expect(results).to.have.length(4);

      const withZero = results.filter((i) => i.remainingWarbands === 0);
      expect(withZero).to.have.length(1);
      expect(withZero[0].odds).to.be.sameFractionAs(new Fraction(2297, 7776));

      const withOne = results.filter((i) => i.remainingWarbands === 1);
      expect(withOne).to.have.length(1);
      expect(withOne[0].odds).to.be.sameFractionAs(new Fraction(113, 432));

      const withTwo = results.filter((i) => i.remainingWarbands === 2);
      expect(withTwo).to.have.length(1);
      expect(withTwo[0].odds).to.be.sameFractionAs(new Fraction(1645, 7776));

      const withThree = results.filter((i) => i.remainingWarbands === 3);
      expect(withThree).to.have.length(1);
      expect(withThree[0].odds).to.be.sameFractionAs(new Fraction(1, 108));
    });

    it("returns results sorted by remaining warbands ascending", () => {
      expect(
        computeCampaignSuccess(3, 3, 2, 2).map((i) => i.remainingWarbands)
      ).to.deep.equal([0, 1, 2, 3]);
    });
  });
});
