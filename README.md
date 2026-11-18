# HER WORLD — model & creator portfolio

A mobile-first portfolio with a private admin panel. She posts reels, shoots, brand collabs and blog posts from her phone; the home page updates itself.

**Stack:** Next.js 15 (App Router) · Supabase (database + login) · Cloudflare R2 (photos/videos) · Vercel (hosting)

---

## 1. Run it on your computer (10 minutes)

1. Install **Node.js 20+** from nodejs.org.
2. Unzip this folder, open a terminal inside it and run:
   ```bash
   npm install
   cp .env.example .env.local
   npm run dev
   ```
3. Open http://localhost:3000. The site shows with placeholder text until you connect Supabase.

## 2. Supabase (database + admin login)

1. supabase.com → New project (region: Mumbai for India). Save the database password.
2. Open `supabase/schema.sql`, replace **her@email.com** (4 places) with her real email.
3. Supabase → **SQL Editor** → paste the file → **Run**.
4. Optional: run `supabase/sample-content.sql` to see sample cards.
5. **Authentication → Users → Add user**: her email + a strong password. Tick "Auto confirm".
6. **Authentication → Sign In / Providers → Email**: turn **off** "Allow new users to sign up".
7. **Project Settings → API**: copy the Project URL and anon key into `.env.local`.

## 3. Cloudflare R2 (photos & videos)

Photos and videos are shrunk in the browser before upload (photos → max 2000px WebP/JPEG, videos → 720p H.264 MP4 with a cover image), then sent straight to R2. R2 has no bandwidth charge, and videos only load when a visitor scrolls near them.

1. dash.cloudflare.com → **R2** → enable → **Create bucket** `herworld-media`.
2. Bucket → **Settings → Public access**: connect a **custom domain** such as `media.seenagracejohn.com` (the domain must be on Cloudflare DNS). Or, for testing only, enable the **r2.dev** link.
3. Bucket → **Settings → CORS policy** → paste:
   ```json
   [{ "AllowedOrigins": ["https://seenagracejohn.com", "https://www.seenagracejohn.com", "http://localhost:3000"],
      "AllowedMethods": ["PUT", "GET"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 3600 }]
   ```
4. R2 overview → **Manage API tokens → Create API token**: permission **Object Read & Write**, only this bucket. Copy the Access Key ID, Secret Access Key and your Account ID.
5. Put them in `.env.local` (and in Vercel → Settings → Environment Variables): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `NEXT_PUBLIC_MEDIA_URL`.

Old items that still point at the closed Cloudinary account show a branded placeholder on the site and a **Re-upload media** badge in the admin. Open each, remove the old file (×) and upload it again.

## 4. Use the admin

Go to **/admin** → sign in.

- **Content** → *+ Add new content* → pick type → title, brand, tags → upload → **Publish**.
- **Edit / Preview / Hide / Delete** on every row.
- **Site settings** → name, tagline, hero video, portrait, numbers, services, contact, media kit.
- **Client links** → copy `/client/fashion`, `/client/beauty` … to send brands a filtered portfolio.

Tags matter: the client links show only content with that tag.

## 5. Put it online (Vercel)

1. Push this folder to a new GitHub repo.
2. vercel.com → **Add New → Project** → import the repo.
3. Paste every variable from `.env.local` into **Environment Variables** (set `NEXT_PUBLIC_SITE_URL` to her real domain) → **Deploy**.
4. **Settings → Domains** → add `rahana.com` and `www.rahana.com`; copy the DNS records into the domain provider.
5. Supabase → **Authentication → URL Configuration** → set Site URL to the live domain.
6. Google Search Console → add the domain → submit `https://rahana.com/sitemap.xml`.
7. Optional: set `NEXT_PUBLIC_GA_ID` for Google Analytics.

Vercel's free Hobby plan is for non-commercial use; a paid creator site should use Pro.

## Where things live

| Want to change… | File |
| --- | --- |
| Colours, fonts, spacing | `app/globals.css`, `app/layout.tsx` |
| Home page section order | `app/page.tsx` |
| Default text before settings are saved | `lib/defaults.ts` |
| Content types / tags | `lib/types.ts` + the `check` in `supabase/schema.sql` |
| Contact form options | `components/Contact.tsx` |

## Security notes

- Only the email in `schema.sql` can write; everyone else can only read published content.
- Uploads go through `/api/upload`, which only gives a 15-minute upload link to a signed-in admin. The R2 keys stay on the server.
