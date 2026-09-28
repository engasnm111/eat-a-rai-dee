# Supabase Auth setup

The website has a Google sign-in button backed by Supabase Auth. Three settings are needed: public browser values in the GitHub Pages build, allowed return URLs in Supabase, and a Google OAuth client connected to the Supabase Google provider. The repository's Supabase GitHub integration is a separate database deployment feature; connecting that integration alone does not enable login.

## 1. Local and GitHub Pages browser values

The local `.env.local` file is ignored by Git. Vite reads it only when running or building on your computer. It is **not** sent to GitHub Pages. For the hosted build, open **GitHub → engasnm111/eat-a-rai-dee → Settings → Secrets and variables → Actions → Variables** and create these repository variables:

| Variable                        | Value from Supabase Dashboard                                   |
| ------------------------------- | --------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Project URL from **Connect** or **Project Settings → API Keys** |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key from the same screen                            |

These two repository variables have already been set from the local `.env.local` file. `.github/workflows/pages.yml` passes them only to the Vite build step. The publishable key is meant to be visible in the browser; it is **not** a database secret. Changes to GitHub variables require a fresh `main` build to appear on Pages.

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

Return to **Supabase Dashboard → Authentication → Sign In / Providers → Google**. Enable Google, paste the Client ID and Client Secret from step 3, and save. The Client Secret stays in Supabase. As checked during implementation, this provider was **disabled**; the login button cannot complete sign-in until this step is done.

Open the local or hosted website, click **เข้าสู่ระบบ Google**, approve the Google consent screen, and confirm that the website shows your account and **ออกจากระบบ**. If the Google app remains in Testing, sign in with an account listed under Test users. New accounts should then appear in **Supabase Dashboard → Authentication → Users**.

## Other Supabase work

The repository has no database migrations, favorites, or comments tables. For the existing GitHub integration, use repository `engasnm111/eat-a-rai-dee`, working directory `.`, and production branch `main`. The integration's **Deploy to production** switch controls Supabase database changes on merges to `main`; it does not publish the React site or enable Auth. GitHub Actions publishes the site from `main` separately.

Official references: [Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), and [API keys](https://supabase.com/docs/guides/getting-started/api-keys).
