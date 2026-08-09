/**
 * Copy and design values transcribed from the design export.
 *
 * Services, add-ons, portfolio items and site settings now live in the database
 * and are edited through `/admin` — see `lib/queries.ts`. What remains here is
 * the fixed editorial content plus pure helpers.
 */

export const DEFAULT_BOOKING_MESSAGE =
  "Hi BookMyNail, I'd like to book an appointment";

/** Fallback only — the live number comes from settings via `useSettings()`. */
export const FALLBACK_WHATSAPP = "919825720827";

export function whatsappUrl(
  text: string = DEFAULT_BOOKING_MESSAGE,
  number: string = FALLBACK_WHATSAPP,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Indian-format currency, matching the export's `inr()` helper. */
export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** 60 → "1 hr", 150 → "2 hr 30 min". Ported from Services.dc.html. */
export function duration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  return `${h} hr${m ? ` ${m} min` : ""}`;
}

/* ── Hero shade picker ─────────────────────────────────────────────── */

export type Shade = {
  name: string;
  a: string;
  b: string;
  c: string;
  d: string;
};

export const SHADES: Shade[] = [
  { name: "Plum Noir", a: "#56203C", b: "#8A3A3C", c: "#BF5634", d: "#E7A79F" },
  { name: "Terracotta Glaze", a: "#8E3A1F", b: "#BF5634", c: "#DC8A63", d: "#F0C3A6" },
  { name: "Blush Milk", a: "#A85F63", b: "#E7A79F", c: "#F2C9BE", d: "#F7EDE4" },
  { name: "Lilac Aura", a: "#43305E", b: "#7B62A8", c: "#B4A2D4", d: "#E3D8F0" },
  { name: "Chrome Mirror", a: "#3F4A52", b: "#6E7C85", c: "#9BA5AC", d: "#D9DEE1" },
];

export const shadeWash = (s: Shade) =>
  `linear-gradient(145deg, ${s.a} 0%, ${s.b} 42%, ${s.c} 74%, ${s.d} 100%)`;

/** Each swatch button is a two-stop version of its own wash. */
export const shadeDot = (s: Shade) => `linear-gradient(140deg,${s.a},${s.d})`;

/* ── Marquee ───────────────────────────────────────────────────────── */

export const MARQUEE: { text: string; muted?: boolean }[] = [
  { text: "Luxury Nails. Comfort of Home." },
  { text: "SERVING AHMEDABAD", muted: true },
  { text: "Certified artists" },
  { text: "SANITISED TOOLS", muted: true },
  { text: "Premium products" },
  { text: "DOORSTEP SERVICE", muted: true },
];

/* ── Values ────────────────────────────────────────────────────────── */

export type Value = {
  num: string;
  title: string;
  body: string;
  /** Row swatch gradient. */
  dot: [string, string];
  /** Section wash tint while this row is in view. */
  tint: [string, string];
  /** Colour of the rule that grows in under the row. */
  rule: string;
};

export const VALUES: Value[] = [
  {
    num: "01",
    title: "Quality",
    body: "Professional-grade gel systems and premium products, applied with technique that lasts — not a quick fix that lifts in a week.",
    dot: ["#56203C", "#BF5634"],
    tint: ["#56203C", "#BF5634"],
    rule: "#E7A79F",
  },
  {
    num: "02",
    title: "Hygiene",
    body: "Sanitised tools for every appointment, single-use files, and a clean workstation set up in your home before we begin.",
    dot: ["#3F4A52", "#D9DEE1"],
    tint: ["#3F4A52", "#9BA5AC"],
    rule: "#9BA5AC",
  },
  {
    num: "03",
    title: "Convenience",
    body: "Your time is the point. No travel, no waiting — pick a slot that suits your day and we arrive fully equipped.",
    dot: ["#8E3A1F", "#F0C3A6"],
    tint: ["#8E3A1F", "#F0C3A6"],
    rule: "#BF5634",
  },
  {
    num: "04",
    title: "Creativity",
    body: "Chrome, cat eye, aura, glazed, French, marble, bridal — every set is drawn to your style, not picked off a poster.",
    dot: ["#43305E", "#E3D8F0"],
    tint: ["#43305E", "#B4A2D4"],
    rule: "#B4A2D4",
  },
  {
    num: "05",
    title: "Experience",
    body: "From the first message to aftercare advice, the whole appointment is meant to feel calm, private and unhurried.",
    dot: ["#A85F63", "#F7EDE4"],
    tint: ["#A85F63", "#F7EDE4"],
    rule: "#E7A79F",
  },
];

/* ── Salon vs BookMyNail comparison ────────────────────────────────── */

export const SALON_POINTS = [
  "You travel across the city and park",
  "You wait for a chair to open up",
  "Your slot fits their schedule",
  "Shared tools, shared space",
];

export const BMN_POINTS = [
  "The artist comes to your door",
  "Your appointment starts on time",
  "You choose the day and hour",
  "Sanitised kit, opened in front of you",
];

/* ── Services ──────────────────────────────────────────────────────── */

export type Service = {
  id: string;
  num: string;
  name: string;
  /** Rendered small and muted beside the name, e.g. "(BIAB)". */
  suffix?: string;
  price: number;
  minutes: number;
  /** Homepage accordion copy. */
  body: string;
  bullets: string[];
  /** Bullet rule colour on the homepage accordion. */
  bulletColor: string;
  /** Services-page card copy. */
  blurb: string;
  grad: [string, string];
  /** Services-page card gradient uses a lighter second stop for 02/03. */
  cardGrad: [string, string];
  accent: string;
};

/** "Builder Gel" + "(BIAB)" — the Services page uses the joined form throughout. */
export const fullName = (s: Service) => (s.suffix ? `${s.name} ${s.suffix}` : s.name);

export type Addon = { id: string; label: string; price: number };

export const TIMES = ["9–11 AM", "11 AM–1 PM", "1–4 PM", "4–7 PM", "7–9 PM"];

/** Applied when more than one person is booked. */
export const GROUP_DISCOUNT = 0.15;

/* ── Homepage gallery ──────────────────────────────────────────────── */

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  /** The export alternates 3/4 and 1/1 cards, offsetting the square ones. */
  ratio: "3/4" | "1/1";
  radius: string;
  low?: boolean;
};

export const GALLERY: GalleryItem[] = [
  {
    src: "/images/gal-chrome.webp",
    alt: "Chrome set",
    caption: "Chrome mirror · Extensions",
    ratio: "3/4",
    radius: "150px 150px 8px 8px",
  },
  {
    src: "/images/gal-glazed.webp",
    alt: "Glazed set",
    caption: "Glazed donut · Gel manicure",
    ratio: "1/1",
    radius: "8px",
    low: true,
  },
  {
    src: "/images/gal-aura.webp",
    alt: "Aura nails",
    caption: "Aura fade · Custom art",
    ratio: "3/4",
    radius: "8px 8px 150px 150px",
  },
  {
    src: "/images/gal-bridal.webp",
    alt: "Bridal set",
    caption: "Bridal detail · Custom art",
    ratio: "1/1",
    radius: "8px",
    low: true,
  },
  {
    src: "/images/gal-cateye.webp",
    alt: "Cat eye set",
    caption: "Cat eye · Builder gel",
    ratio: "3/4",
    radius: "150px 150px 8px 8px",
  },
  {
    src: "/images/gal-french.webp",
    alt: "French set",
    caption: "Micro French · Gel manicure",
    ratio: "1/1",
    radius: "8px",
    low: true,
  },
];

export const HERO_VIDEO =
  "https://res.cloudinary.com/ts350ak2/video/upload/v1785935706/5871931-uhd_4096_2160_25fps_kxbhrk.mp4";

/* ── How it works ──────────────────────────────────────────────────── */

export type Step = { num: string; title: string; body: string; rule: string; numColor: string };

export const HOME_STEPS: Step[] = [
  {
    num: "01",
    title: "Message us",
    body: "Send a WhatsApp with the service you want and a date that suits you. Screenshots of inspiration welcome.",
    rule: "#56203C",
    numColor: "#56203C",
  },
  {
    num: "02",
    title: "Confirm the slot",
    body: "We check the artist's calendar, confirm your time and share the final price before anything is booked.",
    rule: "#BF5634",
    numColor: "#BF5634",
  },
  {
    num: "03",
    title: "We come to you",
    body: "Your artist arrives with a full kit and sets up a clean workstation wherever you're comfortable.",
    rule: "#B4A2D4",
    numColor: "#7B62A8",
  },
  {
    num: "04",
    title: "Aftercare, then repeat",
    body: "We pack up, leave your space as we found it, and send aftercare notes plus a reminder for your infill.",
    rule: "#E7A79F",
    numColor: "#A85F63",
  },
];

export const BOOKING_STEPS: Step[] = [
  {
    num: "01",
    title: "Choose your service",
    body: "Pick one of the four services above and any add-ons. The form keeps a running total as you go.",
    rule: "#E7A79F",
    numColor: "#E7A79F",
  },
  {
    num: "02",
    title: "Fill in your details",
    body: "Name, number, address and how many people are getting their nails done. Two minutes, no account needed.",
    rule: "#BF5634",
    numColor: "#BF5634",
  },
  {
    num: "03",
    title: "Send the request",
    body: "Your summary opens in WhatsApp, already written. Send it and we reply within a couple of hours.",
    rule: "#B4A2D4",
    numColor: "#B4A2D4",
  },
  {
    num: "04",
    title: "We confirm and arrive",
    body: "Once the slot is confirmed, your artist arrives with a sealed kit and sets up wherever suits you.",
    rule: "#9BA5AC",
    numColor: "#9BA5AC",
  },
];

/* ── Reviews ───────────────────────────────────────────────────────── */

export type Review = { quote: string; name: string; tint: [string, string] };

export const REVIEWS: Review[] = [
  {
    quote:
      "“She set up at my dining table and I didn't move for two hours. Best manicure I've had, and I never left the house.”",
    name: "Riya M. · Bodakdev",
    tint: ["#43305E", "#B4A2D4"],
  },
  {
    quote:
      "“Booked the bridal art with a trial first. On the day my nails were the one thing I didn't have to worry about.”",
    name: "Anjali P. · Satellite",
    tint: ["#56203C", "#BF5634"],
  },
  {
    quote:
      "“The kit was opened in front of me and everything was sealed. As a new mum, having them come to me changed everything.”",
    name: "Shreya D. · Prahlad Nagar",
    tint: ["#3F4A52", "#9BA5AC"],
  },
];

export const REVIEW_INTERVAL_MS = 5600;

/* ── Portfolio ─────────────────────────────────────────────────────── */

export type PortfolioItem = {
  id: string;
  src: string;
  category: string;
  /** Row span in the masonry grid when the "All" filter is active. */
  span: 1 | 2;
};
