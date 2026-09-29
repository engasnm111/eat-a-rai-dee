import { ArrowUpRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RatingSummary } from '../../member/model/types';
import type { RestaurantWithDistance } from '../model/types';
import { DistanceLabel, OpenStatus } from './PlaceMeta';

interface RestaurantCardProps {
  place: RestaurantWithDistance;
  rating?: RatingSummary;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function RestaurantCard({
  place,
  rating,
  selected,
  onSelect,
}: RestaurantCardProps) {
  const { t } = useTranslation();
  let ratingLabel = t('member.noRating');
  if (rating && rating.count > 0) {
    ratingLabel = `${rating.average.toFixed(1)} (${rating.count})`;
  }

  return (
    <li>
      <button
        type="button"
        className={selected ? 'restaurant-card is-selected' : 'restaurant-card'}
        aria-pressed={selected}
        aria-label={`${t('place.details')}: ${place.name}`}
        onClick={() => onSelect(place.id)}
      >
        <span
          className={`restaurant-card__symbol restaurant-card__symbol--${place.category}`}
          aria-hidden="true"
        >
          {place.name.slice(0, 1).toLocaleUpperCase()}
        </span>
        <span className="restaurant-card__body">
          <span className="restaurant-card__category">
            {t(`place.category.${place.category}`)}
          </span>
          <strong>{place.name}</strong>
          <span className="restaurant-card__meta">
            <DistanceLabel distanceMeters={place.distanceMeters} />
            <OpenStatus place={place} />
          </span>
          <span className="restaurant-card__rating">
            <Star size={14} fill="currentColor" aria-hidden="true" />
            {ratingLabel}
          </span>
        </span>
        <ArrowUpRight
          className="restaurant-card__arrow"
          size={18}
          aria-hidden="true"
        />
      </button>
    </li>
  );
}
