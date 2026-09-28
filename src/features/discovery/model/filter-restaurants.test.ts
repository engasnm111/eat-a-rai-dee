import { describe, expect, it } from 'vitest';
import {
  ensureOpeningHours,
  filterRestaurants,
  matchesQuickFilter,
} from './filter-restaurants';
import type { Restaurant, SearchCriteria } from './types';

const origin = { lat: 13.746, lon: 100.534 };

function place(overrides: Partial<Restaurant>): Restaurant {
  return {
    id: 'node/1',
    name: 'ร้านตัวอย่าง',
    coordinate: origin,
    category: 'restaurant',
    tags: {},
    ...overrides,
  };
}

const criteria: SearchCriteria = {
  keyword: '',
  radiusMeters: 1000,
  travelMode: 'driving',
  quickFilters: [],
  openNow: false,
  vegetarian: false,
  wheelchair: false,
  takeaway: false,
  delivery: false,
};

describe('filterRestaurants', () => {
  it('matches popular dishes only when source names or tags support them', () => {
    const buffet = place({
      name: 'ครัวกลางวัน',
      tags: { buffet: 'yes' },
    });
    const shabu = place({
      name: 'Shabu Corner',
      tags: { cuisine: 'japanese' },
    });
    const crispyPork = place({
      name: 'ข้าวหมูกรอบ',
      tags: { cuisine: 'thai' },
    });
    const generic = place({
      name: 'ร้านอาหารญี่ปุ่น',
      tags: { cuisine: 'japanese' },
    });

    expect(matchesQuickFilter(buffet, 'buffet')).toBe(true);
    expect(matchesQuickFilter(shabu, 'shabuSuki')).toBe(true);
    expect(matchesQuickFilter(crispyPork, 'crispyPork')).toBe(true);
    expect(matchesQuickFilter(generic, 'shabuSuki')).toBe(false);
    expect(matchesQuickFilter(generic, 'crispyPork')).toBe(false);

    const found = filterRestaurants(
      [generic, crispyPork, shabu, buffet],
      { ...criteria, quickFilters: ['buffet', 'shabuSuki', 'crispyPork'] },
      origin,
    );
    expect(found).toHaveLength(3);
  });

  it('combines quick food picks with OR, then enforces the real radius', () => {
    const nearbyNoodles = place({
      id: 'node/1',
      name: 'ก๋วยเตี๋ยวเรือ',
      tags: { cuisine: 'noodle' },
    });
    const nearbyCoffee = place({
      id: 'node/2',
      name: 'กาแฟมุมตึก',
      category: 'cafe',
      tags: { amenity: 'cafe' },
    });
    const nearbyThai = place({
      id: 'node/3',
      name: 'ข้าวแกง',
      tags: { cuisine: 'thai' },
    });
    const farCoffee = place({
      id: 'node/4',
      name: 'กาแฟไกล',
      category: 'cafe',
      coordinate: { lat: 13.765, lon: 100.534 },
      tags: { amenity: 'cafe' },
    });

    const found = filterRestaurants(
      [nearbyThai, farCoffee, nearbyCoffee, nearbyNoodles],
      { ...criteria, quickFilters: ['noodles', 'coffee'] },
      origin,
    );

    expect(found.map((item) => item.id)).toEqual(['node/1', 'node/2']);
    expect(found.every((item) => item.distanceMeters <= 1000)).toBe(true);
  });

  it('requires keyword and selected service filters together; unknown tags do not pass', () => {
    const matching = place({
      id: 'node/1',
      name: 'ครัวอร่อย',
      tags: { 'name:en': 'Aroi Kitchen', takeaway: 'yes', wheelchair: 'yes' },
    });
    const unknownWheelchair = place({
      id: 'node/2',
      name: 'ครัวอร่อย 2',
      tags: { takeaway: 'yes' },
    });

    const found = filterRestaurants(
      [unknownWheelchair, matching],
      { ...criteria, keyword: 'aroi', takeaway: true, wheelchair: true },
      origin,
    );

    expect(found.map((item) => item.id)).toEqual(['node/1']);
  });

  it('treats unknown hours as unknown when filtering places open now', async () => {
    await ensureOpeningHours();
    const alwaysOpen = place({ id: 'node/1', tags: { opening_hours: '24/7' } });
    const unknownHours = place({ id: 'node/2' });

    const found = filterRestaurants(
      [unknownHours, alwaysOpen],
      { ...criteria, openNow: true },
      origin,
      new Date('2026-09-28T12:00:00+07:00'),
    );

    expect(found.map((item) => item.id)).toEqual(['node/1']);
  });
});
