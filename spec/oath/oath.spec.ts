// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import {
  AttackDieFace,
  campaignResultCompareFn,
  DefenseDieFace,
  OathDieFace,
  toCampaignResult,
} from "../../src/oath";

describe("Oath domain model", () => {
  describe("Attack and Defense dice faces", () => {
    it("should have consistent order", () => {
      const someFaces: OathDieFace[] = [
        DefenseDieFace.DOUBLE,
        DefenseDieFace.TWO_SHIELDS,
        AttackDieFace.HOLLOW_SWORD,
        DefenseDieFace.SHIELD,
        AttackDieFace.TWO_SWORDS_AND_SKULL,
        AttackDieFace.SWORD,
        DefenseDieFace.TWO_SHIELDS,
        AttackDieFace.SWORD,
        DefenseDieFace.BLANK,
        DefenseDieFace.SHIELD,
      ];

      const expected: OathDieFace[] = [
        AttackDieFace.HOLLOW_SWORD,
        AttackDieFace.SWORD,
        AttackDieFace.SWORD,
        AttackDieFace.TWO_SWORDS_AND_SKULL,
        DefenseDieFace.BLANK,
        DefenseDieFace.SHIELD,
        DefenseDieFace.SHIELD,
        DefenseDieFace.TWO_SHIELDS,
        DefenseDieFace.TWO_SHIELDS,
        DefenseDieFace.DOUBLE,
      ];

      expect(someFaces.sort()).to.deep.equal(expected);
    });
  });

  describe("CampaignResult", () => {
    describe("campaignResultCompareFn", () => {
      it("returns 0 if result are equal", () => {
        expect(
          campaignResultCompareFn(
            { attack: 3, defense: 2, kill: 0 },
            { attack: 3, defense: 2, kill: 0 }
          )
        ).to.equal(0);
      });

      it("can be used to sort results by attack descending, then defense ascending then kill ascending", () => {
        const someResults = [
          { attack: 5, defense: 2, kill: 0 },
          { attack: 5, defense: 2, kill: 0 },
          { attack: 3, defense: 0, kill: 2 },
          { attack: 4, defense: 4, kill: 0 },
          { attack: 5, defense: 3, kill: 3 },
          { attack: 5, defense: 1, kill: 0 },
          { attack: 5, defense: 1, kill: 2 },
        ];
        const expected = [
          { attack: 5, defense: 1, kill: 0 },
          { attack: 5, defense: 1, kill: 2 },
          { attack: 5, defense: 2, kill: 0 },
          { attack: 5, defense: 2, kill: 0 },
          { attack: 5, defense: 3, kill: 3 },
          { attack: 4, defense: 4, kill: 0 },
          { attack: 3, defense: 0, kill: 2 },
        ];
        expect(someResults.sort(campaignResultCompareFn)).to.deep.equal(
          expected
        );
      });
    });
  });

  describe("toCampaignResult", () => {
    it("can sum up a bunch of die faces into a campaign result", () => {
      const rolled: OathDieFace[] = [
        DefenseDieFace.DOUBLE,
        DefenseDieFace.TWO_SHIELDS,
        AttackDieFace.HOLLOW_SWORD,
        DefenseDieFace.SHIELD,
        AttackDieFace.TWO_SWORDS_AND_SKULL,
        AttackDieFace.SWORD,
        DefenseDieFace.TWO_SHIELDS,
        AttackDieFace.SWORD,
        AttackDieFace.HOLLOW_SWORD,
        DefenseDieFace.BLANK,
        DefenseDieFace.SHIELD,
        AttackDieFace.HOLLOW_SWORD,
      ];

      const result = toCampaignResult(rolled);

      expect(result).to.deep.equal({ attack: 5, defense: 12, kill: 1 });
      expect(result.attack).to.equal(5);
      expect(result.defense).to.equal(12);
      expect(result.kill).to.equal(1);
    });
  });
});
