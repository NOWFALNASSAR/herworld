# HER WORLD — model & creator portfolio

A mobile-first portfolio with a private admin panel. She posts reels, shoots, brand collabs and blog posts from her phone; the home page updates itself.

**Stack:** Next.js 15 (App Router) · Supabase (database + login) · Cloudinary (photos/videos) · Vercel (hosting)

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

## 3. Cloudinary (photos & videos)

1. cloudinary.com → sign up. Copy the **Cloud name** into `.env.local`.
2. **Settings → Upload → Upload presets → Add**: name `her_world_uploads`, Signing mode **Unsigned**, folder `her-world`. Save.
3. For the media kit PDF: **Settings → Security** → enable **"Allow delivery of PDF and ZIP files"**. (Or just paste a Google Drive link in Site settings.)

Restart `npm run dev` after editing `.env.local`.

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
- The unsigned Cloudinary preset lets anyone who finds its name upload files. Once live, switch it to **Signed** and add a signing route (see next-cloudinary docs: "Signed Uploads").
