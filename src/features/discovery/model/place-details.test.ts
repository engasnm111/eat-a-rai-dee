import { describe, expect, it } from 'vitest';
import {
  addressFor,
  directionsUrl,
  googleMapsDirectionsUrl,
} from './place-details';
import type { Restaurant, TravelMode } from './types';

describe('addressFor', () => {
  const place = (tags: Restaurant['tags']): Restaurant => ({
    id: 'node/1',
    name: 'Test place',
    coordinate: { lat: 13.75, lon: 100.54 },
    category: 'restaurant',
    tags,
  });

  it('uses addr:full when OSM provides a complete address', () => {
    expect(
      addressFor(place({ 'addr:full': '123 Test Road Bangkok 10110' })),
    ).toBe('123 Test Road Bangkok 10110');
  });

  it('assembles common OSM address fields when addr:full is missing', () => {
    expect(
      addressFor(
        place({
          'addr:housenumber': '123',
          'addr:street': 'Test Road',
          'addr:suburb': 'Pathum Wan',
          'addr:city': 'Bangkok',
          'addr:postcode': '10110',
        }),
      ),
    ).toBe('123 Test Road Pathum Wan Bangkok 10110');
  });
});

describe('googleMapsDirectionsUrl', () => {
  const destination = { lat: 13.75, lon: 100.54 };

  it.each<[TravelMode, string]>([
    ['driving', 'driving'],
    ['two-wheeler', 'driving'],
    ['bicycling', 'bicycling'],
    ['walking', 'walking'],
  ])('opens Google Maps navigation for %s', (mode, googleMode) => {
    const url = new URL(
      googleMapsDirectionsUrl(destination, mode, { lat: 13.7, lon: 100.5 }),
    );

    expect(url.origin).toBe('https://www.google.com');
    expect(url.pathname).toBe('/maps/dir/');
    expect(url.searchParams.get('api')).toBe('1');
    expect(url.searchParams.get('origin')).toBe('13.7,100.5');
    expect(url.searchParams.get('destination')).toBe('13.75,100.54');
    expect(url.searchParams.get('travelmode')).toBe(googleMode);
    expect(url.searchParams.get('dir_action')).toBe('navigate');
  });

  it('lets Google Maps use the current device location when origin is omitted', () => {
    const url = new URL(googleMapsDirectionsUrl(destination, 'driving'));
    expect(url.searchParams.has('origin')).toBe(false);
  });
});

describe('directionsUrl', () => {
  const destination = { lat: 13.75, lon: 100.54 };

  it.each<[TravelMode, string]>([
    ['driving', 'fossgis_osrm_car'],
    ['two-wheeler', 'fossgis_osrm_car'],
    ['bicycling', 'fossgis_osrm_bike'],
    ['walking', 'fossgis_osrm_foot'],
  ])('uses the supported OpenStreetMap router for %s', (mode, engine) => {
    const url = new URL(directionsUrl(destination, mode));
    expect(url.origin).toBe('https://www.openstreetmap.org');
    expect(url.pathname).toBe('/directions');
    expect(url.searchParams.get('engine')).toBe(engine);
    expect(url.searchParams.get('route')).toBe(';13.75,100.54');
  });

  it('uses a chosen starting point when one is provided', () => {
    const url = new URL(
      directionsUrl(destination, 'bicycling', { lat: 13.7, lon: 100.5 }),
    );
    expect(url.searchParams.get('route')).toBe('13.7,100.5;13.75,100.54');
  });
});
