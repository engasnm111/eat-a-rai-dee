import type { Coordinates, Restaurant, TravelMode } from './types';

export function addressFor(place: Restaurant): string | null {
  const tags = place.tags;
  if (tags['addr:full']) return tags['addr:full'];

  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:subdistrict'],
    tags['addr:district'],
    tags['addr:city'],
    tags['addr:province'],
    tags['addr:postcode'],
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : null;
}

function osmRoutingEngine(mode: TravelMode): string {
  switch (mode) {
    case 'walking':
      return 'fossgis_osrm_foot';
    case 'bicycling':
      return 'fossgis_osrm_bike';
    case 'driving':
    case 'two-wheeler':
      return 'fossgis_osrm_car';
  }
}

export function directionsUrl(
  destination: Coordinates,
  travelMode: TravelMode,
  origin?: Coordinates,
): string {
  const url = new URL('https://www.openstreetmap.org/directions');
  url.searchParams.set('engine', osmRoutingEngine(travelMode));
  const destinationValue = `${destination.lat},${destination.lon}`;
  const route = origin
    ? `${origin.lat},${origin.lon};${destinationValue}`
    : `;${destinationValue}`;
  url.searchParams.set('route', route);
  return url.toString();
}

export function openStreetMapUrl(place: Restaurant): string {
  return `https://www.openstreetmap.org/${place.id}`;
}
