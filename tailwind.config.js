/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary gold palette
        gold:        "#C9A84C",
        "gold-light":"#E8C96A",
        "gold-dark": "#A07830",
        "gold-pale": "#FEF8E7",
        "gold-muted":"#F7E6C2",
        // Professional charcoal backgrounds
        luxury:      "#111827",
        "luxury-2":  "#1F2937",
        "luxury-3":  "#374151",
        // Keep airbnb alias pointing to gold for backward compat
        airbnb:      "#C9A84C",
        "airbnb-dark":"#A07830",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans:  ["Cormorant Garamond", "Garamond", "Georgia", "serif"],
      },
      boxShadow: {
        gold:  "0 4px 24px 0 rgba(201,168,76,0.18)",
        "gold-lg": "0 8px 40px 0 rgba(201,168,76,0.28)",
      },
    },
  },
  plugins: [],
};
