/**
 * The original content from the design export, now used only to seed the
 * database on first run. After seeding, the admin panel is the source of truth
 * — edit records in `/admin/content`, not this file.
 */

export const SEED_SERVICES = [
  {
    id: "gel",
    num: "01",
    name: "Gel Manicure",
    suffix: null,
    price: 899,
    minutes: 60,
    body: "A clean, long-wear gel set. Shape, cuticle work and a flawless colour coat that stays glossy for two to three weeks without chipping.",
    bullets: [
      "Shape, file and cuticle care",
      "Any shade from our full colour kit",
      "Hand massage and cuticle oil finish",
    ],
    bulletColor: "#BF5634",
    blurb:
      "Shape, cuticle work and a long-wear colour coat that stays glossy for two to three weeks.",
    gradFrom: "#A85F63",
    gradTo: "#F7EDE4",
    cardGradFrom: "#A85F63",
    cardGradTo: "#F7EDE4",
    accent: "#A85F63",
    sortOrder: 0,
  },
  {
    id: "biab",
    num: "02",
    name: "Builder Gel",
    suffix: "(BIAB)",
    price: 1499,
    minutes: 90,
    body: "Strength for your natural nails. A flexible builder layer that protects weak or peeling nails while they grow, finished in colour or a clean natural gloss.",
    bullets: [
      "Builder gel overlay on natural nails",
      "Four to five weeks of wear",
      "Infill appointments at a reduced rate",
    ],
    bulletColor: "#BF5634",
    blurb:
      "A flexible builder layer that protects weak nails while they grow. Four to five weeks of wear.",
    gradFrom: "#8E3A1F",
    gradTo: "#F0C3A6",
    cardGradFrom: "#8E3A1F",
    cardGradTo: "#F0C3A6",
    accent: "#BF5634",
    sortOrder: 1,
  },
  {
    id: "ext",
    num: "03",
    name: "Gel Extensions",
    suffix: null,
    price: 2499,
    minutes: 120,
    body: "Length, shape and structure built to your hands. Choose almond, coffin, square or stiletto — sculpted on tips and finished in the colour or art you want.",
    bullets: [
      "Any length and shape you like",
      "Gel colour or French finish included",
      "Free repair in the first week",
    ],
    bulletColor: "#56203C",
    blurb:
      "Length and shape built to your hands — almond, coffin, square or stiletto, finished in colour.",
    gradFrom: "#43305E",
    gradTo: "#B4A2D4",
    cardGradFrom: "#43305E",
    cardGradTo: "#E3D8F0",
    accent: "#43305E",
    sortOrder: 2,
  },
  {
    id: "art",
    num: "04",
    name: "Custom Nail Art",
    suffix: null,
    price: 3999,
    minutes: 150,
    body: "The full artistry appointment, and the one brides book. Extensions, hand-drawn detail and embellishment, with a trial session before the day itself.",
    bullets: [
      "Chrome, cat eye, aura, marble or glazed",
      "Hand-set stones and foil detail",
      "Bridal trial session included",
    ],
    bulletColor: "#BF5634",
    blurb:
      "The full artistry appointment. Extensions, hand-drawn detail and embellishment, bridal trial included.",
    gradFrom: "#56203C",
    gradTo: "#BF5634",
    cardGradFrom: "#56203C",
    cardGradTo: "#BF5634",
    accent: "#56203C",
    sortOrder: 3,
  },
];

export const SEED_ADDONS = [
  { id: "removal", label: "Gel removal", price: 299, sortOrder: 0 },
  { id: "chrome", label: "Chrome finish", price: 399, sortOrder: 1 },
  { id: "art", label: "Per-nail art", price: 99, sortOrder: 2 },
  { id: "pedi", label: "Gel pedicure", price: 1099, sortOrder: 3 },
  { id: "repair", label: "Nail repair", price: 149, sortOrder: 4 },
];

/**
 * The export defines twelve tiles but only supplied artwork for these four.
 * New items can now be uploaded through the admin panel.
 */
export const SEED_PORTFOLIO = [
  { id: "p-1", imageUrl: "/images/pf-1.webp", category: "Manicure", span: 2, sortOrder: 0 },
  { id: "p-2", imageUrl: "/images/pf-2.webp", category: "Manicure", span: 1, sortOrder: 1 },
  { id: "p-3", imageUrl: "/images/pf-3.webp", category: "Nail Art", span: 1, sortOrder: 2 },
  { id: "p-4", imageUrl: "/images/pf-4.webp", category: "Nail Art", span: 2, sortOrder: 3 },
];

export const SEED_SETTINGS: Record<string, string> = {
  whatsapp: "919825720827",
  instagram: "https://instagram.com/bookmynail",
  serviceArea: "Ahmedabad and nearby areas\nTravel included in every price",
  hours: "Every day, 9:00 AM – 9:00 PM\nSame-day slots when available",
  /** Days of analytics history to retain; older events are pruned. */
  eventRetentionDays: "180",
};
