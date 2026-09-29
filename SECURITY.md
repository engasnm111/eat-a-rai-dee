# Security

Please report suspected vulnerabilities privately through GitHub's private vulnerability reporting for this repository when available. If it is not enabled, contact the repository maintainer through GitHub before sharing details. Do not publish exploit steps or user data in a public issue.

The website uses Supabase Auth and Supabase member data from a browser client configured only with the project URL and publishable key. The publishable key is expected to be present in the browser; privileged Supabase keys, database passwords, Google OAuth client secrets, and personal access tokens must never be placed in `VITE_` variables, browser bundles, or Git.

Member-owned `favorites`, `reviews`, and `spin_history` records are protected by Row Level Security so authenticated users can operate only on their own records. The public rating surface exposes only aggregate restaurant rating data, not another member's private record set. Changes to the Supabase schema or policies must preserve those boundaries and should be validated against both owner and non-owner access before release.

The application requests device location only after user action and does not persist the user's search-origin history. Saved favorites, reviews, and spin results contain restaurant snapshot data such as restaurant name, address, and restaurant coordinates. Review location handling, external-service usage, Content Security Policy, and Row Level Security whenever those boundaries change.
