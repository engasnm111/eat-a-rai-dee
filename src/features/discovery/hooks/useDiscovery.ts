import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchRestaurantsNear } from '../api/overpass';
import {
  ensureOpeningHours,
  filterRestaurants,
} from '../model/filter-restaurants';
import {
  DEFAULT_CRITERIA,
  type Coordinates,
  type QuickFilterId,
  type Restaurant,
  type SearchCriteria,
} from '../model/types';
import { DataError, type DataErrorCode } from '../../../lib/http';

export const SAMPLE_POINT: Coordinates = { lat: 13.7465, lon: 100.5347 };

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
export type LocationKind = 'sample' | 'device' | 'picked';

function queryKey(point: Coordinates, radiusMeters: number): string {
  return `${point.lat.toFixed(5)},${point.lon.toFixed(5)}:${radiusMeters}`;
}

export function useDiscovery() {
  const [origin, setOrigin] = useState<Coordinates>(SAMPLE_POINT);
  const [locationKind, setLocationKind] = useState<LocationKind>('sample');
  const [criteria, setCriteria] = useState<SearchCriteria>(DEFAULT_CRITERIA);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorCode, setErrorCode] = useState<DataErrorCode | 'UNKNOWN' | null>(
    null,
  );
  const requestRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<{ key: string; restaurants: Restaurant[] } | null>(
    null,
  );

  useEffect(() => () => requestRef.current?.abort(), []);

  const visibleRestaurants = useMemo(
    () => filterRestaurants(restaurants, criteria, origin),
    [restaurants, criteria, origin],
  );

  const updateOrigin = useCallback((next: Coordinates, kind: LocationKind) => {
    requestRef.current?.abort();
    cacheRef.current = null;
    setOrigin(next);
    setLocationKind(kind);
    setRestaurants([]);
    setStatus('idle');
    setErrorCode(null);
  }, []);

  const search = useCallback(
    async (next: SearchCriteria) => {
      requestRef.current?.abort();
      setCriteria(next);
      setErrorCode(null);

      const key = queryKey(origin, next.radiusMeters);
      if (cacheRef.current?.key === key) {
        setRestaurants(cacheRef.current.restaurants);
        setStatus('success');
        return;
      }

      const controller = new AbortController();
      requestRef.current = controller;
      setStatus('loading');
      setRestaurants([]);

      try {
        const [found] = await Promise.all([
          fetchRestaurantsNear(origin, next.radiusMeters, controller.signal),
          ensureOpeningHours(),
        ]);
        if (controller.signal.aborted) return;
        cacheRef.current = { key, restaurants: found };
        setRestaurants(found);
        setStatus('success');
      } catch (error) {
        if (controller.signal.aborted) return;
        setErrorCode(error instanceof DataError ? error.code : 'UNKNOWN');
        setStatus('error');
      }
    },
    [origin],
  );

  const toggleQuickFilter = useCallback((filter: QuickFilterId) => {
    setCriteria((current) => ({
      ...current,
      quickFilters: current.quickFilters.includes(filter)
        ? current.quickFilters.filter((item) => item !== filter)
        : [...current.quickFilters, filter],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setCriteria((current) => ({
      ...DEFAULT_CRITERIA,
      radiusMeters: current.radiusMeters,
      travelMode: current.travelMode,
    }));
  }, []);

  return {
    origin,
    locationKind,
    criteria,
    visibleRestaurants,
    status,
    errorCode,
    updateOrigin,
    search,
    toggleQuickFilter,
    clearFilters,
  };
}
