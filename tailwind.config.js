/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f172a",
        card: "#111827",
        accent: "#22d3ee"
      },
      boxShadow: {
        card: "0 12px 30px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: []
};
