import { z } from 'zod';
import { MAP_CONFIG } from '../../../config/map';
import { DataError, postFormJson } from '../../../lib/http';
import type {
  Coordinates,
  Restaurant,
  RestaurantCategory,
} from '../model/types';

const responseSchema = z.object({ elements: z.array(z.unknown()) });
const elementSchema = z.object({
  type: z.enum(['node', 'way', 'relation']),
  id: z.number(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  center: z.object({ lat: z.number(), lon: z.number() }).optional(),
  tags: z.record(z.string(), z.string()),
});

function validCoordinates(point: Coordinates): boolean {
  return (
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lon) &&
    Math.abs(point.lat) <= 90 &&
    Math.abs(point.lon) <= 180
  );
}

function categoryFromTags(tags: Record<string, string>): RestaurantCategory {
  if (tags['shop'] === 'bakery' || tags['shop'] === 'confectionery')
    return 'bakery';
  if (tags['amenity'] === 'ice_cream') return 'dessert';
  if (tags['amenity'] === 'cafe') return 'cafe';
  if (tags['amenity'] === 'fast_food') return 'fast_food';
  if (tags['amenity'] === 'food_court') return 'food_court';
  return 'restaurant';
}

function normalizeRestaurant(raw: unknown): Restaurant | null {
  const parsed = elementSchema.safeParse(raw);
  if (!parsed.success) return null;

  const element = parsed.data;
  const coordinate =
    element.type === 'node' &&
    element.lat !== undefined &&
    element.lon !== undefined
      ? { lat: element.lat, lon: element.lon }
      : element.center;
  const name =
    element.tags['name:th'] || element.tags['name'] || element.tags['name:en'];

  if (!coordinate || !validCoordinates(coordinate) || !name?.trim())
    return null;

  return {
    id: `${element.type}/${element.id}`,
    name: name.trim(),
    coordinate,
    category: categoryFromTags(element.tags),
    tags: element.tags,
  };
}

function buildQuery(point: Coordinates, radiusMeters: number): string {
  // Only validated numbers and fixed tag expressions enter Overpass QL.
  const location = `around:${Math.round(radiusMeters)},${point.lat},${point.lon}`;
  return `[out:json][timeout:25];(nwr["amenity"~"^(restaurant|cafe|fast_food|food_court|ice_cream)$"](${location});nwr["shop"~"^(bakery|confectionery)$"](${location}););out center;`;
}

export async function fetchRestaurantsNear(
  point: Coordinates,
  radiusMeters: number,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<Restaurant[]> {
  if (
    !validCoordinates(point) ||
    !Number.isFinite(radiusMeters) ||
    radiusMeters < 300 ||
    radiusMeters > 5000
  ) {
    throw new RangeError('Invalid search area');
  }

  const timeout = AbortSignal.timeout(30_000);
  const requestSignal = AbortSignal.any([signal, timeout]);
  let payload: unknown;

  try {
    payload = await postFormJson(
      MAP_CONFIG.overpassUrl,
      { data: buildQuery(point, radiusMeters) },
      requestSignal,
      fetcher,
    );
  } catch (error) {
    if (timeout.aborted && !signal.aborted) throw new DataError('TIMEOUT');
    throw error;
  }

  const parsed = responseSchema.safeParse(payload);
  if (!parsed.success) throw new DataError('BAD_RESPONSE');

  const unique = new Map<string, Restaurant>();
  for (const raw of parsed.data.elements) {
    const place = normalizeRestaurant(raw);
    if (place) unique.set(place.id, place);
  }
  return [...unique.values()];
}
