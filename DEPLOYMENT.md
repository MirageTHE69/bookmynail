# BookMyNail — going live (Netlify + Turso + Cloudinary, ₹0/month)

> **Status: not started.** The site works locally but is not deployed, and the project
> is not yet a git repository. Work through the steps below in order.

## Why these three services

Serverless hosts have a **read-only filesystem**, so two things that work locally stop working
once deployed: the SQLite file at `data/bookmynail.db`, and portfolio uploads written to
`public/uploads`. Everything else already runs fine on a serverless host — `lib/storage.ts` is
the only part of the app that touches the disk at runtime.

| Need | Service | Free tier | Why this one |
|---|---|---|---|
| Hosting | **Netlify** | 100GB bandwidth, 300 build min/mo | Free tier **permits commercial use**. Vercel's Hobby plan is licensed personal / non-commercial only, and this site takes real bookings — staying compliant there means $20/mo. |
| Database | **Turso** | 9GB, 1bn row reads/mo | libSQL. `@libsql/client` already speaks it, so **no code change** — just a different `DATABASE_URL`. |
| Images | **Cloudinary** | ~25GB storage/bandwidth | Auto-optimises and resizes. The hero video already streams from Cloudinary. |
| Domain | `bookmynail.netlify.app` | free, HTTPS included | A real domain can be attached any time later — nothing in the code hardcodes the URL. |

---

## Part 1 — code changes (do these first)

### a. `lib/storage.ts` — send uploads to Cloudinary

This file was deliberately isolated for exactly this moment. Replace the body of `saveImage()`
so it streams to Cloudinary and returns the secure URL, keeping the existing `ALLOWED` type and
`MAX_BYTES` size guards. Nothing else in the app changes — everything downstream only ever sees
the returned URL string.

```
now:   writeFile(public/uploads/…)          ✗ read-only on Netlify
then:  cloudinary.uploader.upload_stream()  ✓
```

Add the `cloudinary` package. Auth comes from a single `CLOUDINARY_URL` env var, which the SDK
reads automatically.

### b. `next.config.mjs` — allow Cloudinary images

`next/image` refuses remote hosts unless declared:

```js
images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] }
```

Skip this and newly uploaded photos 400 while the four existing local ones keep working — a
confusing half-broken state.

### c. `.env.example`

A committed template listing the six variables, so the real `.env.local` stays gitignored but
nothing is a mystery in six months.

---

## Part 2 — deployment steps

### Step 1 · Turso database (browser only — no CLI)

The Turso CLI is awkward on Windows; the dashboard does everything needed.

1. Sign up at **turso.tech** with GitHub.
2. Create a database named `bookmynail`, region **Bangalore** or **Mumbai** (closest to Ahmedabad).
3. Copy the **Database URL** (`libsql://bookmynail-….turso.io`), then create a **token** and copy
   that too.

### Step 2 · Create the schema and seed it (locally, once)

Point the existing scripts at Turso instead of the local file — temporarily edit `.env.local`:

```bash
DATABASE_URL=libsql://bookmynail-….turso.io
DATABASE_AUTH_TOKEN=<token>
```

```bash
npm run db:push     # creates the six tables
npm run db:seed     # services, add-ons, portfolio, settings
```

This starts production clean — the simulated test traffic and test leads in the local database
are **not** carried over, which is what you want.

Then set `DATABASE_URL` back to `file:./data/bookmynail.db` so local development keeps using its
own throwaway database.

### Step 3 · Cloudinary

1. Sign up at **cloudinary.com** (free "Programmable Media" plan).
2. Dashboard → copy the **API Environment variable**. It is already in the right form:
   `cloudinary://key:secret@cloud-name`.

### Step 4 · Git + GitHub

The project has no repository yet, and Netlify deploys from one.

```bash
git init
git add .
git commit -m "BookMyNail site and admin panel"
```

`.gitignore` already excludes `node_modules`, `.next`, `.env*.local`, `data/` and
`public/uploads/` — so no secrets and no database file get committed. Create an empty **private**
repo on GitHub, then push.

### Step 5 · Netlify

1. Sign up at **netlify.com** with GitHub → *Add new site* → *Import an existing project* → pick
   the repo.
2. Build command `npm run build`, publish directory `.next`. Netlify auto-detects Next.js and
   installs its runtime — no `netlify.toml` needed.
3. Add environment variables (Site configuration → Environment variables). **All six** — and they
   must be available at *build* time too, because the public pages are prerendered and read the
   database during the build:

```
DATABASE_URL          libsql://bookmynail-….turso.io
DATABASE_AUTH_TOKEN   <turso token>
CLOUDINARY_URL        cloudinary://key:secret@cloud-name
ADMIN_EMAIL           copy from .env.local
ADMIN_PASSWORD_HASH   copy from .env.local (already base64)
AUTH_SECRET           copy from .env.local
NODE_VERSION          20
```

> The admin password itself is **not** in any file — only its hash. It was shown once when
> `npm run admin:create` ran. If it has been lost, re-run that command to issue a new one and
> update `ADMIN_PASSWORD_HASH` in Netlify.

4. Deploy. Every later `git push` redeploys automatically.

### Step 6 · Custom domain (optional, later)

Site configuration → Domain management → add domain, then point DNS at Netlify. SSL is issued
free and automatically. No code changes.

---

## Part 3 — verify after deploying

1. `/`, `/services`, `/portfolio` load over HTTPS and show the seeded prices.
2. `/admin` redirects to login when signed out; the credentials work; a wrong password is rejected.
3. Submit a real booking → the lead appears in `/admin/leads` **and** WhatsApp opens.
4. Click and scroll around the site, then confirm `/admin/heatmap` shows blobs and the section
   table moves.
5. Edit a service price in admin → the public pages update. This is the one behaviour most worth
   confirming on the real host, since it proves `revalidateTag` works under Netlify's Next runtime.
6. Upload a portfolio photo → it appears on `/portfolio` and its URL is `res.cloudinary.com`.
7. `curl https://<site>/robots.txt` still disallows `/admin`.

---

## Caveats worth knowing

- **Login throttling weakens on serverless.** The rate limiter in
  `app/api/admin/login/route.ts` is an in-memory `Map`, so it resets whenever a new instance
  spins up. The password is 20 random characters, so risk is low — but moving that counter into
  the database is the obvious hardening step.
- **Free-tier cold starts.** The first request after an idle spell takes a second or two.
- **Back up the leads.** Turso has its own backups, but the leads table is the business asset —
  the admin CSV export is the simple manual safety net.
- **The `events` table grows.** The retention setting exists in admin (default 180 days) but
  nothing prunes automatically yet. A scheduled cleanup is a later job, not a launch blocker.
