// tslint:disable:no-unused-expression
import { expect } from "chai";
import "mocha";
import {
  combineSetWithOdds,
  Fraction,
  odds,
  RandomDevice,
  roll,
  WithOdds,
} from "../../src/math";
import { arraysOfOutcomesAreSame, compareToExpected } from "../support";

function sum(numbers: number[]): number {
  return numbers.reduce((x, y) => x + y);
}

describe("math", () => {
  describe("combineSetWithOdds", () => {
    it("combines 2 sets with odds", () => {
      const swo1: WithOdds<number[]> = {
        oddsOfValue: new Fraction(1, 3),
        value: [1, 2],
      };

      const swo2: WithOdds<string[]> = {
        oddsOfValue: new Fraction(1, 2),
        value: ["a", "b"],
      };

      const combined = combineSetWithOdds(swo1, swo2);

      expect(combined.value).to.deep.equal([1, 2, "a", "b"]);
      expect(combined.oddsOfValue.sameAs(new Fraction(1, 6))).to.be.true;
    });

    it("can be used for reduction", () => {
      const sets: WithOdds<number[]>[] = [
        { value: [1, 2], oddsOfValue: new Fraction(1, 2) },
        { value: [5, 6], oddsOfValue: new Fraction(1, 3) },
        { value: [8, 9], oddsOfValue: new Fraction(1, 4) },
      ];

      const combined = sets.reduce(combineSetWithOdds);

      expect(combined.value).to.deep.equal([1, 2, 5, 6, 8, 9]);
      expect(combined.oddsOfValue.sameAs(new Fraction(1, 24))).to.be.true;
    });
  });

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

      const expected: WithOdds<number[]>[] = [
        { value: [1], oddsOfValue: new Fraction(1, 6) },
        { value: [2], oddsOfValue: new Fraction(1, 6) },
        { value: [3], oddsOfValue: new Fraction(1, 6) },
        { value: [4], oddsOfValue: new Fraction(1, 6) },
        { value: [5], oddsOfValue: new Fraction(1, 6) },
        { value: [6], oddsOfValue: new Fraction(1, 6) },
      ];

      const results: WithOdds<number[]>[] = odds([d6]);

      compareToExpected<number[]>(
        expect,
        expected,
        results,
        arraysOfOutcomesAreSame
      );
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

      const expected: WithOdds<any[]>[] = [
        { value: [1, "a"], oddsOfValue: new Fraction(1, 12) },
        { value: [1, "b"], oddsOfValue: new Fraction(1, 12) },
        { value: [1, "c"], oddsOfValue: new Fraction(1, 12) },
        { value: [2, "a"], oddsOfValue: new Fraction(1, 12) },
        { value: [2, "b"], oddsOfValue: new Fraction(1, 12) },
        { value: [2, "c"], oddsOfValue: new Fraction(1, 12) },
        { value: [3, "a"], oddsOfValue: new Fraction(1, 12) },
        { value: [3, "b"], oddsOfValue: new Fraction(1, 12) },
        { value: [3, "c"], oddsOfValue: new Fraction(1, 12) },
        { value: [4, "a"], oddsOfValue: new Fraction(1, 12) },
        { value: [4, "b"], oddsOfValue: new Fraction(1, 12) },
        { value: [4, "c"], oddsOfValue: new Fraction(1, 12) },
      ];

      const results: WithOdds<any[]>[] = odds<any>([d4, abcDie]);

      compareToExpected<any[]>(
        expect,
        expected,
        results,
        arraysOfOutcomesAreSame
      );
    });

    it("combines identical sets", () => {
      const d2 = new RandomDevice<number>([
        [1, new Fraction(1, 2)],
        [2, new Fraction(1, 2)],
      ]);

      const expected: WithOdds<any[]>[] = [
        { value: [1, 1], oddsOfValue: new Fraction(1, 4) },
        { value: [1, 2], oddsOfValue: new Fraction(1, 2) },
        { value: [2, 2], oddsOfValue: new Fraction(1, 4) },
      ];

      const results: WithOdds<number[]>[] = odds([d2, d2]);

      compareToExpected<number[]>(
        expect,
        expected,
        results,
        arraysOfOutcomesAreSame
      );
    });
  });

  describe("roll", () => {
    it("can roll a single random device", () => {
      const d4 = new RandomDevice<number>([
        [1, new Fraction(1, 4)],
        [2, new Fraction(1, 4)],
        [3, new Fraction(1, 4)],
        [4, new Fraction(1, 4)],
      ]);

      const expected: WithOdds<number>[] = [
        { value: 1, oddsOfValue: new Fraction(1, 4) },
        { value: 2, oddsOfValue: new Fraction(1, 4) },
        { value: 3, oddsOfValue: new Fraction(1, 4) },
        { value: 4, oddsOfValue: new Fraction(1, 4) },
      ];

      const results: WithOdds<number>[] = roll<number, number>(
        d4,
        1,
        sum,
        (a, b) => a === b
      );
      compareToExpected<number>(expect, expected, results, (a, b) => a === b);
    });

    it("can roll several random devices", () => {
      const d4 = new RandomDevice<number>([
        [1, new Fraction(1, 4)],
        [2, new Fraction(1, 4)],
        [3, new Fraction(1, 4)],
        [4, new Fraction(1, 4)],
      ]);

      const expected: WithOdds<number>[] = [
        { value: 2, oddsOfValue: new Fraction(1, 16) },
        { value: 3, oddsOfValue: new Fraction(2, 16) },
        { value: 4, oddsOfValue: new Fraction(3, 16) },
        { value: 5, oddsOfValue: new Fraction(4, 16) },
        { value: 6, oddsOfValue: new Fraction(3, 16) },
        { value: 7, oddsOfValue: new Fraction(2, 16) },
        { value: 8, oddsOfValue: new Fraction(1, 16) },
      ];

      const results: WithOdds<number>[] = roll<number, number>(
        d4,
        2,
        sum,
        (a, b) => a === b
      );
      compareToExpected<number>(expect, expected, results, (a, b) => a === b);
    });
  });
});
