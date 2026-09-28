import { describe, expect, it } from 'vitest';
import { directionsUrl } from './place-details';
import type { TravelMode } from './types';

describe('directionsUrl', () => {
  const destination = { lat: 13.75, lon: 100.54 };

  it.each<TravelMode>(['driving', 'two-wheeler', 'bicycling', 'walking'])(
    'passes %s to Google Maps',
    (mode) => {
      const url = new URL(directionsUrl(destination, mode));
      expect(url.origin).toBe('https://www.google.com');
      expect(url.searchParams.get('destination')).toBe('13.75,100.54');
      expect(url.searchParams.get('travelmode')).toBe(mode);
      expect(url.searchParams.get('dir_action')).toBe('navigate');
      expect(url.searchParams.has('origin')).toBe(false);
    },
  );

  it('uses a chosen starting point when one is provided', () => {
    const url = new URL(
      directionsUrl(destination, 'two-wheeler', { lat: 13.7, lon: 100.5 }),
    );
    expect(url.searchParams.get('origin')).toBe('13.7,100.5');
  });
});
