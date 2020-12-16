/**
 * TYpe to hold a campaign result.
 */
export interface CampaignResult {
  /** The rolled attack value. */
  attack: number;

  /** The rolled defense value. */
  defense: number;

  /** The rolled killed value (from skulls). */
  kill: number;
}

/**
 * Compare 2 campaign results with following rules:
 * - attack descending
 * - then defense ascending
 * - then kill ascending
 *
 * @param {CampaignResult} a
 *   The first campaign result.
 * @param {CampaignResult} b
 *   The second campaign result.
 * @returns {number}
 *   1 if a > b, 0 if a = B and -1 if a < b
 */
export function campaignResultCompareFn(
  a: CampaignResult,
  b: CampaignResult
): number {
  const attackCompareDesc =
    a.attack > b.attack ? -1 : a.attack < b.attack ? 1 : 0;
  const defenseCompareAsc =
    a.defense < b.defense ? -1 : a.defense > b.defense ? 1 : 0;
  const killCompareAsc = a.kill < b.kill ? -1 : a.kill > b.kill ? 1 : 0;

  if (attackCompareDesc !== 0) {
    return attackCompareDesc;
  } else {
    if (defenseCompareAsc !== 0) {
      return defenseCompareAsc;
    } else {
      return killCompareAsc;
    }
  }
}
