import { useState } from 'react';
import {
  ArrowDown,
  Compass,
  RotateCcw,
  SlidersHorizontal,
  UtensilsCrossed,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DataErrorCode } from '../../../lib/http';
import type { SearchStatus } from '../hooks/useDiscovery';
import type {
  QuickFilterId,
  RestaurantWithDistance,
  SearchCriteria,
} from '../model/types';
import { QuickFilters } from './QuickFilters';
import { RestaurantCard } from './RestaurantCard';

const PAGE_SIZE = 24;

interface ResultsPanelProps {
  status: SearchStatus;
  errorCode: DataErrorCode | 'UNKNOWN' | null;
  restaurants: RestaurantWithDistance[];
  criteria: SearchCriteria;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onEdit: () => void;
  onRetry: () => void;
  onToggleQuickFilter: (filter: QuickFilterId) => void;
  onClearFilters: () => void;
}

export function ResultsPanel({
  status,
  errorCode,
  restaurants,
  criteria,
  selectedId,
  onSelect,
  onEdit,
  onRetry,
  onToggleQuickFilter,
  onClearFilters,
}: ResultsPanelProps) {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const shown = restaurants.slice(0, visibleCount);
  const anyFilter =
    criteria.keyword.trim().length > 0 ||
    criteria.quickFilters.length > 0 ||
    criteria.openNow ||
    criteria.vegetarian ||
    criteria.wheelchair ||
    criteria.takeaway ||
    criteria.delivery;

  return (
    <aside className="results-panel" aria-label={t('results.heading')}>
      <div className="results-panel__heading">
        <div>
          <h2>{t('results.heading')}</h2>
          <p>
            {status === 'success'
              ? t('results.count', { count: restaurants.length })
              : t('hero.description')}
          </p>
        </div>
        <button
          className="panel-filter-button"
          type="button"
          onClick={onEdit}
          aria-label={t('header.editSearch')}
        >
          <SlidersHorizontal size={19} aria-hidden="true" />
        </button>
      </div>

      <div className="results-panel__filters">
        <div className="results-panel__filters-heading">
          <strong>{t('search.quickHeading')}</strong>
          {anyFilter && (
            <button type="button" onClick={onClearFilters}>
              {t('results.clearFilters')}
            </button>
          )}
        </div>
        <QuickFilters
          selected={criteria.quickFilters}
          onToggle={onToggleQuickFilter}
          compact
        />
        <button
          type="button"
          className="quick-filter-picker__browse"
          onClick={onEdit}
        >
          {t('search.browseCategories')}
        </button>
      </div>

      {status === 'success' && restaurants.length > 0 && (
        <div className="results-panel__sort">
          <Compass size={15} aria-hidden="true" />
          {t('results.sort')}
        </div>
      )}

      <div className="results-panel__body" aria-live="polite">
        {status === 'idle' && (
          <div className="panel-state">
            <span className="panel-state__icon">
              <UtensilsCrossed size={27} aria-hidden="true" />
            </span>
            <p>{t('results.idle')}</p>
            <button type="button" className="secondary-button" onClick={onEdit}>
              {t('hero.start')}
            </button>
          </div>
        )}
        {status === 'loading' && (
          <div className="panel-state panel-state--loading" role="status">
            <span className="loading-spinner" aria-hidden="true" />
            <p>{t('results.loading')}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="panel-state" role="alert">
            <span className="panel-state__icon">
              <RotateCcw size={26} aria-hidden="true" />
            </span>
            <p>{t(`errors.${errorCode ?? 'UNKNOWN'}`)}</p>
            <button
              type="button"
              className="secondary-button"
              onClick={onRetry}
            >
              {t('errors.retry')}
            </button>
          </div>
        )}
        {status === 'success' && restaurants.length === 0 && (
          <div className="panel-state">
            <span className="panel-state__icon">
              <Compass size={27} aria-hidden="true" />
            </span>
            <p>{t('results.empty')}</p>
            <button type="button" className="secondary-button" onClick={onEdit}>
              {t('header.editSearch')}
            </button>
          </div>
        )}
        {status === 'success' && restaurants.length > 0 && (
          <>
            <ul className="restaurant-list">
              {shown.map((place) => (
                <RestaurantCard
                  key={place.id}
                  place={place}
                  selected={selectedId === place.id}
                  onSelect={onSelect}
                />
              ))}
            </ul>
            <div className="results-panel__pagination">
              <small>
                {t('results.visible', {
                  shown: shown.length,
                  total: restaurants.length,
                })}
              </small>
              {shown.length < restaurants.length && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  {t('results.more')}
                  <ArrowDown size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
