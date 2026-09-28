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

export interface SearchCriteria {
  keyword: string;
  radiusMeters: number;
  quickFilters: QuickFilterId[];
  openNow: boolean;
  vegetarian: boolean;
  wheelchair: boolean;
  takeaway: boolean;
  delivery: boolean;
}

export const DEFAULT_CRITERIA: SearchCriteria = {
  keyword: '',
  radiusMeters: 1200,
  quickFilters: [],
  openNow: false,
  vegetarian: false,
  wheelchair: false,
  takeaway: false,
  delivery: false,
};
