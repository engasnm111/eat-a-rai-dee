import { useState } from 'react';
import {
  ChefHat,
  ChevronDown,
  Coffee,
  CookingPot,
  CupSoda,
  Drumstick,
  Fish,
  Flame,
  IceCreamBowl,
  Pizza,
  Salad,
  Sandwich,
  Search,
  Soup,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  FEATURED_QUICK_FILTER_IDS,
  QUICK_FILTER_CATALOG,
  QUICK_FILTER_IDS,
} from '../model/quick-filter-catalog';
import type { QuickFilterId } from '../model/types';

const icons: Record<QuickFilterId, LucideIcon> = {
  thai: CookingPot,
  noodles: Soup,
  dessert: IceCreamBowl,
  coffee: Coffee,
  fastFood: UtensilsCrossed,
  barbecue: Flame,
  buffet: ChefHat,
  shabuSuki: Soup,
  crispyPork: CookingPot,
  mookata: Flame,
  mala: Flame,
  seafood: Fish,
  sushi: Fish,
  japanese: Soup,
  korean: CookingPot,
  pizza: Pizza,
  burger: Sandwich,
  friedChicken: Drumstick,
  chickenRice: CookingPot,
  steak: UtensilsCrossed,
  somTam: Salad,
  dimSum: CookingPot,
  bubbleTea: CupSoda,
};

interface QuickFiltersProps {
  selected: QuickFilterId[];
  onToggle: (filter: QuickFilterId) => void;
  compact?: boolean;
}

export function QuickFilters({
  selected,
  onToggle,
  compact = false,
}: QuickFiltersProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const search = query.trim().toLocaleLowerCase();
  const visible = QUICK_FILTER_IDS.filter((filter) => {
    if (compact)
      return QUICK_FILTER_CATALOG[filter].featured || selected.includes(filter);
    if (!search)
      return (
        expanded ||
        QUICK_FILTER_CATALOG[filter].featured ||
        selected.includes(filter)
      );
    const names = [
      t(`quick.${filter}`, { lng: 'th' }),
      t(`quick.${filter}`, { lng: 'en' }),
      ...(QUICK_FILTER_CATALOG[filter].aliases ?? []),
    ];
    return names.some((name) => name.toLocaleLowerCase().includes(search));
  });

  const choices = (
    <div
      className={
        compact ? 'quick-filters quick-filters--compact' : 'quick-filters'
      }
    >
      {visible.map((filter) => {
        const Icon = icons[filter];
        const active = selected.includes(filter);
        return (
          <button
            key={filter}
            type="button"
            className={active ? 'quick-filter is-active' : 'quick-filter'}
            aria-pressed={active}
            onClick={() => onToggle(filter)}
          >
            <Icon size={17} strokeWidth={2} aria-hidden="true" />
            <span>{t(`quick.${filter}`)}</span>
          </button>
        );
      })}
    </div>
  );

  if (compact) return choices;

  return (
    <div className="quick-filter-picker">
      <div className="quick-filter-picker__search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={query}
          maxLength={50}
          autoComplete="off"
          aria-label={t('search.categorySearch')}
          placeholder={t('search.categorySearch')}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.preventDefault();
          }}
        />
      </div>
      {choices}
      {visible.length === 0 && (
        <p className="quick-filter-picker__empty">
          {t('search.categoryEmpty')}
        </p>
      )}
      {!search && (
        <button
          className="quick-filter-picker__toggle"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <span>
            {expanded
              ? t('search.showFeatured')
              : t('search.showAllCategories', {
                  count:
                    QUICK_FILTER_IDS.length - FEATURED_QUICK_FILTER_IDS.length,
                })}
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
