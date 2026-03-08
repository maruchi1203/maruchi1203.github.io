/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "touch-only": { raw: "(hover: none) and (pointer: coarse)" },
      "mouse-only": { raw: "(hover: hover) and (pointer: fine)" },
      "max-md": { max: "767px" },
    },
  },
  plugins: [],
};
