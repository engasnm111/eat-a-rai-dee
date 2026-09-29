import { ArrowUpRight, MapPinned, Navigation, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '@supabase/supabase-js';
import { PlaceMemberActions } from '../../member/components/PlaceMemberActions';
import type {
  RatingSummary,
  RestaurantSnapshot,
  ReviewRecord,
} from '../../member/model/types';
import {
  addressFor,
  directionsUrl,
  googleMapsDirectionsUrl,
  openStreetMapUrl,
} from '../model/place-details';
import type {
  Coordinates,
  RestaurantWithDistance,
  TravelMode,
} from '../model/types';
import { DistanceLabel, OpenStatus } from './PlaceMeta';

interface SelectedPlaceProps {
  place: RestaurantWithDistance;
  travelMode: TravelMode;
  origin?: Coordinates;
  user: User | null;
  rating?: RatingSummary;
  favorite: boolean;
  review?: ReviewRecord;
  actionError: boolean;
  onToggleFavorite: (place: RestaurantSnapshot) => Promise<boolean>;
  onSaveReview: (
    place: RestaurantSnapshot,
    rating: number,
    comment: string,
  ) => Promise<boolean>;
  onDeleteReview: (reviewId: number) => Promise<boolean>;
  onClose: () => void;
}

export function SelectedPlace({
  place,
  travelMode,
  origin,
  user,
  rating,
  favorite,
  review,
  actionError,
  onToggleFavorite,
  onSaveReview,
  onDeleteReview,
  onClose,
}: SelectedPlaceProps) {
  const { t } = useTranslation();
  const address = addressFor(place);
  const snapshot: RestaurantSnapshot = {
    restaurantId: place.id,
    restaurantName: place.name,
    address,
    latitude: place.coordinate.lat,
    longitude: place.coordinate.lon,
  };

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
      <PlaceMemberActions
        key={`${user?.id ?? 'guest'}:${place.id}:${review?.id ?? 'new'}:${review?.updatedAt ?? ''}`}
        user={user}
        place={snapshot}
        favorite={favorite}
        review={review}
        summary={rating}
        actionError={actionError}
        onToggleFavorite={onToggleFavorite}
        onSaveReview={onSaveReview}
        onDeleteReview={onDeleteReview}
      />
      <div className="selected-place__actions">
        <a
          className="primary-button"
          href={googleMapsDirectionsUrl(place.coordinate, travelMode, origin)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation size={17} aria-hidden="true" />
          {t('place.route', { mode: t(`search.travelMode.${travelMode}`) })}
        </a>
        <a
          className="secondary-button"
          href={directionsUrl(place.coordinate, travelMode, origin)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation size={15} aria-hidden="true" />
          {t('place.osmRoute')}
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
      {travelMode === 'two-wheeler' && (
        <p className="selected-place__route-note">
          {t('place.motorcycleNote')}
        </p>
      )}
    </section>
  );
}
