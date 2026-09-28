# Contributing

## Local workflow

1. Install dependencies with `npm ci` and run the site with `npm run dev`.
2. Keep changes in the relevant feature. Put genuinely shared UI in `src/components/ui`, configuration in `src/config`, and shared infrastructure in `src/lib`.
3. Before opening a pull request, run `npm test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm run build`.
4. For UI changes, inspect desktop and mobile layouts and include screenshots of relevant states.

Add tests for important behavior and concrete regressions. Avoid tests that only repeat implementation details or copy. Write code comments in English and do not put emoji in code.

## Branches and reviews

Start feature work from `dev` on a `feature/*` or `fix/*` branch, then open a pull request into `dev`. Promote accepted work from `dev` to `main` through a pull request. Direct pushes and force pushes to `main` are blocked. CI/CD will be added after manual acceptance; do not claim hosted checks passed before they exist.

Use a clear Conventional Commit message, for example `feat(discovery): add cuisine filter`. Pull requests should explain the change, its reason, verification, UI screenshots when relevant, and any data or security impact. Use the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
