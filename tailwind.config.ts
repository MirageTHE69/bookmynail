import type { Config } from "tailwindcss";

/**
 * Every value here is lifted verbatim from the design export in `design-export/`.
 * The seven brand colors are the `:root` custom properties shared by
 * `BookMyNail v3.dc.html` and `Services.dc.html`; the `shade` ramp holds the
 * gradient-only hexes the export uses inline but never declares as tokens.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    // The export writes max-width queries at 1000/760 (and 900/520 on Portfolio).
    // These are their mobile-first inverses, so the base layer *is* the small
    // screen and each named screen restores the desktop rule.
    screens: {
      pf: "521px",
      nav: "761px",
      pfmd: "901px",
      wide: "1001px",
    },
    extend: {
      colors: {
        bone: "#FFFFFF",
        shell: "#F4EEE7",
        "shell-line": "rgba(26, 22, 20, 0.14)",
        ink: "#1A1614",
        blush: "#E7A79F",
        terracotta: "#BF5634",
        plum: "#56203C",
        lilac: "#B4A2D4",
        chrome: "#9BA5AC",
        shade: {
          "plum-deep": "#8A3A3C",
          "terracotta-deep": "#8E3A1F",
          peach: "#F0C3A6",
          "plum-ink": "#43305E",
          "lilac-deep": "#7B62A8",
          "lilac-mist": "#E3D8F0",
          rose: "#A85F63",
          cream: "#F7EDE4",
          slate: "#3F4A52",
          "slate-mid": "#6E7C85",
          silver: "#D9DEE1",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      // Named clamps, so components never restate the export's fluid scale.
      fontSize: {
        hero: "clamp(46px,8.4vw,142px)",
        "hero-svc": "clamp(42px,7.6vw,124px)",
        "hero-pf": "clamp(38px,8vw,120px)",
        display1: "clamp(38px,7.6vw,128px)",
        display2: "clamp(34px,6.2vw,104px)",
        display3: "clamp(32px,5.8vw,96px)",
        display4: "clamp(30px,5.4vw,88px)",
        "display-pf": "clamp(30px,6.4vw,92px)",
        quote: "clamp(26px,4.4vw,68px)",
        "svc-name": "clamp(21px,2.7vw,38px)",
        "svc-price": "clamp(19px,2.2vw,30px)",
        "value-h": "clamp(22px,2.8vw,40px)",
        "step-h": "clamp(19px,2.1vw,28px)",
        stat: "clamp(26px,3.2vw,42px)",
        "card-h": "clamp(20px,2.1vw,28px)",
        "card-price": "clamp(19px,2vw,26px)",
        "sum-svc": "clamp(24px,2.6vw,34px)",
        "sum-total": "clamp(30px,3.4vw,44px)",
        "menu-link": "clamp(30px,9vw,44px)",
        "count-pf": "clamp(26px,3.2vw,40px)",
        "filter-pf": "clamp(15px,1.6vw,20px)",
      },
      spacing: {
        gutter: "clamp(18px,4vw,54px)",
        "gutter-pf": "clamp(20px,5vw,64px)",
        "section-y": "clamp(64px,11vh,130px)",
        "section-y-pf": "clamp(56px,10vh,110px)",
        "hero-top": "clamp(96px,14vh,150px)",
        "hero-bottom": "clamp(28px,5vh,48px)",
        "head-gap": "clamp(28px,5vh,48px)",
        "block-gap": "clamp(32px,6vh,64px)",
        "row-y": "clamp(22px,3.4vh,34px)",
        "svc-y": "clamp(20px,3.2vh,32px)",
        "card-p": "clamp(24px,4vh,40px)",
      },
      gap: {
        gutter: "clamp(18px,4vw,54px)",
        grid: "clamp(24px,4vw,60px)",
        "grid-lg": "clamp(28px,5vw,80px)",
        svc: "clamp(12px,2.6vw,36px)",
        value: "clamp(16px,3vw,44px)",
        steps: "clamp(14px,2.4vw,32px)",
      },
      maxWidth: {
        shell: "1440px",
        "shell-pf": "1320px",
      },
      transitionTimingFunction: {
        // The export's signature ease, used on every reveal and hover.
        editorial: "cubic-bezier(0.16,1,0.3,1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 26s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
