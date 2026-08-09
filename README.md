# BookMyNail

Marketing site for BookMyNail — an at-home nail studio serving Ahmedabad.
Next.js (App Router) + TypeScript + Tailwind + Framer Motion.

```bash
npm install
npm run setup   # create the database, seed it, generate admin credentials
npm run dev     # http://localhost:3000
npm run build   # production build / type-check
```

`npm run setup` prints the admin password **once** — save it. Re-run
`npm run admin:create` to issue a new one, or
`npm run admin:create -- you@example.com` to change the email too.

## Admin panel

At **`/admin`** — deliberately unlinked from the public site. There is no button
anywhere; reach it by typing the URL. It is `noindex` and disallowed in
`robots.txt`, and every route under it is gated by `middleware.ts`.

| Page | What it does |
|---|---|
| Overview | Sessions, visitors, clicks, leads, conversion; top pages and services |
| Heatmap | Click map painted on the real page, section leaderboard, scroll funnel, most-clicked elements |
| Leads | Every booking request — status pipeline, notes, CSV export, one-tap WhatsApp |
| Services / Add-ons / Portfolio / Settings | Content editing; changes appear on the public site immediately |

### How the heatmap works

`components/analytics/tracker.tsx` records anonymous events: clicks (with
coordinates), hover and in-view dwell per section, scroll depth, and service
interactions. **No names, no IP, no input values, no session recording.** It
honours Do Not Track and never runs on `/admin` or inside the admin's own
preview iframe.

Clicks are stored device-relative — `x` as a fraction of document width, `y`
absolute alongside the document height at capture — so the admin can replay them
accurately at any preview width. The preview keeps the iframe at true device
size and scrolls its content in step with the overlay, rather than stretching it
(stretching makes the page's `100vh` sections grow, which remeasures taller
forever).

To mark a new section for tracking, add `data-track-section="name"`; to name a
specific CTA, add `data-track-id="my-cta"`.

## Routes

| Route | Source in the design export |
|---|---|
| `/` | `design-export/BookMyNail v3.dc.html` |
| `/services` | `design-export/Services.dc.html` |
| `/portfolio` | `design-export/Portfolio.dc.html` |

`design-export/` is the Claude Design export and remains the source of truth for
layout, copy, spacing and motion. `design-export/_extracted/` holds the slot
images decoded out of `.image-slots.state.json`; the twelve that pages actually
use are copied into `public/images/`.

## Where things live

- `tailwind.config.ts` — the palette, type scale and breakpoints, ported from the
  export's `:root`. Components reference these tokens; no hex values are inlined.
- `lib/db/schema.ts` — the six tables (services, add-ons, portfolio, settings,
  leads, events).
- `lib/queries.ts` — cached public reads. Admin mutations call `revalidateTag`,
  so the marketing pages stay prerendered but refresh the moment you save.
- `lib/site.ts` — the fixed editorial copy (values, reviews, gallery captions)
  plus pure helpers. Services, add-ons, portfolio and settings moved to the
  database; edit those in `/admin`.
- `lib/seed-data.ts` — the original export content, used only to seed a fresh
  database.
- `lib/storage.ts` — image upload adapter. **The one thing to change when
  deploying serverless** (see below).
- `components/motion/reveal.tsx` — the four reveal primitives (`Rise`, `Soft`,
  `Wipe`, `Rule`, plus `Card`) rebuilt on Framer Motion.
- `components/site/site-nav.tsx` — the single nav used by every route. Edit
  `NAV_LINKS` / `BOOK_HREF` there and all three pages follow.

The booking number lives in one place: `WHATSAPP` in `lib/site.ts`.

## Navigation

One `SiteNav` and one `Footer` serve all three routes. The bar is fixed, starts
transparent over each page's dark hero, and inverts to ink-on-bone once that
hero scrolls past — mark a page's hero with `data-nav-boundary` to set the
switch point. Below 761px the links collapse into a full-screen menu.

The export shipped three different navs (the homepage and Services pages had no
mobile menu at all, so their links simply vanished on phones). Unifying them
meant two deliberate changes:

- **One link set everywhere**, using absolute hrefs so it works from any page:
  About · Values · Services · Portfolio · Reviews.
- **"Book now" points at `/services#book`** on every page, rather than the
  homepage's original direct `wa.me` link — that form shows the price before
  sending and still finishes in WhatsApp. Direct WhatsApp links remain in the
  hero, the contact section and the portfolio CTA band. To revert, change
  `BOOK_HREF` in `components/site/site-nav.tsx` to `whatsappUrl()`.

## Known deviations from the export

1. **Portfolio is recoloured.** It is the one exported page with no BookMyNail
   `:root` — it inherits the generic red/white `_ds/modernist-*` starter tokens.
   By decision it keeps the exported layout and motion but maps to brand tokens
   (accent → terracotta, headings → Bodoni Moda).
2. **Portfolio shows 4 sets, not 12.** `.image-slots.state.json` only contains
   artwork for `p-1`…`p-4`; `p-5`…`p-12` have no source anywhere in the export.
   The counter reads 4 and only `All / Manicure / Nail Art` appear. Adding the
   missing images to `PORTFOLIO_ITEMS` restores the grid, counter and the
   `Extensions` / `Bridal` tabs automatically.
3. **Reveals use Framer Motion**, not the export's CSS `animation-timeline:
   view()`. Same durations and easings — and they now also run in Safari and
   Firefox, where the exported version silently did not animate.
4. **`about-photo`'s crop** (`y: 38.06` in the slot state) is approximated with
   `object-position`; it sits under the ±8% parallax layer either way.
5. **Copy quirks reproduced verbatim**, not silently fixed:
   - the homepage stat block reads "9 · Step booking" while the site describes a
     four-step process;
   - the WhatsApp booking summary has no blank lines, because the export's
     `.filter(Boolean)` strips its own `''` spacer entries.

Several gallery slots reuse the same photograph (`v3-gal-1` ≡ `v3-gal-4`,
`v3-gal-2` ≡ `v3-gal-6`), as they do in the export.

## Deploying

The database is a SQLite file at `data/bookmynail.db`. That works as-is on a VPS
or your own machine. For a serverless host (Vercel), two things change:

1. **Database** — create a free [Turso](https://turso.tech) database and set
   `DATABASE_URL=libsql://…` plus `DATABASE_AUTH_TOKEN`. No code changes; the
   libSQL client speaks both.
2. **Image uploads** — `lib/storage.ts` writes to `public/uploads`, and
   serverless filesystems are read-only. Swap `saveImage()` for Vercel Blob,
   S3 or Cloudinary (the hero video already sits on Cloudinary). Nothing else
   touches the filesystem — the rest of the app only sees the returned URL.

Copy `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `AUTH_SECRET` from `.env.local`
into the host's environment variables. The password hash is stored base64
encoded on purpose: a raw bcrypt hash is full of `$`, and dotenv's variable
expansion silently reduces it to an empty string.
