import { Fraction, RandomDevice } from "../math";
import { AttackDieFace } from "./AttackDieFace";
import { AttackResult, DefenseResult } from "./CampaignResult";
import { DefenseDieFace } from "./DefenseDieFace";

/** The Oath attack (red) die. */
export const AttackDie = new RandomDevice<AttackDieFace>([
  [AttackDieFace.HOLLOW_SWORD, new Fraction(3, 6)],
  [AttackDieFace.SWORD, new Fraction(2, 6)],
  [AttackDieFace.TWO_SWORDS_AND_SKULL, new Fraction(1, 6)],
]);

/**
 * Sums up a set of attack die faces into an attack roll result.
 *
 * @param {DieFace[]} faces
 *   A set of attack die faces.
 * @returns {CampaignResult}
 *   The attack roll result after adding all die faces.
 */
export function toAttackResult(faces: AttackDieFace[]): AttackResult {
  const raw = faces.sort().reduce(
    (acc: AttackResult, face: AttackDieFace) => {
      switch (face) {
        case AttackDieFace.HOLLOW_SWORD:
          return { ...acc, attack: acc.attack + 0.5 };
        case AttackDieFace.SWORD:
          return { ...acc, attack: acc.attack + 1 };
        case AttackDieFace.TWO_SWORDS_AND_SKULL:
          return { ...acc, attack: acc.attack + 2, kill: acc.kill + 1 };
        default:
          throw new Error(`Unknown die face ${face}`);
      }
    },
    { attack: 0, kill: 0 }
  );
  return { ...raw, attack: Math.floor(raw.attack) };
}

/** The Oath defense (blue) die. */
export const DefenseDie = new RandomDevice<DefenseDieFace>([
  [DefenseDieFace.BLANK, new Fraction(2, 6)],
  [DefenseDieFace.SHIELD, new Fraction(2, 6)],
  [DefenseDieFace.TWO_SHIELDS, new Fraction(1, 6)],
  [DefenseDieFace.DOUBLE, new Fraction(1, 6)],
]);

/**
 * Sums up a set of defense die faces into a defense roll result.
 *
 * @param {DieFace[]} faces
 *   A set of defense die faces.
 * @returns {CampaignResult}
 *   The defense roll result after adding all die faces.
 */
export function toDefenseResult(faces: DefenseDieFace[]): DefenseResult {
  return faces.sort().reduce(
    (acc: DefenseResult, face: DefenseDieFace) => {
      switch (face) {
        case DefenseDieFace.BLANK:
          return acc;
        case DefenseDieFace.SHIELD:
          return { ...acc, defense: acc.defense + 1 };
        case DefenseDieFace.TWO_SHIELDS:
          return { ...acc, defense: acc.defense + 2 };
        case DefenseDieFace.DOUBLE:
          return { ...acc, defense: acc.defense * 2 };
        default:
          throw new Error(`Unknown die face ${face}`);
      }
    },
    { defense: 0 }
  );
}

export * from "./AttackDieFace";
export * from "./CampaignResult";
export * from "./DefenseDieFace";
