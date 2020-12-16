import { Fraction } from "../math";
import { RandomDevice } from "../RandomDevice";
import { AttackDieFace } from "./AttackDieFace";
import { CampaignResult } from "./CampaignResult";
import { DefenseDieFace } from "./DefenseDieFace";

/** Either an attack or a defense die face. */
export type OathDieFace = AttackDieFace | DefenseDieFace;

/** The Oath attack (red) die. */
export const AttackDie = new RandomDevice<AttackDieFace>([
  [AttackDieFace.HOLLOW_SWORD, new Fraction(3, 6)],
  [AttackDieFace.SWORD, new Fraction(2, 6)],
  [AttackDieFace.TWO_SWORDS_AND_SKULL, new Fraction(1, 6)],
]);

/** The Oath defense (blue) die. */
export const DefenseDie = new RandomDevice<DefenseDieFace>([
  [DefenseDieFace.BLANK, new Fraction(2, 6)],
  [DefenseDieFace.SHIELD, new Fraction(2, 6)],
  [DefenseDieFace.TWO_SHIELDS, new Fraction(1, 6)],
  [DefenseDieFace.DOUBLE, new Fraction(1, 6)],
]);

/**
 * Sums up a set of attack and defense die faces into a campaign result.
 *
 * @param {DieFace[]} faces
 *   A set of attack and defense die faces.
 * @returns {CampaignResult}
 *   The campaign result after adding all die faces.
 */
export function toCampaignResult(faces: OathDieFace[]): CampaignResult {
  const raw = faces.sort().reduce(
    (acc: CampaignResult, face: OathDieFace) => {
      switch (face) {
        case AttackDieFace.HOLLOW_SWORD:
          return { ...acc, attack: acc.attack + 0.5 };
        case AttackDieFace.SWORD:
          return { ...acc, attack: acc.attack + 1 };
        case AttackDieFace.TWO_SWORDS_AND_SKULL:
          return { ...acc, attack: acc.attack + 2, kill: acc.kill + 1 };
        case DefenseDieFace.BLANK:
          return acc;
        case DefenseDieFace.SHIELD:
          return { ...acc, defense: acc.defense + 1 };
        case DefenseDieFace.TWO_SHIELDS:
          return { ...acc, defense: acc.defense + 2 };
        case DefenseDieFace.DOUBLE:
          return { ...acc, defense: acc.defense * 2 };
        default:
          return acc;
      }
    },
    { attack: 0, defense: 0, kill: 0 }
  );
  return { ...raw, attack: Math.floor(raw.attack) };
}

export * from "./AttackDieFace";
export * from "./CampaignResult";
export * from "./DefenseDieFace";
