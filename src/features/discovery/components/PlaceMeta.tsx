import { Clock3, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getOpenState } from '../model/filter-restaurants';
import type { RestaurantWithDistance } from '../model/types';

export function DistanceLabel({ distanceMeters }: { distanceMeters: number }) {
  const { t, i18n } = useTranslation();
  if (distanceMeters < 1000) {
    const count = Math.round(distanceMeters);
    return (
      <span>
        <MapPin size={14} aria-hidden="true" />
        {t('place.distanceMeters', { count })}
      </span>
    );
  }

  const distance = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 1,
  }).format(distanceMeters / 1000);
  return (
    <span>
      <MapPin size={14} aria-hidden="true" />
      {t('place.distanceKm', { distance })}
    </span>
  );
}

export function OpenStatus({ place }: { place: RestaurantWithDistance }) {
  const { t } = useTranslation();
  const state = getOpenState(place.tags);
  const label =
    state === true
      ? t('place.open')
      : state === false
        ? t('place.closed')
        : t('place.hoursUnknown');
  return (
    <span
      className={`open-status ${state === true ? 'is-open' : state === false ? 'is-closed' : ''}`}
    >
      <Clock3 size={14} aria-hidden="true" />
      {label}
    </span>
  );
}
