/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#ffffff",
        text: "#0f172a", // slate-900
        muted: "#475569", // slate-600
        border: "#e2e8f0", // slate-200
        brand: {
          DEFAULT: "#1d4ed8", // blue-700
          light: "#60a5fa", // blue-400
          dark: "#1e40af" // blue-800
        }
      },
      borderRadius: { xl: "12px" },
      container: { center: true, padding: "1rem" }
    }
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography"), require("@tailwindcss/aspect-ratio")]
};

