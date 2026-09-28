# eat a rai dee

A bilingual lunch finder built with React and TypeScript. Pick a location, search nearby food on an OpenStreetMap map, and open directions in Google Maps. This repository is also a small example of feature-based frontend architecture.

![eat a rai dee logo](public/logo.svg)

## Preview

![Restaurant results and map near the sample point in central Bangkok](docs/screenshots/home-desktop.png)

The screenshot uses the sample point in central Bangkok. Restaurant data comes from OpenStreetMap and may change.

![Search dialog with motorcycle directions, a 10 km search radius, and Google sign-in](docs/screenshots/search-travel-modes.png)

## Run locally

Requires Node.js 22.12 or newer and npm.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173/`. Restaurant search does not require an API key. Google sign-in uses the Supabase URL and publishable key in `.env.local`; see [Supabase setup](docs/supabase-setup.md).

| Command                | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| `npm test`             | Run focused filtering and API-boundary tests |
| `npm run lint`         | Check ESLint rules                           |
| `npm run typecheck`    | Check strict TypeScript types                |
| `npm run format:check` | Check Prettier formatting                    |
| `npm run build`        | Build the static site in `dist/`             |
| `npm run preview`      | Preview the production build                 |

## Features

- Search by restaurant name or dish; search and combine 23 food categories, including buffet, shabu/suki, and crispy pork.
- Choose your device location, pick a point on the map, or start from the sample point in central Bangkok. Set a 300 m to 10 km radius.
- Filter by opening hours, vegetarian options, wheelchair access, takeaway, and delivery when source tags support them.
- Explore results by straight-line distance, select map pins, and open Google Maps directions for car, motorcycle, bicycle, or walking travel.
- Sign in and out with Google through Supabase Auth once the Google provider is enabled in the Dashboard.
- Switch between Thai and English. The interface uses the Prompt font and adapts to desktop and mobile screens.

## Project layout

```text
.
├── .github/
│   ├── workflows/pages.yml               # Validate PRs; publish main to GitHub Pages
│   └── PULL_REQUEST_TEMPLATE.md           # Review checklist
├── docs/
│   ├── architecture.md                    # Module boundaries and search flow
│   ├── supabase-setup.md                  # Auth setup in GitHub, Supabase, and Google
│   └── screenshots/
│       ├── home-desktop.png               # Results and map preview
│       └── search-travel-modes.png        # Travel mode and radius preview
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── main.tsx                           # React entry point
│   ├── styles.css                         # Global styles and layout
│   ├── app/
│   │   ├── App.tsx                        # Application composition
│   │   └── i18n.ts                        # Thai and English translations
│   ├── components/ui/
│   │   ├── Brand.tsx                      # Shared branding
│   │   └── LanguageSwitch.tsx             # Language control
│   ├── config/map.ts                      # Map and provider settings
│   ├── features/auth/
│   │   ├── AuthControl.tsx                # Sign-in, account, and sign-out UI
│   │   └── useAuth.ts                     # Supabase session lifecycle
│   ├── features/discovery/
│   │   ├── index.ts                       # Public feature entry point
│   │   ├── DiscoveryPage.tsx              # Search, results, and map composition
│   │   ├── api/
│   │   │   ├── overpass.ts                # Overpass request and OSM normalization
│   │   │   └── overpass.test.ts           # API boundary tests
│   │   ├── hooks/useDiscovery.ts          # Search state and request lifecycle
│   │   ├── model/
│   │   │   ├── types.ts                   # Place and filter types
│   │   │   ├── quick-filter-catalog.ts    # Food category definitions
│   │   │   ├── filter-restaurants.ts      # Distance and filter rules
│   │   │   ├── filter-restaurants.test.ts # Filtering tests
│   │   │   ├── place-details.ts           # Addresses and external map links
│   │   │   └── place-details.test.ts      # Google Maps travel mode links
│   │   └── components/
│   │       ├── SearchDialog.tsx           # Search form
│   │       ├── QuickFilters.tsx           # Category shortcuts
│   │       ├── ResultsPanel.tsx           # Sorted result list
│   │       ├── RestaurantCard.tsx         # Individual result
│   │       ├── PlaceMeta.tsx              # Place facts and availability
│   │       ├── SelectedPlace.tsx          # Selected map place
│   │       └── MapCanvas.tsx              # Leaflet map and pins
│   └── lib/
│       ├── http.ts                        # Shared HTTP boundary
│       └── supabase.ts                    # Browser client with publishable key
├── supabase/config.toml                  # Local CLI config; no migrations yet
├── index.html                            # Static HTML entry point and CSP
├── vite.config.ts                        # Vite build and Pages base path
└── package.json                          # Scripts and dependencies
```

See [Architecture](docs/architecture.md) for the data flow and module boundaries. Read [Contributing](CONTRIBUTING.md) before opening a pull request.

## Supabase status

The website includes a Supabase Auth client and a Google sign-in button. The production build reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from GitHub Actions variables. **Google sign-in remains unavailable until the Google provider is enabled in the Supabase Dashboard.** Favorites and comments have not been built. Follow [Supabase setup](docs/supabase-setup.md) for the exact Dashboard steps and key handling.

## Data and limitations

Map tiles and place data come from OpenStreetMap and the public Overpass API. Category matches use names and available tags; a restaurant may be missing or lack dish-level information. Filters requiring a specific tag exclude places where it is unknown. OpenStreetMap does not provide Google review scores, so the rating control is unavailable rather than showing invented ratings. Search radius and result distances are measured in a straight line, not along roads. Google Maps calculates the actual route for the selected travel mode; motorcycle and bicycle routing depend on local coverage. Wider searches can take longer or fail when the public Overpass service is busy.

The app sends the selected search point and radius to Overpass only when a search starts. It stores language choice and Supabase Auth session in the browser; it does not store location history. Google Maps directions use [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), which need no API key. Public map and search services have no availability guarantee and are not designed for large-scale traffic. Review the [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/) and [Overpass usage guidance](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html) before wider deployment.

## Delivery

The repository uses `main` and `dev`. Changes to `main` go through a pull request. GitHub Actions checks pull requests into both branches and publishes successful `main` builds to [GitHub Pages](https://engasnm111.github.io/eat-a-rai-dee/). The Supabase GitHub integration manages future database migrations and functions separately; it does not publish the website.

## License and credits

Source code and the original logo are under the [MIT License](LICENSE). Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Prompt uses the [SIL Open Font License](https://openfontlicense.org/). See [third-party notices](THIRD_PARTY_NOTICES.md).
