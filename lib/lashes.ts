/**
 * Lash menu presentation data, transcribed verbatim from
 * `BookMyNail website design/Services.dc.html`.
 *
 * Pricing that is *bookable* lives in the database (services table, categories
 * `lashes` and `lash-extra`) so it stays admin-editable. What lives here is the
 * design content that drives the look picker: eye-mapping curves, tier density
 * and the per-look set combinations.
 */

export type LashTierId = "classic" | "hybrid" | "volume" | "russian";

export type LashTier = {
  name: string;
  minutes: number;
  /** Bar heights in the density diagram — more bars means more fans. */
  bars: number[];
  weight: number;
};

export const LASH_TIERS: Record<LashTierId, LashTier> = {
  classic: { name: "Classic", minutes: 90, bars: [7, 11, 8], weight: 1 },
  hybrid: { name: "Hybrid", minutes: 120, bars: [8, 13, 10, 7], weight: 2 },
  volume: { name: "Volume", minutes: 150, bars: [9, 15, 12, 9, 7], weight: 3 },
  russian: { name: "Russian & Mega", minutes: 180, bars: [10, 18, 15, 12, 9, 7], weight: 4 },
};

export type LashSet = {
  tier: LashTierId;
  style: string;
  detail: string;
  price: number;
};

export type LashLook = {
  id: string;
  name: string;
  blurb: string;
  dot: string;
  accent: string;
  /** Where the length sits along the lash line. */
  where: string;
  /** Nine relative lash lengths, inner corner → outer corner. */
  map: number[];
  sets: LashSet[];
};

export const LASH_LOOKS: LashLook[] = [
  {
    id: "natural",
    name: "Natural",
    blurb: "Clean, everyday mascara effect",
    dot: "linear-gradient(140deg,#A85F63,#F7EDE4)",
    accent: "#A85F63",
    where: "Even through the lash line",
    map: [0.42, 0.54, 0.66, 0.76, 0.82, 0.84, 0.8, 0.7, 0.56],
    sets: [
      { tier: "classic", style: "Classic Natural", detail: "One extension per natural lash", price: 2499 },
      { tier: "hybrid", style: "Hybrid Natural", detail: "Classic base with volume texture through it", price: 3299 },
    ],
  },
  {
    id: "cat",
    name: "Cat Eye",
    blurb: "Elongated, lifted outer corners",
    dot: "linear-gradient(140deg,#56203C,#BF5634)",
    accent: "#BF5634",
    where: "Length built to the outer corner",
    map: [0.3, 0.38, 0.46, 0.56, 0.68, 0.79, 0.9, 0.97, 1],
    sets: [
      { tier: "classic", style: "Classic Cat Eye", detail: "Length built toward the outer corner", price: 2799 },
      { tier: "hybrid", style: "Hybrid Cat Eye", detail: "Wispy, lifted and elongated", price: 3499 },
      { tier: "volume", style: "Volume Cat Eye", detail: "Fuller and more elongated", price: 3999 },
      { tier: "russian", style: "Russian Cat Eye", detail: "Russian density on cat-eye mapping", price: 4799 },
      { tier: "russian", style: "Mega Russian Cat Eye", detail: "Ultra-glam, editorial finish", price: 5999 },
    ],
  },
  {
    id: "doll",
    name: "Doll Eye",
    blurb: "Open, rounded, brighter eyes",
    dot: "linear-gradient(140deg,#43305E,#E3D8F0)",
    accent: "#43305E",
    where: "Longest through the centre",
    map: [0.36, 0.5, 0.68, 0.86, 1, 0.94, 0.78, 0.6, 0.44],
    sets: [
      { tier: "classic", style: "Classic Doll Eye", detail: "Length through the centre to open the eye", price: 2799 },
      { tier: "hybrid", style: "Hybrid Doll Eye", detail: "Fuller centre, open-eye effect", price: 3499 },
      { tier: "volume", style: "Volume Doll Eye", detail: "Dramatic but still eye-opening", price: 3999 },
    ],
  },
  {
    id: "wispy",
    name: "Wispy",
    blurb: "Soft, feathery and feminine",
    dot: "linear-gradient(140deg,#8E3A1F,#F0C3A6)",
    accent: "#8E3A1F",
    where: "Alternating spikes for a feathered edge",
    map: [0.4, 0.72, 0.46, 0.86, 0.54, 0.96, 0.6, 0.88, 0.5],
    sets: [
      { tier: "classic", style: "Wispy Classic", detail: "Alternating lengths for a feathered edge", price: 2999 },
      { tier: "volume", style: "Wispy Volume", detail: "Fluffy, soft and camera-friendly", price: 4299 },
    ],
  },
];

/** Textures that need no eye mapping — priced flat. */
export const LASH_SIGNATURE = [
  { name: "Wet Look / Kim K", price: 3699, looks: ["natural", "cat", "doll", "wispy"] },
  { name: "Russian Volume", price: 4499, looks: ["natural", "doll", "wispy"] },
  { name: "Mega Volume", price: 5499, looks: ["natural", "cat", "doll", "wispy"] },
];

/** The three timing facts shown beside the eye map. */
export const LASH_FACTS = [
  { value: "2–3 wks", label: "Between infills" },
  { value: "6–8 wks", label: "A full set, with infills" },
  { value: "24 hrs", label: "Keep dry after fitting" },
];

export const LASH_AFTERCARE = [
  "No water, steam or sweat for the first 24 hours",
  "Skip oil-based cleansers, removers and creams near the eye",
  "Brush through with the spoolie we leave you, once a day",
  "Sleep on your back where you can; no lash curlers or mascara",
  "Book your infill at 2–3 weeks to keep the set full",
];
