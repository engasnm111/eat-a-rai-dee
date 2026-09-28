# eat a rai dee

A bilingual lunch finder built with React and TypeScript. Pick a location, search nearby food on an OpenStreetMap map, and open directions in Google Maps. This repository is also a small example of feature-based frontend architecture.

![eat a rai dee logo](public/logo.svg)

## Run locally

Requires Node.js 22.12 or newer and npm.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173/`. The current restaurant search does not require an API key or an `.env` file.

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
- Choose your device location, pick a point on the map, or start from the sample point in central Bangkok. Set a 300 m to 5 km radius.
- Filter by opening hours, vegetarian options, wheelchair access, takeaway, and delivery when source tags support them.
- Explore results by distance, select map pins, and open Google Maps directions.
- Switch between Thai and English. The interface uses the Prompt font and adapts to desktop and mobile screens.

## Project layout

```text
src/app/                  App composition and translations
src/components/ui/        Shared UI
src/config/               Map and provider settings
src/features/discovery/   Search, filters, map, and results
src/lib/                  Shared HTTP boundary
supabase/                 Local Supabase configuration; no database migration yet
```

See [Architecture](docs/architecture.md) for the data flow and module boundaries. Read [Contributing](CONTRIBUTING.md) before opening a pull request.

## Supabase status

The `supabase/` directory prepares this repository for Supabase's GitHub integration. **The website does not yet use Supabase Auth or store favorites and comments.** Connecting the repository in the Supabase Dashboard does not add those features by itself. Follow [Supabase setup](docs/supabase-setup.md) for the GitHub integration, future browser keys, Google sign-in settings, and secret handling.

## Data and limitations

Map tiles and place data come from OpenStreetMap and the public Overpass API. Category matches use names and available tags; a restaurant may be missing or lack dish-level information. Filters requiring a specific tag exclude places where it is unknown. OpenStreetMap does not provide Google review scores, so the rating control is unavailable rather than showing invented ratings.

The app sends the selected search point and radius to Overpass only when a search starts. It stores the language choice in the browser; it does not store location history. Google Maps directions use [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), which need no API key. Public map and search services have no availability guarantee and are not designed for large-scale traffic. Review the [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/) and [Overpass usage guidance](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html) before wider deployment.

## Delivery

The repository uses `main` and `dev`. Changes to `main` go through a pull request. CI/CD and GitHub Pages deployment are planned after manual acceptance; Vite already sets the `/eat-a-rai-dee/` base path for the intended Pages URL.

## License and credits

Source code and the original logo are under the [MIT License](LICENSE). Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright). Prompt uses the [SIL Open Font License](https://openfontlicense.org/). See [third-party notices](THIRD_PARTY_NOTICES.md).
