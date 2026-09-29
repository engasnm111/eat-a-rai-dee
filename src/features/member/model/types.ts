export interface RestaurantSnapshot {
  restaurantId: string;
  restaurantName: string;
  address: string | null;
  latitude: number;
  longitude: number;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export interface FavoriteRecord extends RestaurantSnapshot {
  createdAt: string;
}

export interface ReviewRecord extends RestaurantSnapshot {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface SpinHistoryRecord extends RestaurantSnapshot {
  id: number;
  selectedAt: string;
}

export interface MemberRecords {
  favorites: FavoriteRecord[];
  reviews: ReviewRecord[];
  spins: SpinHistoryRecord[];
}
