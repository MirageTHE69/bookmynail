# BookMyNail — Next.js build plan

> **Status: approved research + plan, no code written yet.**
> Resume point: begin at Step 0 (scaffold) below. Nothing has been installed or generated.
> The only change made to this folder so far is extracting the design ZIP into `design-export/`
> (plus `design-export/_extracted/`, the decoded slot images).

## Context

BookMyNail is an at-home nail service in Ahmedabad. The full visual design already exists as a
Claude Design export; this project reproduces it as a real Next.js marketing site. The export is
the single source of truth — no restyling, no invented copy or palette.

The export arrived as `BookMyNail website design.zip` (not unzipped, contents at archive root).
It is now extracted to `design-export/`, so the paths the task assumes are correct:

- `design-export/BookMyNail v3.dc.html` (922 lines) — homepage
- `design-export/Services.dc.html` (645 lines) — services + booking form
- `design-export/Portfolio.dc.html` (356 lines) — portfolio grid

All three have been read in full, along with `_ds/modernist-*/styles.css`, `image-slot.js`, and
`.image-slots.state.json`.

### Decisions already confirmed with the user

1. **Portfolio palette** — `Portfolio.dc.html` has no BookMyNail `:root`; it inherits the red/white
   `_ds` starter tokens (`--color-accent #ec3013`, Archivo 800 headings). Build it with the exported
   layout/motion but **mapped to brand tokens** (bg→bone, text→ink, accent→terracotta, headings→Bodoni).
2. **Missing artwork** — only `p-1`…`p-4` of the 12 portfolio slots have source images. Ship the
   **4 real sets**; do not substitute stock.
3. **WhatsApp** — real number `919825720827` replaces the placeholder `919999999999`.
4. **Service area** — Ahmedabad only, exactly as the export reads.

---

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v3 · Framer Motion · `next/font/google`.

Tailwind **v3** deliberately: the task calls for tokens extended in `tailwind.config`, which is v3's
JS config. v4 is CSS-first and would not match.

**Step 0 — scaffold:** create `package.json`, `tsconfig.json`, `next.config.mjs`,
`tailwind.config.ts`, `postcss.config.mjs` by hand (not `create-next-app`, which refuses a
non-empty directory), then `npm install`.

---

## 1. Design tokens → `tailwind.config.ts`

Ported verbatim from the `:root` block shared by the homepage and Services page:

`bone #F7F2EC` · `ink #1A1614` · `blush #E7A79F` · `terracotta #BF5634` · `plum #56203C` ·
`lilac #B4A2D4` · `chrome #9BA5AC`

The export also uses ~11 gradient-only shades that never reach `:root` but drive the shade swatches,
value rows and service washes. These become named colors so no hex is hard-coded in components:
`plum-deep #8A3A3C`, `terracotta-deep #8E3A1F`, `peach #F0C3A6`, `plum-ink #43305E`,
`lilac-deep #7B62A8`, `lilac-mist #E3D8F0`, `rose #A85F63`, `cream #F7EDE4`, `slate #3F4A52`,
`slate-mid #6E7C85`, `silver #D9DEE1`.

The design sizes everything with `clamp()`. Rather than scatter arbitrary values, encode the
recurring ones as named tokens — e.g. `spacing.gutter: clamp(18px,4vw,54px)`,
`spacing.section-y: clamp(64px,11vh,130px)`, `fontSize.hero: clamp(46px,8.4vw,142px)` — and add
`transitionTimingFunction.editorial: cubic-bezier(0.16,1,0.3,1)`, the export's signature ease.

**Breakpoints.** The export uses max-width queries (1000px / 760px; Portfolio 900 / 760 / 520).
Tailwind is mobile-first, so invert them into named min-width screens and write the export's
max-width rules as the base layer:

```
screens: { pf: '521px', pfmd: '901px', nav: '761px', wide: '1001px' }
```

This keeps the site mobile-first (as required) while landing on pixel-identical rules at every
width the export specifies.

**Fonts.** `Bodoni_Moda` (variable, normal + italic) → `--font-display`; `Archivo` (400/500/600) →
`--font-body`. Both exposed as Tailwind families `display` / `body`.

---

## 2. Media

`.image-slots.state.json` stores base64 WebP; all 21 entries are decoded to
`design-export/_extracted/`. The 12 that pages actually reference get copied to `public/images/`
with semantic names. 9 entries (`gallery-1…6`, `pkg-1…3`) are orphans from an earlier revision and
are ignored.

- `next/image` with `fill` + `sizes` for every slot, since all frames are aspect/height driven.
- The hero `video-slot` carries a real Cloudinary MP4 URL → plain
  `<video muted loop autoplay playsinline>`.
- Crop values in the state file are `{s, x, y}`, applied by `image-slot.js` as
  `left/top = 50 ± x/y` percent of the frame with `translate(-50%,-50%)`. 11 of the 12 are
  `s:1, x:0, y:0`, i.e. exactly `object-fit: cover; object-position: center`. Only `about-photo`
  pans (`y: 38.06`); it gets an equivalent `object-position` tuned visually during self-review —
  it also sits under the ±8% parallax layer, which dominates its framing anyway.

### Slot → file map

| Slot | Page | Source |
|---|---|---|
| `about-photo` | home | ✅ (pans, `y: 38.06`) |
| `v3-gal-1`…`v3-gal-6` | home gallery | ✅ (`1`≡`4`, `2`≡`6` are the same file) |
| `hero-video` | home | ✅ remote Cloudinary MP4 |
| `svc-hero` | services | ✅ |
| `p-1`…`p-4` | portfolio | ✅ |
| `p-5`…`p-12` | portfolio | ❌ **absent — do not substitute** |

---

## 3. Motion

The export's reveals are CSS scroll-driven (`animation-timeline: view()`), which is Chromium-only.
The task mandates Framer Motion, so reveals are rebuilt in `components/motion/reveal.tsx` with
`whileInView` + `viewport={{ once: true }}`, reproducing the exported keyframes exactly:

| Primitive | Transform | Duration / ease |
|---|---|---|
| `<Rise>` | `translateY(105%) → 0` (parent clips) | 1.05s `editorial` |
| `<Soft>` | `opacity 0→1`, `y 20→0` | 0.9s ease-out |
| `<Wipe>` | `clip-path inset(0 0 100% 0) → inset(0)` | 1.1s `editorial` |
| `<Rule>` | `scaleX 0→1`, origin left | 1s `editorial` |

Inside `[data-hero]` the export switches these to `animation-timeline: auto` with 0.15 / 0.3 / 0.5s
delays — so hero variants animate on mount, not on scroll. Everything honours `useReducedMotion()`,
matching the export's `prefers-reduced-motion` block.

The GSAP behaviours become one hook or component each, preserving the exported constants:

1. **Hero shade picker** — 5 swatches, two stacked gradient layers crossfading 0.75s; active swatch
   scales 1.22 with brightened border; shade name crossfades. Hover *and* click both select.
2. **Marquee** — duplicated track, `x: '-100%'`, 26s linear, infinite.
3. **Parallax** — hero video `-5%→7%`, about photo `-8%→8%`, using the export's own progress
   formula `(vh - top) / (vh + height)`.
4. **Counters** — 0→N over 1.5s on first view, `toLocaleString('en-IN')`; markup holds the true
   value so a miss still renders correctly.
5. **Values** — section wash takes the tint of the row in view (IntersectionObserver, thresholds
   `[.35,.6,.9]`, `rootMargin -25%`, 0.8s ease); row hover shifts padding-left 14px, swatch 1.16.
6. **Services accordion** — single-open, animated height (0.55s), wash `0.14` open / `0.07` hover,
   dot 1.18, `aria-expanded` maintained.
7. **Gallery** — ≥761px the track translates on section scroll across `scrollWidth - vw + 40`;
   ≤760px native `scroll-snap-type: x mandatory` with 72vw cards. Card hover scales image 1.07.
8. **Reviews** — 5.6s auto-advance, 0.7s crossfade + 12px rise, dot controls, per-quote wash tint.
9. **Cursor ring** — 30px, `mix-blend-mode: difference`, spring follow, 2.2× over interactive
   elements; hidden ≤760px, on coarse pointers, and under reduced motion.
10. **Portfolio** — nav inverts past the header, burger menu (clip-path reveal + staggered links),
    filter underline `scaleX`, caption slides up on card hover.

---

## 4. Structure

```
app/layout.tsx            fonts, metadata, cursor ring
app/page.tsx              homepage
app/services/page.tsx
app/portfolio/page.tsx
components/motion/        Rise / Soft / Wipe / Rule, useParallax, useCounter
components/site/          nav, footer
components/home/          hero, marquee, about, values, compare, services,
                          gallery, how, reviews, contact
components/services/      hero, menu, steps, booking-form
components/portfolio/     grid, filters
lib/site.ts               WhatsApp helper + all copy/data arrays
public/images/            12 WebP files
```

`lib/site.ts` centralises `WHATSAPP = '919825720827'`, a `whatsappUrl(text)` helper, and the
`SERVICES` / `ADDONS` / `TIMES` / `SHADES` / `VALUES` / `GALLERY` / `STEPS` / `REVIEWS` /
`PORTFOLIO_ITEMS` arrays, so copy and pricing live in one place.

Internal links are rewritten from the export's `.dc.html` filenames to routes
(`Services.dc.html` → `/services`, `Portfolio.dc.html` → `/portfolio`); hash links unchanged.

### Homepage section order

hero → marquee → about (01 The motto) → values (02, 5 rows) → compare (03 The difference) →
services (04, 4-item accordion + add-on chips) → gallery (05) → how it works (06, 4 steps) →
reviews (07, 3 quotes) → contact → footer.

### Booking form (`/services`)

Ports the exported state machine exactly: service select, people stepper (1–6), date, time-slot
chips, add-on chips, and name / phone / email / area / address / notes. Pricing follows the export —
`base = price × people`, `addons = Σ × people`, **15% group discount when people > 1**, travel
included. Validation requires name, a 10-digit phone, address, date and time; the summary total
pulses (1.12→1) whenever it changes; submit opens `wa.me` with the prefilled multi-line summary.
Clicking a service card sets the service and smooth-scrolls to `#book`.

Pricing (from the export): Gel Manicure ₹899 / 60min · Builder Gel (BIAB) ₹1,499 / 90min ·
Gel Extensions ₹2,499 / 120min · Custom Nail Art ₹3,999 / 150min. Add-ons: Gel removal ₹299 ·
Chrome finish ₹399 · Per-nail art ₹99 · Gel pedicure ₹1,099 · Nail repair ₹149.
Time slots: 9–11 AM · 11 AM–1 PM · 1–4 PM · 4–7 PM · 7–9 PM.

### Portfolio (per decisions 1 & 2)

Exported layout, spans, filter bar and motion — recoloured to brand tokens. Renders the 4 sourced
sets; the header counter animates to **4**, not 12. Filter tabs derive from the items array, so only
`All / Manicure / Nail Art` show while `p-5…p-12` are missing, and `Extensions` / `Bridal` reappear
by themselves once those photos are added. No dead tabs, no invented imagery.

---

## 5. Verification

1. `npm run dev`, then walk `/`, `/services`, `/portfolio` against the three exported HTML files
   opened side by side (the export renders standalone in a browser).
2. Check each at **375px, 900px and 1440px** — the widths that straddle every breakpoint the export
   defines — confirming the 1000px and 760px rules (hero stacks, nav links hide, swatches scroll,
   services toggle re-columns, steps go 4→2→1, gallery snap-scrolls) all fire.
3. Exercise interaction: shade swatches, accordion, gallery scroll, review dots, portfolio filters,
   burger menu.
4. Booking form: verify totals incl. the 15% multi-person discount, validation messages, and that
   submit opens WhatsApp at `919825720827` with a correctly formatted summary.
5. Confirm reduced-motion (OS setting) disables reveals and auto-advance.
6. `npm run build` for a clean type-check and production build.

## 6. Known deviations to report at self-review

- Portfolio recoloured to brand tokens (approved) — the only page whose exported colors change.
- Portfolio shows 4 sets / counter 4 / 3 filter tabs, because `p-5`…`p-12` have no source images.
- Reveals run on Framer Motion `whileInView` rather than CSS `animation-timeline`; same values, and
  they now also animate in Safari and Firefox, where the exported version silently did not.
- `about-photo`'s 38.06% pan is matched via `object-position` rather than the slot's absolute-
  positioning math.
- Homepage stat block reads "9 · Step booking" while the site describes a 4-step process — an
  oddity in the export's copy. Reproduced verbatim; flagging rather than silently fixing.
