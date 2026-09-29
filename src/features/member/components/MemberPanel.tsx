import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Save, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { User } from '@supabase/supabase-js';
import type {
  MemberRecords,
  RestaurantSnapshot,
  ReviewRecord,
} from '../model/types';

type RecordsStatus = 'idle' | 'loading' | 'success' | 'error';

interface MemberPanelProps {
  open: boolean;
  user: User | null;
  status: RecordsStatus;
  records: MemberRecords;
  actionError: boolean;
  onClose: () => void;
  onRemoveFavorite: (place: RestaurantSnapshot) => Promise<void>;
  onSaveReview: (
    place: RestaurantSnapshot,
    rating: number,
    comment: string,
  ) => Promise<void>;
  onDeleteReview: (reviewId: number) => Promise<void>;
}

function snapshot(record: RestaurantSnapshot): RestaurantSnapshot {
  return {
    restaurantId: record.restaurantId,
    restaurantName: record.restaurantName,
    address: record.address,
    latitude: record.latitude,
    longitude: record.longitude,
  };
}

function ReviewEditor({
  review,
  onSave,
  onDelete,
}: {
  review: ReviewRecord;
  onSave: (rating: number, comment: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [busy, setBusy] = useState(false);

  return (
    <div className="member-review-editor">
      <select
        value={rating}
        aria-label={t('member.rating')}
        onChange={(event) => setRating(Number(event.target.value))}
      >
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value} / 5
          </option>
        ))}
      </select>
      <textarea
        value={comment}
        maxLength={2000}
        rows={2}
        aria-label={t('member.comment')}
        onChange={(event) => setComment(event.target.value)}
      />
      <div className="member-table__actions">
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void onSave(rating, comment).finally(() => setBusy(false));
          }}
        >
          <Save size={15} aria-hidden="true" />
          {t('member.save')}
        </button>
        <button
          type="button"
          className="danger-button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void onDelete().finally(() => setBusy(false));
          }}
        >
          <Trash2 size={15} aria-hidden="true" />
          {t('member.delete')}
        </button>
      </div>
    </div>
  );
}

export function MemberPanel({
  open,
  user,
  status,
  records,
  actionError,
  onClose,
  onRemoveFavorite,
  onSaveReview,
  onDeleteReview,
}: MemberPanelProps) {
  const { t, i18n } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [i18n.language],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="member-dialog"
      aria-labelledby="member-dialog-title"
      onCancel={onClose}
      onClose={onClose}
    >
      <div className="member-dialog__header">
        <div>
          <h2 id="member-dialog-title">{t('member.title')}</h2>
          {user?.email && <p>{user.email}</p>}
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label={t('member.close')}
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {!user && <div className="member-state">{t('member.signedOut')}</div>}
      {user && status === 'loading' && (
        <div className="member-state" role="status">
          {t('member.loading')}
        </div>
      )}
      {user && status === 'error' && (
        <div className="member-state" role="alert">
          {t('member.loadFailed')}
        </div>
      )}
      {user && status === 'success' && (
        <div className="member-sections">
          {actionError && (
            <p className="member-action-error" role="alert">
              {t('member.actionFailed')}
            </p>
          )}

          <section>
            <h3>
              <Heart size={18} aria-hidden="true" /> {t('member.favorites')}
            </h3>
            <div className="member-table-wrap">
              <table className="member-table">
                <thead>
                  <tr>
                    <th>{t('member.date')}</th>
                    <th>{t('member.restaurant')}</th>
                    <th>{t('member.address')}</th>
                    <th>{t('member.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.favorites.length === 0 ? (
                    <tr>
                      <td colSpan={4}>{t('member.empty')}</td>
                    </tr>
                  ) : (
                    records.favorites.map((favorite) => (
                      <tr key={favorite.restaurantId}>
                        <td>
                          {formatter.format(new Date(favorite.createdAt))}
                        </td>
                        <td>{favorite.restaurantName}</td>
                        <td>{favorite.address ?? t('member.noAddress')}</td>
                        <td>
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() =>
                              void onRemoveFavorite(snapshot(favorite))
                            }
                          >
                            <Trash2 size={15} aria-hidden="true" />{' '}
                            {t('member.removeFavorite')}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3>{t('member.reviews')}</h3>
            <div className="member-table-wrap">
              <table className="member-table member-table--reviews">
                <thead>
                  <tr>
                    <th>{t('member.date')}</th>
                    <th>{t('member.restaurant')}</th>
                    <th>{t('member.address')}</th>
                    <th>{t('member.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.reviews.length === 0 ? (
                    <tr>
                      <td colSpan={4}>{t('member.empty')}</td>
                    </tr>
                  ) : (
                    records.reviews.map((review) => (
                      <tr key={review.id}>
                        <td>{formatter.format(new Date(review.updatedAt))}</td>
                        <td>{review.restaurantName}</td>
                        <td>{review.address ?? t('member.noAddress')}</td>
                        <td>
                          <ReviewEditor
                            review={review}
                            onSave={(rating, comment) =>
                              onSaveReview(snapshot(review), rating, comment)
                            }
                            onDelete={() => onDeleteReview(review.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3>{t('member.spins')}</h3>
            <div className="member-table-wrap">
              <table className="member-table">
                <thead>
                  <tr>
                    <th>{t('member.date')}</th>
                    <th>{t('member.restaurant')}</th>
                    <th>{t('member.address')}</th>
                  </tr>
                </thead>
                <tbody>
                  {records.spins.length === 0 ? (
                    <tr>
                      <td colSpan={3}>{t('member.empty')}</td>
                    </tr>
                  ) : (
                    records.spins.map((item) => (
                      <tr key={item.id}>
                        <td>{formatter.format(new Date(item.selectedAt))}</td>
                        <td>{item.restaurantName}</td>
                        <td>{item.address ?? t('member.noAddress')}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </dialog>
  );
}
