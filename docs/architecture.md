# Architecture

## Module boundaries

```text
app
  -> features/discovery
       -> features/auth
       -> features/member -> lib/supabase
       -> features/spin
       -> components/ui, config, lib
       -> model (pure functions and types)
```

`app` composes the page and translations. `features/discovery` owns restaurant search and composes the results, member actions, free spin, and map. `features/auth` owns the browser session and Google OAuth entry point. `features/member` owns Supabase member records and aggregate rating reads. `features/spin` contains pure candidate ranking and random-selection logic. Shared UI, configuration, and infrastructure do not import back into features.

## Search flow

1. The user selects a starting point, keyword, categories, radius, and optional service filters in the search dialog.
2. On submit, `useDiscovery` requests places from Overpass through `lib/http`. It cancels stale requests and reuses the latest result for the same point and radius.
3. The API boundary validates external data with Zod, converts OSM nodes, ways, and relations into `Restaurant` records, and drops records without a usable name or coordinate.
4. The model recalculates Haversine distance and enforces the requested radius. Selected food categories use OR; the keyword and service filters use AND. Category definitions and match rules live in one catalog. The `opening_hours` parser loads when needed.
5. The list and map consume the same filtered results, sorted nearest first. The list reveals 24 places at a time, and the map caps pins at the nearest 80 to avoid excessive rendering.
6. Visible restaurant IDs are passed to `useMemberData`, which reads aggregate member-rating summaries without mixing those values with OSM source data.

## Member and free-spin flow

1. `useAuth` observes Supabase browser-session changes. Google OAuth returns to the configured site base path when the provider is enabled.
2. `useMemberData` loads favorites, reviews, and spin history for the current Supabase user. Request identity guards prevent responses from an older search or user session from replacing current state.
3. Member mutations go through `member-service.ts`. Favorites are added/removed, reviews are upserted or deleted, and signed-in free-spin results are inserted into history. The UI refreshes the affected member data after a successful mutation.
4. Free spin first takes up to 10 restaurants ordered by member rating descending, with straight-line distance as the tie-breaker and as the order for unrated restaurants. `pickSpinWinner` then chooses uniformly from that candidate set. Guests can spin without persisting history.
5. Review forms synchronize from the latest loaded review so an asynchronously loaded or changed member record is not shown as a blank draft.

## Safety and data limits

- Device location is requested only after a user action. Search origins and search results are not kept in local storage.
- Overpass queries use validated numbers and fixed tags. User-entered keywords are filtered locally, not interpolated into Overpass query syntax.
- OSM names are rendered as text; map tooltips use `textContent` rather than inserting external HTML.
- Directions and source links are built from fixed OpenStreetMap URL shapes with `noopener noreferrer`. The static page has a Content Security Policy.
- Missing or invalid opening hours are treated as unknown. Rating values come from reviews submitted through this site; the app does not invent or import Google review scores.
- Motorcycle directions use the public car-routing profile because the selected public OSM router does not expose a dedicated motorcycle profile. The UI states this limitation.

## Supabase boundary

`lib/supabase.ts` creates a browser client from the Supabase URL and publishable key. `features/auth/useAuth.ts` owns session changes and starts Google OAuth. `features/member/data/member-service.ts` is the browser database boundary for member data. Favorites, reviews, and spin history are owner-scoped by Row Level Security; the restaurant rating summary exposes aggregate values needed by the public result list and free-spin ranking. Privileged keys and Google OAuth secrets remain outside the browser and Git.

The repository intentionally ignores SQL working files. Database schema and policy administration therefore remain a separate Supabase operation and must preserve the documented Row Level Security contract.

## Hosting

Vite builds the static app with `/eat-a-rai-dee/` as its GitHub Pages base path; local development uses `/`. GitHub Actions validates pull requests and deploys successful `main` builds to GitHub Pages. The public Overpass endpoint and OSM tile server are unsuitable for high traffic without a service plan or self-hosted alternative.
