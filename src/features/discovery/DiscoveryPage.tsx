import {
  lazy,
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  MapPin,
  Navigation,
  SlidersHorizontal,
  UserRound,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Brand } from '../../components/ui/Brand';
import { LanguageSwitch } from '../../components/ui/LanguageSwitch';
import { MAP_CONFIG } from '../../config/map';
import { AuthControl } from '../auth/AuthControl';
import { useAuth } from '../auth/useAuth';
import { MemberPanel } from '../member/components/MemberPanel';
import { useMemberData } from '../member/hooks/useMemberData';
import type { RestaurantSnapshot } from '../member/model/types';
import { pickSpinWinner, rankSpinCandidates } from '../spin/model/free-spin';
import { ResultsPanel } from './components/ResultsPanel';
import { SearchDialog } from './components/SearchDialog';
import { SelectedPlace } from './components/SelectedPlace';
import { useDiscovery } from './hooks/useDiscovery';
import { addressFor } from './model/place-details';
import type { Coordinates, RestaurantWithDistance } from './model/types';

const MapCanvas = lazy(() =>
  import('./components/MapCanvas').then((module) => ({
    default: module.MapCanvas,
  })),
);

function snapshotFor(place: RestaurantWithDistance): RestaurantSnapshot {
  return {
    restaurantId: place.id,
    restaurantName: place.name,
    address: addressFor(place),
    latitude: place.coordinate.lat,
    longitude: place.coordinate.lon,
  };
}

function spinDelay(step: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 70 + step * 14);
  });
}

export function DiscoveryPage() {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const discovery = useDiscovery();
  const { updateOrigin } = discovery;
  const member = useMemberData(
    auth.user?.id ?? null,
    discovery.visibleRestaurants.map((place) => place.id),
  );
  const [dialogOpen, setDialogOpen] = useState(true);
  const [memberOpen, setMemberOpen] = useState(false);
  const [draft, setDraft] = useState(discovery.criteria);
  const [picking, setPicking] = useState(false);
  const [locating, setLocating] = useState(false);
  const [spinRunning, setSpinRunning] = useState(false);
  const [spinPreview, setSpinPreview] = useState<string | null>(null);
  const locationAttemptRef = useRef(0);
  const spinAttemptRef = useRef(0);
  const [locationErrorKey, setLocationErrorKey] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const spinContextKey = discovery.visibleRestaurants
    .map((place) => `${place.id}:${place.distanceMeters}`)
    .join('\n');

  useLayoutEffect(() => {
    spinAttemptRef.current += 1;
  }, [spinContextKey]);

  const selectedPlace =
    discovery.visibleRestaurants.find((place) => place.id === selectedId) ??
    null;
  const radiusLabel = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 1,
  }).format(discovery.criteria.radiusMeters / 1000);
  const openSearch = () => {
    setDraft(discovery.criteria);
    setLocationErrorKey(null);
    setPicking(false);
    setDialogOpen(true);
  };

  const submitSearch = () => {
    setDialogOpen(false);
    setSelectedId(null);
    setSpinPreview(null);
    void discovery.search(draft);
  };

  const runSpin = async () => {
    if (spinRunning) return;
    const candidates = rankSpinCandidates(
      discovery.visibleRestaurants,
      member.ratings,
    );
    if (candidates.length === 0) return;

    const attempt = ++spinAttemptRef.current;
    setSpinRunning(true);
    try {
      for (let step = 0; step < 12; step += 1) {
        if (attempt !== spinAttemptRef.current) return;
        const preview = pickSpinWinner(candidates);
        if (preview) setSpinPreview(preview.name);
        await spinDelay(step);
      }

      if (attempt !== spinAttemptRef.current) return;
      const winner = pickSpinWinner(candidates);
      if (!winner) return;
      setSpinPreview(winner.name);
      setSelectedId(winner.id);
      if (auth.user) await member.recordSpin(snapshotFor(winner));
    } finally {
      setSpinRunning(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorKey('search.locationUnavailable');
      return;
    }

    setLocating(true);
    setLocationErrorKey(null);
    const attempt = ++locationAttemptRef.current;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (attempt !== locationAttemptRef.current) return;
        updateOrigin(
          { lat: position.coords.latitude, lon: position.coords.longitude },
          'device',
        );
        setSelectedId(null);
        setLocating(false);
      },
      () => {
        if (attempt !== locationAttemptRef.current) return;
        setLocationErrorKey('search.locationDenied');
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
    );
  };

  const pickOnMap = useCallback(
    (point: Coordinates) => {
      updateOrigin(point, 'picked');
      setSelectedId(null);
      setSpinPreview(null);
      setPicking(false);
      setDialogOpen(true);
      setLocationErrorKey(null);
    },
    [updateOrigin],
  );

  const stopLocating = () => {
    locationAttemptRef.current += 1;
    setLocating(false);
  };

  return (
    <div className="app-shell" id="top">
      <header className="site-header">
        <Brand />
        <div className="site-header__actions">
          <span className="site-header__current">
            <MapPin size={16} aria-hidden="true" />
            {t('header.discover')}
          </span>
          <LanguageSwitch />
          <AuthControl auth={auth} placement="header" />
          <button
            type="button"
            className="member-nav-button"
            onClick={() => setMemberOpen(true)}
          >
            <UserRound size={16} aria-hidden="true" />
            <span>{t('header.memberData')}</span>
          </button>
          <button
            type="button"
            className="header-search-button"
            aria-label={t('header.editSearch')}
            onClick={openSearch}
          >
            <SlidersHorizontal size={17} aria-hidden="true" />
            <span>{t('header.editSearch')}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__copy">
            <span className="hero__spark" aria-hidden="true">
              <UtensilsCrossed size={22} />
            </span>
            <h1 id="hero-title">{t('hero.title')}</h1>
            <p>{t('hero.description')}</p>
          </div>
          <div className="hero__action">
            <button
              type="button"
              className="primary-button hero__button"
              onClick={openSearch}
            >
              {t('hero.start')}
              <ArrowRight size={19} aria-hidden="true" />
            </button>
            <span className="hero__radius">
              <span />
              {t('hero.radius', { distance: `${radiusLabel} km` })}
            </span>
          </div>
        </section>

        <section className="workspace" aria-label={t('header.discover')}>
          <ResultsPanel
            status={discovery.status}
            errorCode={discovery.errorCode}
            restaurants={discovery.visibleRestaurants}
            criteria={discovery.criteria}
            ratings={member.ratings}
            ratingsFailed={member.ratingsStatus === 'error'}
            selectedId={selectedId}
            spinRunning={spinRunning}
            spinPreview={spinPreview}
            userLoggedIn={Boolean(auth.user)}
            onSpin={() => void runSpin()}
            onSelect={setSelectedId}
            onEdit={openSearch}
            onRetry={() => void discovery.search(discovery.criteria)}
            onToggleQuickFilter={discovery.toggleQuickFilter}
            onClearFilters={discovery.clearFilters}
          />

          <div className="map-shell">
            <Suspense
              fallback={
                <div className="map-loading" role="status">
                  {t('map.loading')}
                </div>
              }
            >
              <MapCanvas
                origin={discovery.origin}
                radiusMeters={discovery.criteria.radiusMeters}
                restaurants={
                  discovery.status === 'success'
                    ? discovery.visibleRestaurants
                    : []
                }
                selectedId={selectedId}
                picking={picking}
                onSelect={setSelectedId}
                onPick={pickOnMap}
              />
            </Suspense>
            <div className="map-shell__label">
              <Navigation size={16} aria-hidden="true" />
              {t('map.title')}
            </div>
            {picking && (
              <div className="pick-banner" role="status">
                <MapPin size={20} aria-hidden="true" />
                <strong>{t('map.pickPrompt')}</strong>
                <button
                  type="button"
                  onClick={() => {
                    setPicking(false);
                    setDialogOpen(true);
                  }}
                >
                  <X size={16} aria-hidden="true" />
                  {t('map.cancelPick')}
                </button>
              </div>
            )}
            {selectedPlace && !picking && (
              <SelectedPlace
                key={selectedPlace.id}
                place={selectedPlace}
                travelMode={discovery.criteria.travelMode}
                origin={
                  discovery.locationKind === 'sample'
                    ? undefined
                    : discovery.origin
                }
                user={auth.user}
                rating={member.ratings[selectedPlace.id]}
                favorite={member.favoriteIds.has(selectedPlace.id)}
                review={member.reviewsByRestaurant.get(selectedPlace.id)}
                actionError={member.actionError}
                onToggleFavorite={member.toggleFavorite}
                onSaveReview={member.saveReview}
                onDeleteReview={member.deleteReview}
                onClose={() => setSelectedId(null)}
              />
            )}
            {discovery.visibleRestaurants.length > MAP_CONFIG.maxMapPins &&
              !selectedPlace && (
                <div className="map-shell__pin-note">
                  {t('map.pinsLimit', { count: MAP_CONFIG.maxMapPins })}
                </div>
              )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>{t('footer.source')}</span>
        <span>{t('footer.credit')}</span>
      </footer>

      <MemberPanel
        open={memberOpen}
        user={auth.user}
        status={member.recordsStatus}
        records={member.records}
        actionError={member.actionError}
        onClose={() => setMemberOpen(false)}
        onRemoveFavorite={async (place) => {
          await member.toggleFavorite(place);
        }}
        onSaveReview={async (place, rating, comment) => {
          await member.saveReview(place, rating, comment);
        }}
        onDeleteReview={async (reviewId) => {
          await member.deleteReview(reviewId);
        }}
      />

      {dialogOpen && (
        <SearchDialog
          auth={auth}
          criteria={draft}
          locationKind={discovery.locationKind}
          locating={locating}
          locationError={locationErrorKey ? t(locationErrorKey) : null}
          onChange={setDraft}
          onSearch={submitSearch}
          onClose={() => {
            stopLocating();
            setDialogOpen(false);
          }}
          onUseLocation={useMyLocation}
          onPickOnMap={() => {
            stopLocating();
            setDialogOpen(false);
            setPicking(true);
          }}
        />
      )}
    </div>
  );
}
