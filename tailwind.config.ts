import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6EE",
        "cream-deep": "#F4EADB",
        sage: "#AFC2A8",
        "sage-deep": "#7E9676",
        peach: "#F2C9A8",
        terracotta: "#D9A78B",
        rose: "#E8C4BE",
        gold: "#C9A24B",
        ink: "#33291F",
        "ink-soft": "#6B5D4F",
        line: "#E5D8C5",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-mukta)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -22px rgba(51,41,31,.35)",
      },
      borderRadius: {
        xl2: "18px",
      },
      maxWidth: {
        site: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
