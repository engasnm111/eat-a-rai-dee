# Architecture

## Module boundaries

```text
app
  -> features/discovery
       -> components/ui, config, lib
       -> model (pure functions and types)
```

`app` composes the page and translations. `features/discovery` owns restaurant search and exposes its public entry point through `index.ts`. Shared UI, configuration, and HTTP code do not import back into the feature. This keeps provider changes and presentation changes local.

## Search flow

1. The user selects a starting point, keyword, categories, radius, and optional service filters in the search dialog.
2. On submit, `useDiscovery` requests places from Overpass through `lib/http`. It cancels stale requests and reuses the latest result for the same point and radius.
3. The API boundary validates external data with Zod, converts OSM nodes, ways, and relations into `Restaurant` records, and drops records without a usable name or coordinate.
4. The model recalculates Haversine distance and enforces the requested radius. Selected food categories use OR; the keyword and service filters use AND. Category definitions and match rules live in one catalog. The `opening_hours` parser loads when needed.
5. The list and map consume the same filtered results, sorted nearest first. The list reveals 24 places at a time, and the map caps pins at the nearest 80 to avoid excessive rendering.

## Safety and data limits

- Device location is requested only after a user action. Search points and results are not kept in local storage.
- Overpass queries use validated numbers and fixed tags. User-entered keywords are filtered locally, not interpolated into Overpass query syntax.
- OSM names are rendered as text; map tooltips use `textContent` rather than inserting external HTML.
- Directions and source links are built from fixed URL shapes with `noopener noreferrer`. The static page has a Content Security Policy.
- Missing or invalid opening hours are treated as unknown. OSM has no Google review scores, so the app does not invent them.

## Supabase boundary

`supabase/config.toml` prepares local CLI configuration and gives the GitHub integration a repository-root `supabase/` directory. It contains no migration and does not connect the current React app to Supabase. Future login, favorites, and comments should use a browser client with the publishable key, versioned SQL migrations, Row Level Security policies, and indexes for per-user and per-place queries. Privileged keys and Google OAuth secrets must remain outside the browser and Git. See [Supabase setup](supabase-setup.md).

## Hosting

Vite builds the static app with `/eat-a-rai-dee/` as its GitHub Pages base path; local development uses `/`. GitHub Actions validates pull requests and deploys successful `main` builds to GitHub Pages. The public Overpass endpoint and OSM tile server are unsuitable for high traffic without a service plan or self-hosted alternative.
