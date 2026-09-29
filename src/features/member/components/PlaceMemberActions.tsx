import { useState } from 'react';
import { Heart, Save, Star, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '@supabase/supabase-js';
import type {
  RatingSummary,
  RestaurantSnapshot,
  ReviewRecord,
} from '../model/types';

interface PlaceMemberActionsProps {
  user: User | null;
  place: RestaurantSnapshot;
  favorite: boolean;
  review?: ReviewRecord;
  summary?: RatingSummary;
  actionError: boolean;
  onToggleFavorite: (place: RestaurantSnapshot) => Promise<boolean>;
  onSaveReview: (
    place: RestaurantSnapshot,
    rating: number,
    comment: string,
  ) => Promise<boolean>;
  onDeleteReview: (reviewId: number) => Promise<boolean>;
}

export function PlaceMemberActions({
  user,
  place,
  favorite,
  review,
  summary,
  actionError,
  onToggleFavorite,
  onSaveReview,
  onDeleteReview,
}: PlaceMemberActionsProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [comment, setComment] = useState(review?.comment ?? '');
  const [busy, setBusy] = useState(false);

  let ratingLabel = t('member.noRating');
  if (summary && summary.count > 0) {
    ratingLabel = `${summary.average.toFixed(1)} / 5 · ${t('member.reviewCount', { count: summary.count })}`;
  }

  if (!user) {
    return (
      <div className="place-member-actions place-member-actions--guest">
        <Star size={16} aria-hidden="true" />
        <span>{ratingLabel}</span>
        <p>{t('member.guest')}</p>
      </div>
    );
  }

  return (
    <div className="place-member-actions">
      <div className="place-member-actions__summary">
        <Star size={16} fill="currentColor" aria-hidden="true" />
        <span>{ratingLabel}</span>
      </div>
      <button
        type="button"
        className={favorite ? 'favorite-button is-active' : 'favorite-button'}
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void onToggleFavorite(place).finally(() => setBusy(false));
        }}
      >
        <Heart
          size={16}
          fill={favorite ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        {t(favorite ? 'member.removeFavoriteShort' : 'member.addFavorite')}
      </button>
      <form
        className="review-form"
        onSubmit={(event) => {
          event.preventDefault();
          setBusy(true);
          void onSaveReview(place, rating, comment).finally(() =>
            setBusy(false),
          );
        }}
      >
        <label>
          <span>{t('member.rating')}</span>
          <select
            value={rating}
            disabled={busy}
            onChange={(event) => setRating(Number(event.target.value))}
          >
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} / 5
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t('member.comment')}</span>
          <textarea
            value={comment}
            rows={3}
            maxLength={2000}
            disabled={busy}
            placeholder={t('member.placeholder')}
            onChange={(event) => setComment(event.target.value)}
          />
        </label>
        <div className="review-form__actions">
          <button type="submit" className="secondary-button" disabled={busy}>
            <Save size={15} aria-hidden="true" />
            {t(review ? 'member.updateReview' : 'member.addReview')}
          </button>
          {review && (
            <button
              type="button"
              className="danger-button"
              disabled={busy}
              onClick={() => {
                setBusy(true);
                void onDeleteReview(review.id)
                  .then((deleted) => {
                    if (deleted) {
                      setRating(5);
                      setComment('');
                    }
                  })
                  .finally(() => setBusy(false));
              }}
            >
              <Trash2 size={15} aria-hidden="true" />
              {t('member.delete')}
            </button>
          )}
        </div>
      </form>
      {actionError && (
        <p className="member-action-error" role="alert">
          {t('member.actionFailed')}
        </p>
      )}
    </div>
  );
}
