// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import {
  AttackDieFace,
  campaignResultCompareFn,
  DefenseDieFace,
  toAttackResult,
  toDefenseResult,
} from "../../src/oath";

describe("Oath domain model", () => {
  describe("Attack dice faces", () => {
    it("should have consistent order", () => {
      const someFaces: AttackDieFace[] = [
        AttackDieFace.HOLLOW_SWORD,
        AttackDieFace.TWO_SWORDS_AND_SKULL,
        AttackDieFace.SWORD,
        AttackDieFace.SWORD,
      ];

      const expected: AttackDieFace[] = [
        AttackDieFace.HOLLOW_SWORD,
        AttackDieFace.SWORD,
        AttackDieFace.SWORD,
        AttackDieFace.TWO_SWORDS_AND_SKULL,
      ];

      expect(someFaces.sort()).to.deep.equal(expected);
    });
  });

  describe("Defense dice faces", () => {
    it("should have consistent order", () => {
      const someFaces: DefenseDieFace[] = [
        DefenseDieFace.DOUBLE,
        DefenseDieFace.TWO_SHIELDS,
        DefenseDieFace.SHIELD,
        DefenseDieFace.TWO_SHIELDS,
        DefenseDieFace.BLANK,
        DefenseDieFace.SHIELD,
      ];

      const expected: DefenseDieFace[] = [
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

  describe("toAttackResult", () => {
    it("can sum up a bunch of die faces into a campaign result", () => {
      const rolled: AttackDieFace[] = [
        AttackDieFace.HOLLOW_SWORD,
        AttackDieFace.TWO_SWORDS_AND_SKULL,
        AttackDieFace.SWORD,
        AttackDieFace.SWORD,
        AttackDieFace.HOLLOW_SWORD,
        AttackDieFace.HOLLOW_SWORD,
      ];

      const result = toAttackResult(rolled);

      expect(result).to.deep.equal({ attack: 5, kill: 1 });
    });
  });

  describe("toDefenseResult", () => {
    it("can sum up a bunch of die faces into a campaign result", () => {
      const rolled: DefenseDieFace[] = [
        DefenseDieFace.DOUBLE,
        DefenseDieFace.TWO_SHIELDS,
        DefenseDieFace.SHIELD,
        DefenseDieFace.TWO_SHIELDS,
        DefenseDieFace.BLANK,
        DefenseDieFace.SHIELD,
      ];

      const result = toDefenseResult(rolled);

      expect(result).to.deep.equal({ defense: 12 });
    });
  });
});
