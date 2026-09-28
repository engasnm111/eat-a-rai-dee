import { useEffect, useRef } from 'react';
import {
  ArrowRight,
  ChevronDown,
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitch } from '../../../components/ui/LanguageSwitch';
import { AuthControl } from '../../auth/AuthControl';
import type { AuthState } from '../../auth/useAuth';
import type { LocationKind } from '../hooks/useDiscovery';
import {
  MAX_SEARCH_RADIUS_METERS,
  MIN_SEARCH_RADIUS_METERS,
  SEARCH_RADIUS_STEP_METERS,
  type QuickFilterId,
  type SearchCriteria,
  type TravelMode,
} from '../model/types';
import { QuickFilters } from './QuickFilters';

type AdvancedKey =
  'openNow' | 'vegetarian' | 'wheelchair' | 'takeaway' | 'delivery';
const advancedKeys: AdvancedKey[] = [
  'openNow',
  'vegetarian',
  'wheelchair',
  'takeaway',
  'delivery',
];
const travelModes: TravelMode[] = [
  'driving',
  'two-wheeler',
  'bicycling',
  'walking',
];

interface SearchDialogProps {
  auth: AuthState;
  criteria: SearchCriteria;
  locationKind: LocationKind;
  locating: boolean;
  locationError: string | null;
  onChange: (criteria: SearchCriteria) => void;
  onSearch: () => void;
  onClose: () => void;
  onUseLocation: () => void;
  onPickOnMap: () => void;
}

export function SearchDialog({
  auth,
  criteria,
  locationKind,
  locating,
  locationError,
  onChange,
  onSearch,
  onClose,
  onUseLocation,
  onPickOnMap,
}: SearchDialogProps) {
  const { t, i18n } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const keywordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    keywordRef.current?.focus();
    return () => dialog?.close();
  }, []);

  const toggleFilter = (filter: QuickFilterId) => {
    onChange({
      ...criteria,
      quickFilters: criteria.quickFilters.includes(filter)
        ? criteria.quickFilters.filter((item) => item !== filter)
        : [...criteria.quickFilters, filter],
    });
  };

  const radiusKilometers = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 1,
  }).format(criteria.radiusMeters / 1000);

  const locationLabel = {
    sample: t('search.sampleLocation'),
    device: t('search.myLocation'),
    picked: t('search.pickedLocation'),
  }[locationKind];

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      aria-labelledby="search-dialog-title"
      onCancel={onClose}
    >
      <div className="search-dialog__art" aria-hidden="true">
        <div className="search-dialog__art-orbit search-dialog__art-orbit--one" />
        <div className="search-dialog__art-orbit search-dialog__art-orbit--two" />
        <span className="search-dialog__art-pin">
          <MapPin size={32} strokeWidth={2.3} />
        </span>
        <span className="search-dialog__art-bowl">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" />
        </span>
        <span className="search-dialog__art-star">
          <Star size={28} fill="currentColor" />
        </span>
      </div>

      <div className="search-dialog__content">
        <div className="search-dialog__auth">
          <AuthControl auth={auth} placement="dialog" />
        </div>
        <div className="search-dialog__language">
          <LanguageSwitch />
        </div>
        <button
          type="button"
          className="icon-button search-dialog__close"
          aria-label={t('search.close')}
          onClick={onClose}
        >
          <X size={21} aria-hidden="true" />
        </button>
        <div className="search-dialog__intro">
          <span className="search-dialog__intro-icon">
            <Search size={22} aria-hidden="true" />
          </span>
          <h2 id="search-dialog-title">{t('search.heading')}</h2>
          <p>{t('search.description')}</p>
        </div>

        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSearch();
          }}
        >
          <label className="field-label" htmlFor="keyword">
            {t('search.keyword')}
          </label>
          <div className="search-input">
            <Search size={19} aria-hidden="true" />
            <input
              ref={keywordRef}
              id="keyword"
              type="search"
              maxLength={80}
              autoComplete="off"
              value={criteria.keyword}
              placeholder={t('search.keywordPlaceholder')}
              onChange={(event) =>
                onChange({ ...criteria, keyword: event.target.value })
              }
            />
          </div>

          <div className="section-label">
            <span>{t('search.quickHeading')}</span>
            <small>{t('search.quickHint')}</small>
          </div>
          <QuickFilters
            selected={criteria.quickFilters}
            onToggle={toggleFilter}
          />

          <fieldset className="travel-modes">
            <legend className="field-label">
              {t('search.travelModeHeading')}
            </legend>
            <div className="travel-modes__options">
              {travelModes.map((mode) => (
                <label className="travel-mode-option" key={mode}>
                  <input
                    type="radio"
                    name="travel-mode"
                    value={mode}
                    checked={criteria.travelMode === mode}
                    onChange={() => onChange({ ...criteria, travelMode: mode })}
                  />
                  <span>{t(`search.travelMode.${mode}`)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="radius-heading">
            <label className="field-label" htmlFor="radius">
              {t('search.radiusHeading')}
            </label>
            <strong>
              {t('search.radiusUnit', { distance: radiusKilometers })}
            </strong>
          </div>
          <input
            className="radius-slider"
            id="radius"
            type="range"
            min={MIN_SEARCH_RADIUS_METERS}
            max={MAX_SEARCH_RADIUS_METERS}
            step={SEARCH_RADIUS_STEP_METERS}
            value={criteria.radiusMeters}
            aria-describedby="radius-hint"
            style={
              {
                '--range-progress': `${((criteria.radiusMeters - MIN_SEARCH_RADIUS_METERS) / (MAX_SEARCH_RADIUS_METERS - MIN_SEARCH_RADIUS_METERS)) * 100}%`,
              } as React.CSSProperties
            }
            onChange={(event) =>
              onChange({
                ...criteria,
                radiusMeters: Number(event.target.value),
              })
            }
          />
          <div className="radius-scale" aria-hidden="true">
            <span>300 m</span>
            <span>10 km</span>
          </div>
          <p className="radius-hint" id="radius-hint">
            {t('search.radiusHint')}
          </p>

          <div className="section-label section-label--location">
            <span>{t('search.locationHeading')}</span>
          </div>
          <div className="location-card">
            <MapPin size={18} aria-hidden="true" />
            <span>{locationLabel}</span>
          </div>
          <div className="location-actions">
            <button
              type="button"
              className="text-button"
              disabled={locating}
              onClick={onUseLocation}
            >
              <LocateFixed size={17} aria-hidden="true" />
              {locating ? t('search.locating') : t('search.useMyLocation')}
            </button>
            <button type="button" className="text-button" onClick={onPickOnMap}>
              <MapPin size={17} aria-hidden="true" />
              {t('search.pickOnMap')}
            </button>
          </div>
          {locationError && (
            <p className="form-error" role="alert">
              {locationError}
            </p>
          )}

          <details className="advanced-filters">
            <summary>
              <SlidersHorizontal size={17} aria-hidden="true" />
              {t('search.advanced')}
              <ChevronDown size={17} aria-hidden="true" />
            </summary>
            <div className="advanced-filters__body">
              <div className="advanced-filters__grid">
                {advancedKeys.map((key) => (
                  <label key={key} className="check-option">
                    <input
                      type="checkbox"
                      checked={criteria[key]}
                      onChange={(event) =>
                        onChange({ ...criteria, [key]: event.target.checked })
                      }
                    />
                    <span>{t(`advanced.${key}`)}</span>
                  </label>
                ))}
              </div>
              <p className="filter-note">{t('advanced.note')}</p>
              <div className="rating-row">
                <span>
                  <Star size={17} aria-hidden="true" />
                  {t('search.ratings')}
                </span>
                <select disabled aria-label={t('search.ratings')}>
                  <option>{t('search.ratingAny')}</option>
                </select>
              </div>
              <p className="filter-note">{t('search.ratingsUnavailable')}</p>
            </div>
          </details>

          <button
            className="primary-button search-form__submit"
            type="submit"
            disabled={locating}
          >
            {t('search.submit')}
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </form>
      </div>
    </dialog>
  );
}
