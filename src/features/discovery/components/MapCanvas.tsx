import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { MAP_CONFIG } from '../../../config/map';
import type { Coordinates, RestaurantWithDistance } from '../model/types';

interface MapCanvasProps {
  origin: Coordinates;
  currentLocation: Coordinates | null;
  radiusMeters: number;
  restaurants: RestaurantWithDistance[];
  selectedId: string | null;
  picking: boolean;
  onSelect: (id: string) => void;
  onPick: (coordinate: Coordinates) => void;
}

function placeMarker(
  place: RestaurantWithDistance,
  onSelect: (id: string) => void,
): L.CircleMarker {
  const marker = L.circleMarker([place.coordinate.lat, place.coordinate.lon], {
    radius: 8,
    color: '#fffaf0',
    weight: 3,
    fillColor: '#ed5b42',
    fillOpacity: 1,
  });
  marker.on('click', () => onSelect(place.id));
  const tooltip = document.createElement('span');
  tooltip.textContent = place.name;
  marker.bindTooltip(tooltip, { direction: 'top', offset: [0, -8] });
  return marker;
}

export function MapCanvas({
  origin,
  currentLocation,
  radiusMeters,
  restaurants,
  selectedId,
  picking,
  onSelect,
  onPick,
}: MapCanvasProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const centerRef = useRef<L.CircleMarker | null>(null);
  const currentLocationRef = useRef<L.CircleMarker | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const selectedMarkerRef = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false }).setView(
      [origin.lat, origin.lon],
      14,
    );
    L.tileLayer(MAP_CONFIG.tileUrl, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    const markers = markersRef.current;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markers.clear();
    };
    // The map instance is owned by this component and created once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    circleRef.current?.remove();
    centerRef.current?.remove();
    circleRef.current = L.circle([origin.lat, origin.lon], {
      radius: radiusMeters,
      color: '#5c4371',
      weight: 2,
      fillColor: '#78638b',
      fillOpacity: 0.12,
      dashArray: '7 6',
      interactive: false,
    }).addTo(map);
    centerRef.current = L.circleMarker([origin.lat, origin.lon], {
      radius: 9,
      color: '#fffaf0',
      weight: 4,
      fillColor: '#37253f',
      fillOpacity: 1,
      interactive: false,
    }).addTo(map);
    map.fitBounds(circleRef.current.getBounds(), {
      padding: [28, 28],
      maxZoom: 15,
      animate: true,
    });
  }, [origin, radiusMeters]);

  useEffect(() => {
    const map = mapRef.current;
    currentLocationRef.current?.remove();
    currentLocationRef.current = null;
    if (!map || !currentLocation) return;

    currentLocationRef.current = L.circleMarker(
      [currentLocation.lat, currentLocation.lon],
      {
        radius: 8,
        color: '#ffffff',
        weight: 4,
        fillColor: '#2563eb',
        fillOpacity: 1,
        interactive: false,
      },
    )
      .bindTooltip(t('map.currentLocation'), {
        direction: 'top',
        offset: [0, -8],
        permanent: true,
      })
      .addTo(map);
    map.panTo([currentLocation.lat, currentLocation.lon], { animate: true });
  }, [currentLocation, t]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    selectedMarkerRef.current?.remove();
    selectedMarkerRef.current = null;
    layer.clearLayers();
    markersRef.current.clear();

    for (const place of restaurants.slice(0, MAP_CONFIG.maxMapPins)) {
      const marker = placeMarker(place, onSelect).addTo(layer);
      markersRef.current.set(place.id, marker);
    }
  }, [restaurants, onSelect]);

  useEffect(() => {
    selectedMarkerRef.current?.remove();
    selectedMarkerRef.current = null;
    for (const [id, marker] of markersRef.current) {
      const active = id === selectedId;
      marker.setStyle({
        radius: active ? 12 : 8,
        color: active ? '#37253f' : '#fffaf0',
        fillColor: active ? '#f9c846' : '#ed5b42',
      });
      if (active) marker.bringToFront();
    }
    const selected = restaurants.find((place) => place.id === selectedId);
    if (selected) {
      if (!markersRef.current.has(selected.id) && mapRef.current) {
        selectedMarkerRef.current = placeMarker(selected, onSelect)
          .setStyle({ radius: 12, color: '#37253f', fillColor: '#f9c846' })
          .addTo(mapRef.current);
      }
      mapRef.current?.panTo(
        [selected.coordinate.lat, selected.coordinate.lon],
        { animate: true },
      );
    }
  }, [selectedId, restaurants, onSelect]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getContainer().classList.toggle('is-picking', picking);
    if (!picking) return;

    const handleClick = (event: L.LeafletMouseEvent) => {
      onPick({ lat: event.latlng.lat, lon: event.latlng.lng });
    };
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
      map.getContainer().classList.remove('is-picking');
    };
  }, [picking, onPick]);

  return (
    <div
      ref={containerRef}
      className="map-canvas"
      role="region"
      aria-label={t('map.title')}
    />
  );
}
