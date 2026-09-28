# Supabase setup

This repository contains a local Supabase configuration, but the restaurant finder currently has no login, favorites, comments, or database tables. GitHub integration deploys committed Supabase migrations and declared functions; it does not connect the React app or configure hosted Auth providers.

## Connect the GitHub repository

1. Push `main` and `dev` to GitHub. In **Supabase Dashboard → Project Settings → Integrations → GitHub**, choose `engasnm111/eat-a-rai-dee`.
2. Set **Working directory** to `.` because `supabase/` is at the repository root.
3. Set **Production branch name** to `main`. The Git branch named `dev` is independent of Supabase preview branching. Automatic preview branches require Supabase Pro; the Free plan can still use the GitHub integration for production migrations.
4. Keep **Deploy to production** off while testing the connection and reviewing the first migration. Enabling it later will apply new migrations on pushes or merges to `main`; do that only after the database workflow has been tested and accepted.
5. Enable the integration and confirm that the Dashboard reports the repository and branch. This does not publish the website.

The repository has no migration yet, so connecting it should not create favorites or comments tables. Keep schema changes in reviewed files under `supabase/migrations/`; do not edit production tables without bringing the changes back into version control.

## Keys for future browser features

When the Supabase client is implemented, get the **Project URL** and **publishable key** from the Dashboard's **Connect** dialog or **Project Settings → API Keys**. Copy `.env.example` to `.env.local` and fill only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Vite exposes every `VITE_` value in the browser bundle: the publishable key is designed for that, but it grants access according to your Row Level Security policies. A `.env.local` file is ignored by Git.

Never place a Supabase secret or legacy `service_role` key, database password, Google OAuth client secret, or personal access token in a `VITE_` variable, committed file, issue, or chat. Store server-only secrets in the Supabase Dashboard or a server-side secret store. The current app does not read these environment variables yet, so filling them alone will not activate login.

## Google sign-in preparation

1. In **Supabase Dashboard → Authentication → URL Configuration**, set the future Site URL to `https://engasnm111.github.io/eat-a-rai-dee/` after the site is deployed. Add `http://127.0.0.1:5173/` as a local Redirect URL. The actual `redirectTo` used by the app must match an allowed URL.
2. In Google Cloud, create a Web OAuth client. Add `http://127.0.0.1:5173` and `https://engasnm111.github.io` as authorized JavaScript origins for local and hosted use. Copy the Supabase callback URL from **Authentication → Providers → Google** into Google's authorized redirect URIs.
3. Enter the Google Client ID and Client Secret in Supabase's Google provider settings. Keep the client secret in the Dashboard. Enable the provider only when the app's sign-in flow is ready to test.

Google authentication still needs application code and a database design for favorites and comments. That work should include Row Level Security policies, input limits, error states, and focused tests before enabling production deployment.

## Local CLI work later

The `supabase/` directory was initialized with the official CLI. If you later need local migrations, use the [Supabase CLI workflow](https://supabase.com/docs/guides/local-development/cli-workflows). Linking to the hosted project requires your own Supabase login and database password; do not commit either. Avoid `db reset --linked` on a production project because it erases remote data.

Official references: [GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration), [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google), and [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
