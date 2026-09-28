import type { Coordinates, Restaurant, TravelMode } from './types';

export function addressFor(place: Restaurant): string | null {
  const tags = place.tags;
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:subdistrict'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : null;
}

export function directionsUrl(
  destination: Coordinates,
  travelMode: TravelMode,
  origin?: Coordinates,
): string {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  if (origin) {
    url.searchParams.set('origin', `${origin.lat},${origin.lon}`);
  }
  url.searchParams.set('destination', `${destination.lat},${destination.lon}`);
  url.searchParams.set('travelmode', travelMode);
  url.searchParams.set('dir_action', 'navigate');
  return url.toString();
}

export function openStreetMapUrl(place: Restaurant): string {
  return `https://www.openstreetmap.org/${place.id}`;
}
