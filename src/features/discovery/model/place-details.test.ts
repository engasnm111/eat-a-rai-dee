import { describe, expect, it } from 'vitest';
import { addressFor, directionsUrl } from './place-details';
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
