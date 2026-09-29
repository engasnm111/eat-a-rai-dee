import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  addFavorite,
  loadMemberRecords,
  loadRatingSummaries,
  recordSpin,
  removeFavorite,
  removeReview,
  saveReview,
} from '../data/member-service';
import type {
  MemberRecords,
  RatingSummary,
  RestaurantSnapshot,
} from '../model/types';

const EMPTY_RECORDS: MemberRecords = {
  favorites: [],
  reviews: [],
  spins: [],
};

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export function useMemberData(userId: string | null, restaurantIds: string[]) {
  const [ratings, setRatings] = useState<Record<string, RatingSummary>>({});
  const [ratingsStatus, setRatingsStatus] = useState<LoadStatus>('idle');
  const [ratingsSourceKey, setRatingsSourceKey] = useState('');
  const [records, setRecords] = useState<MemberRecords>(EMPTY_RECORDS);
  const [recordsStatus, setRecordsStatus] = useState<LoadStatus>('idle');
  const [recordsOwnerId, setRecordsOwnerId] = useState<string | null>(null);
  const [actionError, setActionError] = useState(false);
  const idsKey = useMemo(
    () => [...new Set(restaurantIds)].sort().join('\n'),
    [restaurantIds],
  );
  const currentUserIdRef = useRef(userId);
  const currentIdsKeyRef = useRef(idsKey);
  const ratingsRequestRef = useRef(0);
  const recordsRequestRef = useRef(0);

  useLayoutEffect(() => {
    currentUserIdRef.current = userId;
    currentIdsKeyRef.current = idsKey;
  }, [idsKey, userId]);

  const refreshRatings = useCallback(async () => {
    const targetKey = idsKey;
    const requestId = ++ratingsRequestRef.current;
    const ids = targetKey ? targetKey.split('\n') : [];
    if (ids.length === 0) {
      if (requestId !== ratingsRequestRef.current) return;
      setRatings({});
      setRatingsSourceKey(targetKey);
      setRatingsStatus('success');
      return;
    }

    setRatingsStatus('loading');
    try {
      const nextRatings = await loadRatingSummaries(ids);
      if (
        requestId !== ratingsRequestRef.current ||
        currentIdsKeyRef.current !== targetKey
      ) {
        return;
      }
      setRatings(nextRatings);
      setRatingsSourceKey(targetKey);
      setRatingsStatus('success');
    } catch {
      if (
        requestId !== ratingsRequestRef.current ||
        currentIdsKeyRef.current !== targetKey
      ) {
        return;
      }
      setRatings({});
      setRatingsSourceKey(targetKey);
      setRatingsStatus('error');
    }
  }, [idsKey]);

  const refreshRecords = useCallback(async () => {
    const targetUserId = userId;
    const requestId = ++recordsRequestRef.current;
    if (!targetUserId) {
      if (requestId !== recordsRequestRef.current) return;
      setRecords(EMPTY_RECORDS);
      setRecordsOwnerId(null);
      setRecordsStatus('idle');
      return;
    }

    setRecordsStatus('loading');
    try {
      const nextRecords = await loadMemberRecords(targetUserId);
      if (
        requestId !== recordsRequestRef.current ||
        currentUserIdRef.current !== targetUserId
      ) {
        return;
      }
      setRecords(nextRecords);
      setRecordsOwnerId(targetUserId);
      setRecordsStatus('success');
    } catch {
      if (
        requestId !== recordsRequestRef.current ||
        currentUserIdRef.current !== targetUserId
      ) {
        return;
      }
      setRecords(EMPTY_RECORDS);
      setRecordsOwnerId(targetUserId);
      setRecordsStatus('error');
    }
  }, [userId]);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      void refreshRatings();
    });
    return () => {
      active = false;
      ratingsRequestRef.current += 1;
    };
  }, [refreshRatings]);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      setActionError(false);
      void refreshRecords();
    });
    return () => {
      active = false;
      recordsRequestRef.current += 1;
    };
  }, [refreshRecords]);

  const runAction = useCallback(
    async (
      expectedUserId: string,
      action: () => Promise<void>,
      refreshRatingData = false,
    ) => {
      if (currentUserIdRef.current !== expectedUserId) return false;
      setActionError(false);
      try {
        await action();
        if (currentUserIdRef.current !== expectedUserId) return false;
        await refreshRecords();
        if (currentUserIdRef.current !== expectedUserId) return false;
        if (refreshRatingData) await refreshRatings();
        return currentUserIdRef.current === expectedUserId;
      } catch {
        if (currentUserIdRef.current === expectedUserId) setActionError(true);
        return false;
      }
    },
    [refreshRatings, refreshRecords],
  );

  const visibleRatings = ratingsSourceKey === idsKey ? ratings : {};
  let visibleRatingsStatus: LoadStatus = ratingsStatus;
  if (ratingsSourceKey !== idsKey) {
    visibleRatingsStatus = idsKey.length > 0 ? 'loading' : 'success';
  }

  const visibleRecords = recordsOwnerId === userId ? records : EMPTY_RECORDS;
  let visibleRecordsStatus: LoadStatus = 'idle';
  if (userId) {
    visibleRecordsStatus =
      recordsOwnerId === userId ? recordsStatus : 'loading';
  }
  const favoriteIds = useMemo(
    () => new Set(visibleRecords.favorites.map((item) => item.restaurantId)),
    [visibleRecords.favorites],
  );
  const reviewsByRestaurant = useMemo(
    () =>
      new Map(
        visibleRecords.reviews.map((review) => [review.restaurantId, review]),
      ),
    [visibleRecords.reviews],
  );

  return {
    ratings: visibleRatings,
    ratingsStatus: visibleRatingsStatus,
    records: visibleRecords,
    recordsStatus: visibleRecordsStatus,
    actionError,
    favoriteIds,
    reviewsByRestaurant,
    refreshRecords,
    toggleFavorite: async (place: RestaurantSnapshot) => {
      if (!userId) return false;
      return runAction(userId, () =>
        favoriteIds.has(place.restaurantId)
          ? removeFavorite(userId, place.restaurantId)
          : addFavorite(userId, place),
      );
    },
    saveReview: async (
      place: RestaurantSnapshot,
      rating: number,
      comment: string,
    ) => {
      if (!userId) return false;
      return runAction(
        userId,
        () => saveReview(userId, place, rating, comment),
        true,
      );
    },
    deleteReview: async (reviewId: number) => {
      if (!userId) return false;
      return runAction(userId, () => removeReview(userId, reviewId), true);
    },
    recordSpin: async (place: RestaurantSnapshot) => {
      if (!userId) return false;
      return runAction(userId, () => recordSpin(userId, place));
    },
  };
}

export type MemberDataState = ReturnType<typeof useMemberData>;
