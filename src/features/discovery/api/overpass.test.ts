import { describe, expect, it, vi } from 'vitest';
import { fetchRestaurantsNear } from './overpass';

describe('fetchRestaurantsNear', () => {
  it('accepts node and way centers, ignores incomplete records, and uses a fixed tag query', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          elements: [
            {
              type: 'node',
              id: 1,
              lat: 13.746,
              lon: 100.534,
              tags: { name: 'ข้าวแกง', amenity: 'restaurant' },
            },
            {
              type: 'way',
              id: 2,
              center: { lat: 13.747, lon: 100.535 },
              tags: { 'name:th': 'ร้านขนม', shop: 'bakery' },
            },
            { type: 'node', id: 3, tags: { name: 'พิกัดหาย' } },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const result = await fetchRestaurantsNear(
      { lat: 13.746, lon: 100.534 },
      1200,
      new AbortController().signal,
      fetcher,
    );

    expect(result.map((place) => place.name)).toEqual(['ข้าวแกง', 'ร้านขนม']);
    expect(result[1]?.coordinate).toEqual({ lat: 13.747, lon: 100.535 });
    const [url, options] = fetcher.mock.calls[0] ?? [];
    expect(url).toBe('https://overpass-api.de/api/interpreter');
    expect(options?.method).toBe('POST');
    expect(String(options?.body)).toContain('1200%2C13.746%2C100.534');
    expect(String(options?.body)).not.toContain('ข้าวแกง');
  });

  it('reports server throttling without presenting it as an empty search', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('', { status: 429 }));

    await expect(
      fetchRestaurantsNear(
        { lat: 13.746, lon: 100.534 },
        1000,
        new AbortController().signal,
        fetcher,
      ),
    ).rejects.toMatchObject({ code: 'RATE_LIMITED' });
  });

  it('reports an overloaded Overpass server without blaming the user connection', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('', { status: 504 }));

    await expect(
      fetchRestaurantsNear(
        { lat: 13.746, lon: 100.534 },
        10_000,
        new AbortController().signal,
        fetcher,
      ),
    ).rejects.toMatchObject({ code: 'SERVER_BUSY' });
  });

  it('accepts a 10 km radius and rejects values beyond the search limit', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ elements: [] })));
    const point = { lat: 13.746, lon: 100.534 };
    const signal = new AbortController().signal;

    await expect(
      fetchRestaurantsNear(point, 10_000, signal, fetcher),
    ).resolves.toEqual([]);
    expect(String(fetcher.mock.calls[0]?.[1]?.body)).toContain(
      '10000%2C13.746%2C100.534',
    );
    await expect(
      fetchRestaurantsNear(point, 10_100, signal, fetcher),
    ).rejects.toBeInstanceOf(RangeError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
