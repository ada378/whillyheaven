/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        airbnb: "#FF385C",
        "airbnb-dark": "#E31C5F",
      },
    },
  },
  plugins: [],
};
