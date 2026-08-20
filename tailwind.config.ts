import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // The header menu measures ~1143px of content plus gutters, so it can
        // appear well before xl. Sitting on xl(1280) hid it on a 1920 screen at
        // 150% scaling, which lands near 1265 once the scrollbar is taken off.
        nav: "1200px",
      },
      colors: {
        cream: "#FBF6EE",
        "cream-deep": "#F4EADB",
        "cream-warm": "#FDFAF4",
        sage: "#AFC2A8",
        "sage-deep": "#7E9676",
        "sage-dark": "#5E7457",
        peach: "#F2C9A8",
        terracotta: "#D9A78B",
        "terracotta-deep": "#B97E5E",
        rose: "#E8C4BE",
        gold: "#C9A24B",
        "gold-light": "#E4C77E",
        "gold-deep": "#9C7A2E",
        ink: "#33291F",
        "ink-deep": "#241C14",
        "ink-soft": "#6B5D4F",
        line: "#E5D8C5",
        "line-soft": "#EFE6D8",
      },
      fontFamily: {
        // Per-glyph fallback: Latin resolves to Fraunces, Devanagari to Martel.
        display: ["var(--font-fraunces)", "var(--font-martel)", "serif"],
        body: ["var(--font-mukta)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -22px rgba(51,41,31,.35)",
        lux: "0 2px 4px -2px rgba(51,41,31,.08), 0 12px 28px -12px rgba(51,41,31,.16), 0 32px 64px -32px rgba(51,41,31,.28)",
        lift: "0 4px 8px -4px rgba(51,41,31,.10), 0 24px 48px -20px rgba(51,41,31,.30), 0 48px 90px -50px rgba(51,41,31,.40)",
        glow: "0 0 0 1px rgba(201,162,75,.30), 0 18px 44px -20px rgba(201,162,75,.55)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,.55)",
      },
      borderRadius: {
        xl2: "18px",
        xl3: "26px",
      },
      maxWidth: {
        site: "1200px",
      },
      letterSpacing: {
        luxe: "0.34em",
      },
      backgroundImage: {
        "gold-sheen": "linear-gradient(100deg,#9C7A2E 0%,#C9A24B 28%,#F0DCA6 50%,#C9A24B 72%,#9C7A2E 100%)",
        "ink-sheen": "linear-gradient(160deg,#3B3025 0%,#33291F 45%,#241C14 100%)",
        "cream-veil": "linear-gradient(180deg,#FDFAF4 0%,#FBF6EE 55%,#F4EADB 100%)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1.06) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.16) translate3d(-1.2%,-1.4%,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-7px)" },
        },
        haloPulse: {
          "0%": { transform: "scale(1)", opacity: ".55" },
          "70%,100%": { transform: "scale(1.9)", opacity: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        rise: "rise .7s cubic-bezier(.2,.7,.2,1) both",
        kenburns: "kenburns 22s ease-out both",
        shimmer: "shimmer 6s linear infinite",
        floaty: "floaty 3.6s ease-in-out infinite",
        halo: "haloPulse 2.4s cubic-bezier(.2,.7,.2,1) infinite",
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
