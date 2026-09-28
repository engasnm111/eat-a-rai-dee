export interface Coordinates {
  lat: number;
  lon: number;
}

export type RestaurantCategory =
  'restaurant' | 'cafe' | 'fast_food' | 'food_court' | 'dessert' | 'bakery';

export type QuickFilterId =
  | 'thai'
  | 'noodles'
  | 'dessert'
  | 'coffee'
  | 'fastFood'
  | 'barbecue'
  | 'buffet'
  | 'shabuSuki'
  | 'crispyPork'
  | 'mookata'
  | 'mala'
  | 'seafood'
  | 'sushi'
  | 'japanese'
  | 'korean'
  | 'pizza'
  | 'burger'
  | 'friedChicken'
  | 'chickenRice'
  | 'steak'
  | 'somTam'
  | 'dimSum'
  | 'bubbleTea';

export interface Restaurant {
  id: string;
  name: string;
  coordinate: Coordinates;
  category: RestaurantCategory;
  tags: Record<string, string>;
}

export interface RestaurantWithDistance extends Restaurant {
  distanceMeters: number;
}

export const MIN_SEARCH_RADIUS_METERS = 300;
export const MAX_SEARCH_RADIUS_METERS = 10_000;
export const SEARCH_RADIUS_STEP_METERS = 100;

export type TravelMode = 'driving' | 'two-wheeler' | 'bicycling' | 'walking';

export interface SearchCriteria {
  keyword: string;
  radiusMeters: number;
  travelMode: TravelMode;
  quickFilters: QuickFilterId[];
  openNow: boolean;
  vegetarian: boolean;
  wheelchair: boolean;
  takeaway: boolean;
  delivery: boolean;
}

export const DEFAULT_CRITERIA: SearchCriteria = {
  keyword: '',
  radiusMeters: 5000,
  travelMode: 'driving',
  quickFilters: [],
  openNow: false,
  vegetarian: false,
  wheelchair: false,
  takeaway: false,
  delivery: false,
};
