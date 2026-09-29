import { supabase } from '../../../lib/supabase';
import type {
  FavoriteRecord,
  MemberRecords,
  RatingSummary,
  RestaurantSnapshot,
  ReviewRecord,
  SpinHistoryRecord,
} from '../model/types';

const RATING_CHUNK_SIZE = 100;

interface FavoriteRow {
  restaurant_id: string;
  restaurant_name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  created_at: string;
}

interface ReviewRow extends FavoriteRow {
  id: number;
  rating: number;
  comment: string;
  updated_at: string;
}

interface SpinRow {
  id: number;
  restaurant_id: string;
  restaurant_name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  selected_at: string;
}

interface RatingRow {
  restaurant_id: string;
  rating_average: number | string;
  rating_count: number;
}

function client() {
  if (!supabase) throw new Error('Supabase is not configured');
  return supabase;
}

function snapshotFromRow(row: FavoriteRow): RestaurantSnapshot {
  return {
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
  };
}

function favoriteFromRow(row: FavoriteRow): FavoriteRecord {
  return { ...snapshotFromRow(row), createdAt: row.created_at };
}

function reviewFromRow(row: ReviewRow): ReviewRecord {
  return {
    ...snapshotFromRow(row),
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function spinFromRow(row: SpinRow): SpinHistoryRecord {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    restaurantName: row.restaurant_name,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    selectedAt: row.selected_at,
  };
}

function snapshotPayload(userId: string, place: RestaurantSnapshot) {
  return {
    user_id: userId,
    restaurant_id: place.restaurantId,
    restaurant_name: place.restaurantName,
    address: place.address,
    latitude: place.latitude,
    longitude: place.longitude,
  };
}

export async function loadRatingSummaries(
  restaurantIds: string[],
): Promise<Record<string, RatingSummary>> {
  if (!supabase || restaurantIds.length === 0) return {};

  const ids = [...new Set(restaurantIds)];
  const ratings: Record<string, RatingSummary> = {};

  for (let index = 0; index < ids.length; index += RATING_CHUNK_SIZE) {
    const chunk = ids.slice(index, index + RATING_CHUNK_SIZE);
    const { data, error } = await supabase
      .from('restaurant_rating_summary')
      .select('restaurant_id,rating_average,rating_count')
      .in('restaurant_id', chunk);
    if (error) throw error;

    for (const row of (data ?? []) as RatingRow[]) {
      ratings[row.restaurant_id] = {
        average: Number(row.rating_average),
        count: row.rating_count,
      };
    }
  }

  return ratings;
}

export async function loadMemberRecords(
  userId: string,
): Promise<MemberRecords> {
  const database = client();
  const [favoritesResult, reviewsResult, spinsResult] = await Promise.all([
    database
      .from('favorites')
      .select(
        'restaurant_id,restaurant_name,address,latitude,longitude,created_at',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    database
      .from('reviews')
      .select(
        'id,restaurant_id,restaurant_name,address,latitude,longitude,rating,comment,created_at,updated_at',
      )
      .eq('user_id', userId)
      .order('updated_at', { ascending: false }),
    database
      .from('spin_history')
      .select(
        'id,restaurant_id,restaurant_name,address,latitude,longitude,selected_at',
      )
      .eq('user_id', userId)
      .order('selected_at', { ascending: false }),
  ]);

  if (favoritesResult.error) throw favoritesResult.error;
  if (reviewsResult.error) throw reviewsResult.error;
  if (spinsResult.error) throw spinsResult.error;

  return {
    favorites: ((favoritesResult.data ?? []) as FavoriteRow[]).map(
      favoriteFromRow,
    ),
    reviews: ((reviewsResult.data ?? []) as ReviewRow[]).map(reviewFromRow),
    spins: ((spinsResult.data ?? []) as SpinRow[]).map(spinFromRow),
  };
}

export async function addFavorite(userId: string, place: RestaurantSnapshot) {
  const { error } = await client()
    .from('favorites')
    .upsert(snapshotPayload(userId, place), {
      onConflict: 'user_id,restaurant_id',
    });
  if (error) throw error;
}

export async function removeFavorite(userId: string, restaurantId: string) {
  const { error } = await client()
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('restaurant_id', restaurantId);
  if (error) throw error;
}

export async function saveReview(
  userId: string,
  place: RestaurantSnapshot,
  rating: number,
  comment: string,
) {
  const { error } = await client()
    .from('reviews')
    .upsert(
      {
        ...snapshotPayload(userId, place),
        rating,
        comment: comment.trim(),
      },
      { onConflict: 'user_id,restaurant_id' },
    );
  if (error) throw error;
}

export async function removeReview(userId: string, reviewId: number) {
  const { error } = await client()
    .from('reviews')
    .delete()
    .eq('user_id', userId)
    .eq('id', reviewId);
  if (error) throw error;
}

export async function recordSpin(userId: string, place: RestaurantSnapshot) {
  const { error } = await client()
    .from('spin_history')
    .insert(snapshotPayload(userId, place));
  if (error) throw error;
}
