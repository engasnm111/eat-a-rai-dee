import { describe, expect, it } from 'vitest';
import type { RestaurantWithDistance } from '../../discovery/model/types';
import { pickSpinWinner, rankSpinCandidates } from './free-spin';

function restaurant(
  id: string,
  distanceMeters: number,
): RestaurantWithDistance {
  return {
    id,
    name: id,
    coordinate: { lat: 13.7, lon: 100.5 },
    category: 'restaurant',
    tags: {},
    distanceMeters,
  };
}

describe('rankSpinCandidates', () => {
  it('prioritizes site ratings, then distance, with unrated places last and at most ten candidates', () => {
    const restaurants = Array.from({ length: 12 }, (_, index) =>
      restaurant(`node/${index + 1}`, 1200 - index * 50),
    );
    const ratings = {
      'node/1': { average: 4.5, count: 2 },
      'node/2': { average: 5, count: 1 },
      'node/3': { average: 4.5, count: 5 },
    };

    const ranked = rankSpinCandidates(restaurants, ratings);

    expect(ranked).toHaveLength(10);
    expect(ranked.slice(0, 3).map((item) => item.id)).toEqual([
      'node/2',
      'node/3',
      'node/1',
    ]);
    expect(
      ranked
        .slice(3)
        .every((item) => !ratings[item.id as keyof typeof ratings]),
    ).toBe(true);
    expect(ranked[3]!.distanceMeters).toBeLessThanOrEqual(
      ranked[4]!.distanceMeters,
    );
  });
});

describe('pickSpinWinner', () => {
  it('maps the whole random interval evenly across the candidate indexes', () => {
    const candidates = ['a', 'b', 'c', 'd'];
    expect(pickSpinWinner(candidates, () => 0)).toBe('a');
    expect(pickSpinWinner(candidates, () => 0.249999)).toBe('a');
    expect(pickSpinWinner(candidates, () => 0.25)).toBe('b');
    expect(pickSpinWinner(candidates, () => 0.999999)).toBe('d');
  });

  it('returns null for an empty candidate list', () => {
    expect(pickSpinWinner([], () => 0.5)).toBeNull();
  });
});
