/**
 * Copy, media URLs and design constants transcribed verbatim from the design export:
 * - BookMyNail v3.dc.html (Homepage)
 * - Services.dc.html (Services & Booking)
 * - Portfolio.dc.html (Gallery / Portfolio)
 */

export const DEFAULT_BOOKING_MESSAGE =
  "Hi BookMyNail, I'd like to book an appointment";

/** Fallback WhatsApp number — live number is served from settings. */
export const FALLBACK_WHATSAPP = "919825720827";

export function whatsappUrl(
  text: string = DEFAULT_BOOKING_MESSAGE,
  number: string = FALLBACK_WHATSAPP,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/** Indian-format currency, matching the export's inr() helper. */
export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** 60 → "1 hr", 150 → "2 hr 30 min". Ported from Services.dc.html. */
export function duration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  return `${h} hr${m ? ` ${m} min` : ""}`;
}

/* ── Hero Video & Services ─────────────────────────────────────────── */

export const HERO_VIDEO =
  "https://res.cloudinary.com/ts350ak2/video/upload/v1785935706/5871931-uhd_4096_2160_25fps_kxbhrk.mp4";

export const HERO_SERVICES = [
  { id: "gel", label: "Gel Manicure · ₹899", name: "Gel Manicure", price: 899, duration: "1 hr" },
  { id: "biab", label: "Builder Gel (BIAB) · ₹1,499", name: "Builder Gel", price: 1499, duration: "1 hr 30" },
  { id: "ext", label: "Gel Extensions · ₹2,499", name: "Gel Extensions", price: 2499, duration: "2 hr" },
  { id: "art", label: "Custom Nail Art · ₹3,999", name: "Custom Nail Art", price: 3999, duration: "2 hr 30" },
];

export const HERO_TRUST = [
  "Certified artists",
  "Sanitised tools, opened in front of you",
  "Travel free in Ahmedabad",
];

/* ── Marquee ───────────────────────────────────────────────────────── */

export const MARQUEE: { text: string; muted?: boolean }[] = [
  { text: "Luxury Nails. Comfort of Home." },
  { text: "SERVING AHMEDABAD", muted: true },
  { text: "Certified artists" },
  { text: "SANITISED TOOLS", muted: true },
  { text: "Premium products" },
  { text: "DOORSTEP SERVICE", muted: true },
];

/* ── Trust 4-Grid ──────────────────────────────────────────────────── */

export type TrustMetric = {
  title: string;
  subtitle: string;
  color: string;
};

export const TRUST_METRICS: TrustMetric[] = [
  { title: "Certified", subtitle: "Trained & certified artists", color: "#56203C" },
  { title: "Sanitised", subtitle: "Single-use tools, opened at your door", color: "#BF5634" },
  { title: "100%", subtitle: "At-home service across Ahmedabad", color: "#43305E" },
  { title: "4.8+", subtitle: "Rated by real clients", color: "#A85F63" },
];

/* ── Offer Banner ──────────────────────────────────────────────────── */

export const OFFER_BANNER = {
  text: "First booking this week? Get a free chrome finish upgrade on any gel set.",
  cta: "Claim at booking",
  href: "/services#book",
};

/* ── Values ────────────────────────────────────────────────────────── */

export type Value = {
  num: string;
  title: string;
  tag: string;
  body: string;
  accent: string;
};

export const VALUES: Value[] = [
  {
    num: "01",
    title: "Quality",
    tag: "Three-week hold, standard",
    body: "Professional-grade gel systems, applied with technique that lasts — not a quick fix that lifts in a week.",
    accent: "#56203C",
  },
  {
    num: "02",
    title: "Hygiene",
    tag: "Kit unsealed in front of you",
    body: "Sanitised tools every appointment, single-use files, and a clean workstation set up before we begin.",
    accent: "#3F4A52",
  },
  {
    num: "03",
    title: "Convenience",
    tag: "Slots 9 AM to 9 PM, daily",
    body: "Your time is the point. No travel, no waiting — pick a slot that suits your day and we arrive fully equipped.",
    accent: "#8E3A1F",
  },
  {
    num: "04",
    title: "Creativity",
    tag: "Designed with you, on the spot",
    body: "Chrome, cat eye, aura, glazed, French, marble, bridal — every set is drawn to your style, not picked off a poster.",
    accent: "#43305E",
  },
  {
    num: "05",
    title: "Experience",
    tag: "Aftercare notes, every time",
    body: "From the first message to aftercare advice, the whole appointment is meant to feel calm, private and unhurried.",
    accent: "#A85F63",
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
  badge?: string;
  suffix?: string;
  price: number;
  minutes: number;
  body: string;
  bullets: string[];
  bulletColor: string;
  blurb: string;
  grad: [string, string];
  cardGrad: [string, string];
  accent: string;
  /** Groups the booking menu and the admin content page. */
  category: ServiceCategory;
};

export type ServiceCategory = "nails" | "lashes" | "lash-extra";
export type AddonScope = "nails" | "lashes";

export const fullName = (s: Service) => (s.suffix ? `${s.name} ${s.suffix}` : s.name);

export type Addon = { id: string; label: string; price: number; on: AddonScope };

export const TIMES = ["9–11 AM", "11 AM–1 PM", "1–4 PM", "4–7 PM", "7–9 PM"];

export const GROUP_DISCOUNT = 0.15;

/* ── Hygiene on camera ─────────────────────────────────────────────── */

export const HYGIENE_VIDEO =
  "https://res.cloudinary.com/dxeb4jubk/video/upload/v1786649059/bookmy%20nail/nail-kit_km2j4r.mp4";

export const HYGIENE_POINTS = [
  "Single-use files and buffers, every appointment",
  "Tools sanitised and sealed until they reach your home",
  "Clean workstation set up before we begin",
];

/* ── Homepage gallery ──────────────────────────────────────────────── */

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  ratio: "3/4" | "1/1";
  radius: string;
  alignSelf?: "flex-start" | "flex-end";
};

export const GALLERY: GalleryItem[] = [
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652598/bookmy%20nail/Luxury_Indian_Bridal_Nails_%EF%B8%8F_Red_Gold_Wedding_Nail_Art_Ideas_oeesgf.jpg",
    alt: "Red & gold wedding set",
    caption: "Red & gold wedding set · Bridal nail art",
    ratio: "3/4",
    radius: "150px 150px 8px 8px",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786653045/bookmy%20nail/Stunning_Holographic_Chrome_Almond_Nails_on_Dark_Skin_isf9rf.jpg",
    alt: "Holographic chrome almond",
    caption: "Holographic chrome almond · Chrome / trend",
    ratio: "1/1",
    radius: "8px",
    alignSelf: "flex-end",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652882/bookmy%20nail/Nude_Almond_Heart_Press_On_Nails_Cute_Valentine_Nail_Design_rqpxy7.jpg",
    alt: "Nude almond with hearts",
    caption: "Nude almond with hearts · Elegant / minimalist",
    ratio: "3/4",
    radius: "8px 8px 150px 150px",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652969/bookmy%20nail/Abstract_Nail_Art_piaqz3.jpg",
    alt: "Abstract nail art",
    caption: "Abstract nail art · Creative nail art",
    ratio: "1/1",
    radius: "8px",
    alignSelf: "flex-end",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652717/bookmy%20nail/Velvet_Merlot_Nails_The_Rich_Girl_Manicure_jdipqr.jpg",
    alt: "Velvet merlot set",
    caption: "Velvet merlot set · Bridal nail art",
    ratio: "3/4",
    radius: "150px 150px 8px 8px",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786653031/bookmy%20nail/Luxury_Brown_Chrome_Aura_Nails_with_Gold_Outline___Elegant_Almond_Nail_Design_cko9nv.jpg",
    alt: "Brown chrome aura",
    caption: "Brown chrome aura · Chrome / trend",
    ratio: "1/1",
    radius: "8px",
    alignSelf: "flex-end",
  },
];

/* ── How it works ──────────────────────────────────────────────────── */

export type Step = { num: string; title: string; body: string; rule: string; numColor: string };

export const HOME_STEPS: Step[] = [
  {
    num: "01",
    title: "Choose your service",
    body: "Pick one of the four services, add any extras and set how many people are booking. Your total updates as you choose — no hidden charges.",
    rule: "#56203C",
    numColor: "#56203C",
  },
  {
    num: "02",
    title: "Pick your date and time",
    body: "Choose a day and a time window that suits you. Slots run every day, 9 AM to 9 PM, and same-day is often available.",
    rule: "#BF5634",
    numColor: "#BF5634",
  },
  {
    num: "03",
    title: "Confirm your booking",
    body: "Add your address and confirm. You get a booking reference on screen straight away, and a confirmation from your assigned artist.",
    rule: "#7B62A8",
    numColor: "#7B62A8",
  },
  {
    num: "04",
    title: "We arrive and set up",
    body: "Your artist comes to you with a sealed kit, sets up a clean workstation, and leaves your space exactly as it was.",
    rule: "#A85F63",
    numColor: "#A85F63",
  },
];

export const BOOKING_STEPS: Step[] = [
  {
    num: "01",
    title: "Choose your service",
    body: "Pick one of the four services above, add extras and set how many people. Your total updates as you go.",
    rule: "#E7A79F",
    numColor: "#E7A79F",
  },
  {
    num: "02",
    title: "Pick date and time",
    body: "Choose a day and a time window. Slots run every day, 9 AM to 9 PM, and same-day is often available.",
    rule: "#BF5634",
    numColor: "#BF5634",
  },
  {
    num: "03",
    title: "Confirm your booking",
    body: "Add your details and confirm. You get a booking reference on screen straight away — no account needed.",
    rule: "#B4A2D4",
    numColor: "#B4A2D4",
  },
  {
    num: "04",
    title: "We arrive and set up",
    body: "Your assigned artist arrives with a sealed kit, sets up a clean workstation and leaves your space as it was.",
    rule: "#9BA5AC",
    numColor: "#9BA5AC",
  },
];

/* ── Reviews ───────────────────────────────────────────────────────── */

export type Review = { quote: string; name: string; tint: [string, string] };

export const REVIEWS: Review[] = [
  {
    quote:
      "\"She set up at my dining table and I didn't move for two hours. Best manicure I've had, and I never left the house.\"",
    name: "Riya M. · Bodakdev",
    tint: ["#43305E", "#B4A2D4"],
  },
  {
    quote:
      "\"Booked the bridal art with a trial first. On the day my nails were the one thing I didn't have to worry about.\"",
    name: "Anjali P. · Satellite",
    tint: ["#56203C", "#BF5634"],
  },
  {
    quote:
      "\"The kit was opened in front of me and everything was sealed. As a new mum, having them come to me changed everything.\"",
    name: "Shreya D. · Prahlad Nagar",
    tint: ["#3F4A52", "#9BA5AC"],
  },
];

export const REVIEW_INTERVAL_MS = 5600;

/* ── FAQs ──────────────────────────────────────────────────────────── */

export type FAQItem = {
  num: string;
  q: string;
  a: string;
};

export const FAQS: FAQItem[] = [
  {
    num: "01",
    q: "Is it safe to have a nail artist come to my home?",
    a: "Yes — and it is built to be visible. Your artist arrives with tools sanitised and sealed, unseals them in front of you, uses single-use files and buffers, and sets up a clean workstation before starting. Every artist is trained and certified.",
  },
  {
    num: "02",
    q: "What should I keep ready before the artist arrives?",
    a: "Very little. A table or flat surface, a chair, and a power point within reach. We bring the lamp, the kit, the products and everything else — including something to protect your table.",
  },
  {
    num: "03",
    q: "Can I book for a group — bridal party, birthday or kitty party?",
    a: "Yes. Group bookings are common and there is a 15% discount from the second person onwards. Set the number of people in the booking form and the group rate is applied to your total automatically.",
  },
  {
    num: "04",
    q: "How does the bridal trial session work?",
    a: "The Custom Nail Art package includes a trial before the wedding day. We agree the design, length and finish at the trial, then recreate it in the final appointment so there are no surprises on the day.",
  },
  {
    num: "05",
    q: "Do you serve areas outside central Ahmedabad?",
    a: "We cover all of Ahmedabad and nearby areas, and travel is included in every price. If you are further out, enter your area in the booking form and we will confirm the slot before your appointment.",
  },
  {
    num: "06",
    q: "What if I need a repair between appointments?",
    a: "Gel Extensions include a free repair in the first week. Outside that window, a nail repair is ₹149 and Builder Gel infills are offered at a reduced rate — add it to a booking and we will fit you in.",
  },
];

/* ── Instagram Posts ───────────────────────────────────────────────── */

export const INSTAGRAM_POSTS = [
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652717/bookmy%20nail/Bridal_Red_Nude_Glam_Nails_%EF%B8%8F___Mehendi_Ready_Manicure_vi03et.jpg",
    alt: "Bridal Red Nude Glam Nails",
    href: "https://instagram.com/bookmynail",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652717/bookmy%20nail/Velvet_Merlot_Nails_The_Rich_Girl_Manicure_jdipqr.jpg",
    alt: "Velvet Merlot Nails",
    href: "https://instagram.com/bookmynail",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652603/bookmy%20nail/download_17_efxgjb.jpg",
    alt: "Bridal Detail Work",
    href: "https://instagram.com/bookmynail",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652882/bookmy%20nail/Nude_Almond_Heart_Press_On_Nails_Cute_Valentine_Nail_Design_rqpxy7.jpg",
    alt: "Nude Almond Heart Press On Nails",
    href: "https://instagram.com/bookmynail",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652969/bookmy%20nail/Abstract_Nail_Art_piaqz3.jpg",
    alt: "Abstract Nail Art",
    href: "https://instagram.com/bookmynail",
  },
  {
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786653045/bookmy%20nail/Stunning_Holographic_Chrome_Almond_Nails_on_Dark_Skin_isf9rf.jpg",
    alt: "Holographic Chrome Almond Nails",
    href: "https://instagram.com/bookmynail",
  },
];

/* ── Portfolio items ───────────────────────────────────────────────── */

export type PortfolioItem = {
  id: string;
  category: "Bridal" | "Elegant" | "Creative" | "Chrome";
  title: string;
  src: string;
  alt: string;
  radius?: string;
};

export const PORTFOLIO_CATEGORIES = ["All", "Bridal", "Elegant", "Creative", "Chrome"] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  Bridal: "Bridal nail art",
  Elegant: "Elegant / minimalist",
  Creative: "Creative nail art",
  Chrome: "Chrome / trend",
};

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "b1",
    category: "Bridal",
    title: "Red & nude bridal glam",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652717/bookmy%20nail/Bridal_Red_Nude_Glam_Nails_%EF%B8%8F___Mehendi_Ready_Manicure_vi03et.jpg",
    alt: "Red & nude bridal glam",
  },
  {
    id: "b2",
    category: "Bridal",
    title: "Velvet merlot set",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652717/bookmy%20nail/Velvet_Merlot_Nails_The_Rich_Girl_Manicure_jdipqr.jpg",
    alt: "Velvet merlot set",
  },
  {
    id: "b3",
    category: "Bridal",
    title: "Bridal detail work",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652603/bookmy%20nail/download_17_efxgjb.jpg",
    alt: "Bridal detail work",
  },
  {
    id: "b4",
    category: "Bridal",
    title: "Red & gold wedding set",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652598/bookmy%20nail/Luxury_Indian_Bridal_Nails_%EF%B8%8F_Red_Gold_Wedding_Nail_Art_Ideas_oeesgf.jpg",
    alt: "Red & gold wedding set",
  },
  {
    id: "b5",
    category: "Bridal",
    title: "Matched to the lehenga",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652561/bookmy%20nail/_Your_lehenga_called_it_wants_these_nails_uidgsf.jpg",
    alt: "Matched to the lehenga",
  },
  {
    id: "b6",
    category: "Bridal",
    title: "Maroon, red & gold festive",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652546/bookmy%20nail/Ultimate_Bridal_Festive_Nail_Designs___Maroon_Red_Gold_Elegance_dlvhau.jpg",
    alt: "Maroon, red & gold festive",
  },
  {
    id: "e1",
    category: "Elegant",
    title: "Nude almond with hearts",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652882/bookmy%20nail/Nude_Almond_Heart_Press_On_Nails_Cute_Valentine_Nail_Design_rqpxy7.jpg",
    alt: "Nude almond with hearts",
  },
  {
    id: "e2",
    category: "Elegant",
    title: "Clean minimal set",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652881/bookmy%20nail/download_18_tl7eem.jpg",
    alt: "Clean minimal set",
  },
  {
    id: "e3",
    category: "Elegant",
    title: "Soft everyday finish",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652879/bookmy%20nail/download_19_xxbmt0.jpg",
    alt: "Soft everyday finish",
  },
  {
    id: "c1",
    category: "Creative",
    title: "Abstract nail art",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652969/bookmy%20nail/Abstract_Nail_Art_piaqz3.jpg",
    alt: "Abstract nail art",
  },
  {
    id: "c2",
    category: "Creative",
    title: "Hand-drawn detail",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652967/bookmy%20nail/download_20_ginq6v.jpg",
    alt: "Hand-drawn detail",
  },
  {
    id: "c3",
    category: "Creative",
    title: "Evil eye set",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652966/bookmy%20nail/Unhas_Decoradas_Olho_Grego_dlfnby.jpg",
    alt: "Evil eye set",
  },
  {
    id: "h1",
    category: "Chrome",
    title: "Holographic chrome almond",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786653045/bookmy%20nail/Stunning_Holographic_Chrome_Almond_Nails_on_Dark_Skin_isf9rf.jpg",
    alt: "Holographic chrome almond",
  },
  {
    id: "h2",
    category: "Chrome",
    title: "Brown chrome aura, gold outline",
    src: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786653031/bookmy%20nail/Luxury_Brown_Chrome_Aura_Nails_with_Gold_Outline___Elegant_Almond_Nail_Design_cko9nv.jpg",
    alt: "Brown chrome aura, gold outline",
  },
];
