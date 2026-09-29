# Supabase Auth and member-data setup

The website uses Supabase for Google Auth and member data. Browser builds need the project URL and publishable key. Google sign-in additionally needs a Google OAuth client connected to the Supabase Google provider. Member tables and policies are administered in the Supabase project separately from the GitHub Pages deployment.

## 1. Local and GitHub Pages browser values

The local `.env.local` file is ignored by Git. Vite reads it only when running or building on your computer. It is **not** sent to GitHub Pages. For the hosted build, open **GitHub → engasnm111/eat-a-rai-dee → Settings → Secrets and variables → Actions → Variables** and create these repository variables:

| Variable                        | Value from Supabase Dashboard                                   |
| ------------------------------- | --------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Project URL from **Connect** or **Project Settings → API Keys** |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key from the same screen                            |

These two repository variables have already been set for the hosted build. `.github/workflows/pages.yml` passes them only to the Vite build step. The publishable key is meant to be visible in the browser; it is **not** a database secret. Changes to GitHub variables require a fresh `main` build to appear on Pages.

Never put a `service_role`/secret key, database password, Google OAuth client secret, or personal access token in any `VITE_` variable, `.env.local`, or GitHub repository variable. The Google client secret belongs only in the Supabase Dashboard.

## 2. Allow the website to receive the sign-in return

Open **Supabase Dashboard → Authentication → URL Configuration**:

1. Set **Site URL** to `https://engasnm111.github.io/eat-a-rai-dee/`.
2. Add **Redirect URLs** for `https://engasnm111.github.io/eat-a-rai-dee/` and `http://127.0.0.1:5173/`.
3. Save. The trailing `/eat-a-rai-dee/` matters on GitHub Pages. The app requests this exact return URL through `redirectTo`.

## 3. Create the Google OAuth client

In [Google Cloud Console](https://console.cloud.google.com/), select or create a project, then open **Google Auth Platform**:

1. Complete **Branding** and **Audience**. For an External app still in Testing, add your Google account under **Test users**. Configure the `openid`, email, and profile scopes required by Supabase.
2. Open **Clients → Create client → Web application**.
3. Add **Authorized JavaScript origins**: `https://engasnm111.github.io` and `http://127.0.0.1:5173`. These are origins, so they have no `/eat-a-rai-dee/` path.
4. In **Supabase Dashboard → Authentication → Sign In / Providers → Google**, copy the displayed **Callback URL**. Paste that exact URL into the Google client's **Authorized redirect URIs**. This is a Supabase `/auth/v1/callback` URL, **not** the GitHub Pages URL.
5. Create the client and copy its **Client ID** and **Client Secret**.

## 4. Enable Google in Supabase

Return to **Supabase Dashboard → Authentication → Sign In / Providers → Google**. Enable Google, paste the Client ID and Client Secret from step 3, and save. The Client Secret stays in Supabase. At the latest implementation check, this provider was still **disabled** because no Google Client ID/Secret had been configured; the login button cannot complete sign-in until this step is done.

Open the local or hosted website, click **เข้าสู่ระบบ Google**, approve the Google consent screen, and confirm that the website shows your account and **ออกจากระบบ**. If the Google app remains in Testing, sign in with an account listed under Test users. New accounts should then appear in **Supabase Dashboard → Authentication → Users**.

## 5. Member-data boundary

The production Supabase project contains the member-data surfaces used by the browser app: owner-scoped favorites, reviews, and free-spin history plus an aggregate restaurant-rating summary. Row Level Security is the authorization boundary for member-owned records. Before changing this schema or its policies, validate at minimum that an owner can access their own rows, a different authenticated user cannot read or mutate those rows, and anonymous access is limited to the intended aggregate rating surface.

SQL working files are intentionally local-only and ignored by this repository. Do not add generated/local SQL files to Git; apply and validate database changes through the controlled Supabase administration workflow instead.

## Delivery separation

GitHub Actions publishes the React site from `main` to GitHub Pages. Supabase database administration and Google Auth provider configuration are separate operations. The connected Supabase GitHub integration does not by itself enable Google login, and because this repository intentionally does not track SQL working files, it should not be treated as the source of database-schema delivery.

Official references: [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), and [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
