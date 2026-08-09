# BookMyNail — Website Build Task (Next.js)

## Context

BookMyNail is an at-home/mobile nail art service operating in Vadodara and
Ahmedabad, India. This repo is for the marketing website. The full visual
design has already been created in Claude Design and exported as a ZIP into
this project folder — **do not invent or restyle anything**. Your job is to
reproduce that design exactly in code, not to reinterpret it.

## Design Source

- The design export is unzipped at: `./design-export/` (confirm the exact
  path before starting — adjust if it landed somewhere else)
- Pages in the export:
  - `BookMyNail v3.dc.html` — homepage: hero → about → values → services
    → gallery → how-it-works → reviews → contact
  - `Services.dc.html` — services page
  - `Portfolio.dc.html` — portfolio/gallery page
- **All colors, fonts, spacing, and type scale are already defined as CSS
  custom properties inline in the page files — do not hard-code hex values
  or invent a palette.** Read the `:root` variables directly from
  `BookMyNail v3.dc.html` (and the other pages) and carry them into
  `tailwind.config` as-is:
  - `--bone`, `--ink`, `--blush`, `--terracotta`, `--plum`, `--lilac`,
    `--chrome` (colors)
  - `--display` → Bodoni Moda (headlines), `--body` → Archivo (body/UI)
- `_ds/modernist-*/styles.css` is a generic base design-system stylesheet
  bundled by the design tool — it is **not** the BookMyNail palette (it's a
  red/white starter template). Ignore its color tokens; only use its
  component patterns (buttons, cards, forms, nav, etc.) as structural
  reference if the actual page markup doesn't already show a pattern.
- `image-slot.js` / `video-slot.js` are the design tool's placeholder media
  components (drag-drop image/video slots), not real HTML. Every
  `<image-slot>` / `<video-slot>` in the export needs to become a real
  Next.js `<Image>` component or `<video>` tag. Check
  `.image-slots.state.json` for any reference to the actual images used —
  flag any slot you can't find a real source image for instead of using a
  stock placeholder.
- Treat every file in that folder as the single source of truth: layout,
  spacing, type sizes, breakpoints, copy, icons, and any interaction/scroll
  animation already implied in the markup (e.g. `data-values`,
  `data-reviews` attributes suggest scripted behavior — check for
  associated JS before rebuilding from scratch).
- If the export includes multiple screen sizes (mobile/tablet/desktop),
  match all of them — don't guess responsive behavior that isn't shown.
- If something in the export is ambiguous (e.g. a hover or scroll state
  isn't obvious from static markup), stop and ask rather than guessing.

## Brand Reference (context only — not a substitute for reading the actual tokens)

- **Name:** BookMyNail — "Luxury nails, at your door."
- **Positioning line:** "Salon polish, without the salon."
- **Voice:** Editorial, warm, tactile, considered, calm — feminine without
  being sweet.

## Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** Tailwind CSS — pull exact values (colors, spacing, font
  sizes, radii) from the CSS custom properties inline in the `.dc.html`
  files rather than Tailwind's defaults; extend `tailwind.config` with
  those tokens directly (e.g. `bone`, `ink`, `blush`, `terracotta`, `plum`,
  `lilac`, `chrome`)
- **Fonts:** Bodoni Moda + Archivo via `next/font/google`
- **Animation:** Framer Motion for page/section transitions and micro
  interactions (button hovers, card reveals, scroll-triggered fades) —
  match whatever motion is implied or spec'd in the design export; keep
  it subtle and consistent with the calm/editorial brand voice, not flashy
- **Images:** `next/image` for all imagery, properly sized/optimized

## Task Checklist

1. Read `BookMyNail v3.dc.html`, `Services.dc.html`, and `Portfolio.dc.html`
   in full first — note every `:root` CSS variable, every section, and
   every `<image-slot>` / `<video-slot>` before writing any code
2. Set up the Next.js + TypeScript + Tailwind project structure
3. Add Bodoni Moda and Archivo via `next/font`, and port the exact `:root`
   tokens from the export into `tailwind.config` (colors, type scale)
4. Build each section as its own component — homepage first
   (hero/about/values/services/gallery/how/reviews/contact), then Services
   and Portfolio as separate routes — matching the export pixel-for-pixel
5. Replace every `<image-slot>` / `<video-slot>` with a real
   `next/image` component or `<video>` tag; flag any slot with no
   identifiable source image instead of substituting a stock photo
6. Implement responsive behavior for all breakpoints shown in the export
7. Add animations/transitions matching what the markup implies (e.g.
   `data-values`, `data-reviews` sections) — keep it subtle and consistent
   with the calm/editorial brand voice, not flashy
8. Wire up the booking CTA(s) as functional components (form or WhatsApp
   link — confirm which before building)
9. Self-review: compare rendered output side-by-side against the three
   exported pages and list any deviations before calling this done

## Non-Negotiables

- Match the design exactly — no substituting layout, colors, type, or
  copy with "close enough" defaults
- Ask before guessing on anything the design export doesn't make clear
- Keep animation subtle — this is a luxury/editorial brand, not a playful one
- Fully responsive, mobile-first (most bookings will come from mobile)

## Deliverable

A working Next.js site, running locally (`npm run dev`), matching the
Claude Design export section-by-section, with the animations described
above, ready for review before deployment.