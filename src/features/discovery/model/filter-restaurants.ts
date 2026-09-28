import type {
  Coordinates,
  QuickFilterId,
  Restaurant,
  RestaurantWithDistance,
  SearchCriteria,
} from './types';
import { QUICK_FILTER_CATALOG } from './quick-filter-catalog';

const EARTH_RADIUS_METERS = 6_371_000;
type OpeningHoursConstructor = typeof import('opening_hours').default;
let openingHoursConstructor: OpeningHoursConstructor | null = null;
let openingHoursLoad: Promise<void> | null = null;

export function ensureOpeningHours(): Promise<void> {
  if (openingHoursConstructor) return Promise.resolve();
  openingHoursLoad ??= import('opening_hours')
    .then((module) => {
      openingHoursConstructor = module.default;
    })
    .finally(() => {
      openingHoursLoad = null;
    });
  return openingHoursLoad;
}

export function distanceMeters(from: Coordinates, to: Coordinates): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLon = toRadians(to.lon - from.lon);
  const latitudeA = toRadians(from.lat);
  const latitudeB = toRadians(to.lat);
  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(haversine)));
}

export function getOpenState(
  tags: Record<string, string>,
  now = new Date(),
): boolean | null {
  if (!tags['opening_hours'] || !openingHoursConstructor) return null;

  try {
    const hours = new openingHoursConstructor(tags['opening_hours']);
    if (hours.getUnknown(now)) return null;
    return hours.getState(now);
  } catch {
    // Incomplete community data should not be shown as definitely open or closed.
    return null;
  }
}

function textForMatch(place: Restaurant): string {
  return [
    place.name,
    place.tags['name:th'],
    place.tags['name:en'],
    place.tags['cuisine'],
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase();
}

function cuisinesForMatch(place: Restaurant): Set<string> {
  return new Set(
    (place.tags['cuisine'] ?? '')
      .toLowerCase()
      .split(/[;,]/)
      .map((part) => part.trim()),
  );
}

function matchesPreparedQuickFilter(
  place: Restaurant,
  filter: QuickFilterId,
  text: string,
  cuisines: Set<string>,
): boolean {
  const definition = QUICK_FILTER_CATALOG[filter];
  return (
    (definition.categories?.includes(place.category) ?? false) ||
    (definition.cuisines !== undefined &&
      definition.cuisines.some((candidate) => cuisines.has(candidate))) ||
    (definition.namePattern?.test(text) ?? false) ||
    (definition.tags !== undefined &&
      Object.entries(definition.tags).some(([key, values]) =>
        values.includes((place.tags[key] ?? '').toLowerCase()),
      ))
  );
}

export function matchesQuickFilter(
  place: Restaurant,
  filter: QuickFilterId,
): boolean {
  return matchesPreparedQuickFilter(
    place,
    filter,
    textForMatch(place),
    cuisinesForMatch(place),
  );
}

function isAffirmative(value?: string): boolean {
  return value === 'yes' || value === 'only' || value === 'designated';
}

export function filterRestaurants(
  restaurants: Restaurant[],
  criteria: SearchCriteria,
  origin: Coordinates,
  now = new Date(),
): RestaurantWithDistance[] {
  const keyword = criteria.keyword.trim().toLocaleLowerCase();

  return restaurants
    .map((restaurant) => ({
      ...restaurant,
      distanceMeters: distanceMeters(origin, restaurant.coordinate),
    }))
    .filter((restaurant) => {
      if (restaurant.distanceMeters > criteria.radiusMeters) return false;
      const text =
        keyword || criteria.quickFilters.length > 0
          ? textForMatch(restaurant)
          : '';
      if (keyword && !text.includes(keyword)) return false;
      if (criteria.quickFilters.length > 0) {
        const cuisines = cuisinesForMatch(restaurant);
        if (
          !criteria.quickFilters.some((filter) =>
            matchesPreparedQuickFilter(restaurant, filter, text, cuisines),
          )
        ) {
          return false;
        }
      }
      if (criteria.openNow && getOpenState(restaurant.tags, now) !== true)
        return false;
      if (
        criteria.vegetarian &&
        !isAffirmative(restaurant.tags['diet:vegetarian']) &&
        !isAffirmative(restaurant.tags['diet:vegan'])
      ) {
        return false;
      }
      if (criteria.wheelchair && !isAffirmative(restaurant.tags['wheelchair']))
        return false;
      if (criteria.takeaway && !isAffirmative(restaurant.tags['takeaway']))
        return false;
      if (criteria.delivery && !isAffirmative(restaurant.tags['delivery']))
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        a.distanceMeters - b.distanceMeters || a.name.localeCompare(b.name),
    );
}
