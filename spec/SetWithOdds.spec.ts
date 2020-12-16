// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import { Fraction } from "../src/math";
import { combineSetWithOdds, SetWithOdds } from "../src/SetWithOdds";

describe("SetWithOdds", () => {
  describe("combineSetWithOdds", () => {
    it("combines 2 sets with odds", () => {
      const swo1: SetWithOdds<number> = {
        odds: new Fraction(1, 3),
        set: [1, 2],
      };

      const swo2: SetWithOdds<string> = {
        odds: new Fraction(1, 2),
        set: ["a", "b"],
      };

      const combined = combineSetWithOdds(swo1, swo2);

      expect(combined.set).to.deep.equal([1, 2, "a", "b"]);
      expect(combined.odds.sameAs(new Fraction(1, 6))).to.be.true;
    });

    it("can be used for reduction", () => {
      const sets: SetWithOdds<number>[] = [
        { set: [1, 2], odds: new Fraction(1, 2) },
        { set: [5, 6], odds: new Fraction(1, 3) },
        { set: [8, 9], odds: new Fraction(1, 4) },
      ];

      const combined = sets.reduce(combineSetWithOdds);

      expect(combined.set).to.deep.equal([1, 2, 5, 6, 8, 9]);
      expect(combined.odds.sameAs(new Fraction(1, 24))).to.be.true;
    });
  });
});
