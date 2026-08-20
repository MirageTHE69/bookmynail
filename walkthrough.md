# BookMyNail Design Implementation Walkthrough

We have updated the **BookMyNail** website to match the design from the `BookMyNail website design` folder with high visual fidelity.

---

## 🎨 Visual System & Brand Tokens

The implementation reproduces the exact design tokens and typography:
- **Background Ground**: Bone (`#FFFFFF`) / Shell (`#F4EEE7`) with Shell Lines (`rgba(26,22,20,0.14)`)
- **Primary Ink**: `#1A1614`
- **Brand Palette**:
  - Blush (`#E7A79F`)
  - Terracotta (`#BF5634`)
  - Plum (`#56203C`)
  - Lilac (`#B4A2D4`)
  - Chrome (`#9BA5AC`)
- **Luxury Gradients**:
  - Hero & Contact: `linear-gradient(150deg, #56203C 0%, #8A3A3C 46%, #BF5634 78%, #E7A79F 100%)`
  - Portfolio Header: `linear-gradient(150deg, #56203C 0%, #8A3A3C 46%, #BF5634 78%, #E7A79F 100%)`
  - Services Header & Portfolio CTA: `linear-gradient(150deg, #43305E 0%, #7B62A8 38%, #BF5634 76%, #E7A79F 100%)`
- **Typography**:
  - `Bodoni Moda` (400 / 500 / Italic) for high-fashion editorial headlines and numbers
  - `Archivo` (400 / 500 / 600) for clean body copy, badges, and UI controls

---

## 🚀 Key Implemented Features & Structure

### 1. Navigation & Mobile Drawer
- Sticky navigation with Bodoni logo, uppercase tracking navigation links, and "Book now" pill CTA.
- Full-screen slide-down animated mobile menu drawer with ESC and resize dismiss triggers.

### 2. Homepage Sections
1. **Hero Section**:
   - Cloudinary video background with smooth parallax scrolling.
   - Dual gradient wash overlays with subtle radial shading.
   - Editorial headline: *"Luxury nails, at your door."*
   - Trust highlights with blush dot dividers (*Certified artists · Sanitised tools, opened in front of you · Travel free in Ahmedabad*).
   - 4 quick price chips for the core services.
   - Quick booking bar card with live Service selector, Date picker, Area input, and direct link to the booking form.
2. **Infinite Marquee Strip**:
   - `Luxury Nails. Comfort of Home. · SERVING AHMEDABAD · Certified artists · SANITISED TOOLS · Premium products · DOORSTEP SERVICE`
3. **Trust 4-Grid**:
   - Certified (*Trained & certified artists*), Sanitised (*Single-use tools, opened at your door*), 100% (*At-home service across Ahmedabad*), 4.8+ (*Rated by real clients*).
4. **Offer Banner**:
   - *"First booking this week? Get a free chrome finish upgrade on any gel set."* + *"Claim at booking"* link.
5. **01 The Motto (About)**:
   - *"Luxury isn't a location. It's the experience."* with 3 animated counter statistics (100% At-home, 4 Core services, 9 Step booking) and full-width artist photo banner with parallax.
6. **02 What We Stand On (Values)**:
   - 5 interactive ledger rows (*Quality, Hygiene, Convenience, Creativity, Experience*) with individual accent color highlights, animated numbers, and pill tag states.
7. **03 The Difference (Salon vs BookMyNail)**:
   - 4-point comparison table comparing a traditional salon with BookMyNail's doorstep experience.
8. **04 Services & Pricing**:
   - 4 expandable service accordions (*Gel Manicure ₹899, Builder Gel ₹1,499, Gel Extensions ₹2,499, Custom Nail Art ₹3,999*) with animated wash backgrounds, gradient dots, durations, descriptions, and bullet points.
   - Add-on pill chips strip.
9. **05 Hygiene, On Camera**:
   - Video demonstrating kit unsealing & workstation setup with rounded arch top (`180px 180px 12px 12px`) and 3 numbered commitment points.
10. **06 Recent Work (Gallery)**:
    - Horizontal scroll gallery with 6 real Cloudinary images with alternating rounded arch shapes, hover zoom, and captions.
11. **07 How Booking Works**:
    - 4 step cards with color-coded rule lines (*01 Choose your service, 02 Pick your date and time, 03 Confirm your booking, 04 We arrive and set up*).
12. **08 In Their Words (Reviews)**:
    - 3 client testimonial quotes with animated indicator lines and dynamic gradient background wash transitions.
13. **09 Before You Ask (FAQ)**:
    - 6 expandable FAQ accordions with smooth spring animations and rotating `+` / `−` badges.
14. **10 Follow Along (Instagram)**:
    - `@bookmynail` handle with 6-item Instagram image grid.
15. **Contact / Final CTA**:
    - *"Book your slot right here."* with Service area, Appointment hours, and instant booking & Instagram links.
16. **Floating WhatsApp CTA**:
    - Fixed floating button with pulsing blush dot that appears once scrolled past the hero section.

---

### 3. Services & Interactive Booking Page (`/services`)
- **Hero Section**: Editorial header with `services-hero.webp` image.
- **The Menu**: 4 clickable service cards that pre-select the service and smooth scroll straight into the booking form.
- **Add-on Strip**: Interactive multi-select chips.
- **Before You Book**: 4 step cards on dark theme.
- **Live Booking Form**:
  - Service selection, Date & Time window slots (9–11 AM, 11 AM–1 PM, 1–4 PM, 4–7 PM, 7–9 PM).
  - Number of people selector (1, 2, 3, 4) with automatic **15% group discount** for 2+ people.
  - Client contact details (Name, Phone, Email, Area, Address, Notes).
  - Sticky live summary sidebar showing selected items, group discount, and animated total in ₹.
  - **Confirm via WhatsApp** integration that records the lead in the database and opens WhatsApp with a pre-filled booking message.

---

### 4. Full Gallery / Portfolio Page (`/portfolio`)
- **Luxury Gradient Header**: Gradient wash with Bodoni headline, set counter, and description.
- **Interactive Category Filters**: *All (14), Bridal (6), Elegant (3), Creative (3), Chrome (2)*.
- **14 Curated Image Cards**: Featuring real Cloudinary images with the signature repeating arch top rhythm (`150px 150px 10px 10px`, `10px`, `10px`, `150px 150px 10px 10px`), hover zoom, and slide-up overlay captions.
- **Final CTA**: *"Seen one you want?"* section with booking & Instagram links.

---

## 🌐 Live Verification & Links

- **Home Page**: [http://localhost:3000/](http://localhost:3000/)
- **Services & Booking**: [http://localhost:3000/services](http://localhost:3000/services)
- **Portfolio & Gallery**: [http://localhost:3000/portfolio](http://localhost:3000/portfolio)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
