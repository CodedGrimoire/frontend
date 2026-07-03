/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#080b14",
        card: "#121726",
        accent: "#7c86ff",
        accentSoft: "#aeb4ff",
        accentDeep: "#5966f2",
        ink: "#e8ebff",
        muted: "#8f98bd",
        line: "#232945"
      },
      boxShadow: {
        card: "0 18px 48px rgba(4, 7, 18, 0.42)"
      }
    }
  },
  plugins: []
};
