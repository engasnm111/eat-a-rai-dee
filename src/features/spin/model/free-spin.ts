import type { RestaurantWithDistance } from '../../discovery/model/types';
import type { RatingSummary } from '../../member/model/types';

export const MAX_SPIN_CANDIDATES = 10;

function ratingFor(
  restaurantId: string,
  ratings: Readonly<Record<string, RatingSummary>>,
): number | null {
  const summary = ratings[restaurantId];
  return summary && summary.count > 0 ? summary.average : null;
}

export function rankSpinCandidates(
  restaurants: RestaurantWithDistance[],
  ratings: Readonly<Record<string, RatingSummary>>,
): RestaurantWithDistance[] {
  return [...restaurants]
    .sort((left, right) => {
      const leftRating = ratingFor(left.id, ratings);
      const rightRating = ratingFor(right.id, ratings);

      if (leftRating === null && rightRating !== null) return 1;
      if (leftRating !== null && rightRating === null) return -1;
      if (
        leftRating !== null &&
        rightRating !== null &&
        leftRating !== rightRating
      ) {
        return rightRating - leftRating;
      }
      return left.distanceMeters - right.distanceMeters;
    })
    .slice(0, MAX_SPIN_CANDIDATES);
}

export function pickSpinWinner<T>(
  candidates: readonly T[],
  random: () => number = Math.random,
): T | null {
  if (candidates.length === 0) return null;
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('Random value must be within [0, 1)');
  }
  return candidates[Math.floor(value * candidates.length)] ?? null;
}
