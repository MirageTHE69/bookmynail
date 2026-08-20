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

export const SEED_PORTFOLIO = [
  {
    id: "b1",
    category: "Bridal",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652717/bookmy%20nail/Bridal_Red_Nude_Glam_Nails_%EF%B8%8F___Mehendi_Ready_Manicure_vi03et.jpg",
    span: 1,
    sortOrder: 0,
  },
  {
    id: "b2",
    category: "Bridal",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652717/bookmy%20nail/Velvet_Merlot_Nails_The_Rich_Girl_Manicure_jdipqr.jpg",
    span: 1,
    sortOrder: 1,
  },
  {
    id: "b3",
    category: "Bridal",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652603/bookmy%20nail/download_17_efxgjb.jpg",
    span: 1,
    sortOrder: 2,
  },
  {
    id: "b4",
    category: "Bridal",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652598/bookmy%20nail/Luxury_Indian_Bridal_Nails_%EF%B8%8F_Red_Gold_Wedding_Nail_Art_Ideas_oeesgf.jpg",
    span: 1,
    sortOrder: 3,
  },
  {
    id: "b5",
    category: "Bridal",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652561/bookmy%20nail/_Your_lehenga_called_it_wants_these_nails_uidgsf.jpg",
    span: 1,
    sortOrder: 4,
  },
  {
    id: "b6",
    category: "Bridal",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652546/bookmy%20nail/Ultimate_Bridal_Festive_Nail_Designs___Maroon_Red_Gold_Elegance_dlvhau.jpg",
    span: 1,
    sortOrder: 5,
  },
  {
    id: "e1",
    category: "Elegant",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652882/bookmy%20nail/Nude_Almond_Heart_Press_On_Nails_Cute_Valentine_Nail_Design_rqpxy7.jpg",
    span: 1,
    sortOrder: 6,
  },
  {
    id: "e2",
    category: "Elegant",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652881/bookmy%20nail/download_18_tl7eem.jpg",
    span: 1,
    sortOrder: 7,
  },
  {
    id: "e3",
    category: "Elegant",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652879/bookmy%20nail/download_19_xxbmt0.jpg",
    span: 1,
    sortOrder: 8,
  },
  {
    id: "c1",
    category: "Creative",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652969/bookmy%20nail/Abstract_Nail_Art_piaqz3.jpg",
    span: 1,
    sortOrder: 9,
  },
  {
    id: "c2",
    category: "Creative",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652967/bookmy%20nail/download_20_ginq6v.jpg",
    span: 1,
    sortOrder: 10,
  },
  {
    id: "c3",
    category: "Creative",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786652966/bookmy%20nail/Unhas_Decoradas_Olho_Grego_dlfnby.jpg",
    span: 1,
    sortOrder: 11,
  },
  {
    id: "h1",
    category: "Chrome",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786653045/bookmy%20nail/Stunning_Holographic_Chrome_Almond_Nails_on_Dark_Skin_isf9rf.jpg",
    span: 1,
    sortOrder: 12,
  },
  {
    id: "h2",
    category: "Chrome",
    imageUrl: "https://res.cloudinary.com/dxeb4jubk/image/upload/v1786653031/bookmy%20nail/Luxury_Brown_Chrome_Aura_Nails_with_Gold_Outline___Elegant_Almond_Nail_Design_cko9nv.jpg",
    span: 1,
    sortOrder: 13,
  },
];

export const SEED_SETTINGS: Record<string, string> = {
  whatsapp: "919825720827",
  instagram: "https://instagram.com/bookmynail",
  serviceArea: "Ahmedabad and nearby areas\nTravel included in every price",
  hours: "Every day, 9:00 AM – 9:00 PM\nSame-day slots when available",
  /** Days of analytics history to retain; older events are pruned. */
  eventRetentionDays: "180",
};
