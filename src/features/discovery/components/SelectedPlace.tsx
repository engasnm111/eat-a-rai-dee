import { ArrowUpRight, MapPinned, Navigation, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  addressFor,
  directionsUrl,
  openStreetMapUrl,
} from '../model/place-details';
import type { RestaurantWithDistance } from '../model/types';
import { DistanceLabel, OpenStatus } from './PlaceMeta';

interface SelectedPlaceProps {
  place: RestaurantWithDistance;
  onClose: () => void;
}

export function SelectedPlace({ place, onClose }: SelectedPlaceProps) {
  const { t } = useTranslation();
  const address = addressFor(place);

  return (
    <section className="selected-place" aria-label={place.name}>
      <button
        type="button"
        className="icon-button selected-place__close"
        aria-label={t('place.closeDetails')}
        onClick={onClose}
      >
        <X size={18} aria-hidden="true" />
      </button>
      <span className="selected-place__category">
        {t(`place.category.${place.category}`)}
      </span>
      <h3>{place.name}</h3>
      <div className="selected-place__meta">
        <DistanceLabel distanceMeters={place.distanceMeters} />
        <OpenStatus place={place} />
      </div>
      <p className="selected-place__address">
        <MapPinned size={16} aria-hidden="true" />
        {address ?? t('place.addressUnknown')}
      </p>
      <div className="selected-place__actions">
        <a
          className="primary-button"
          href={directionsUrl(place.coordinate)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation size={17} aria-hidden="true" />
          {t('place.route')}
        </a>
        <a
          className="source-link"
          href={openStreetMapUrl(place)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('place.osmDetails')}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
