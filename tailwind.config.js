/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#F1E7D2",
        sandDeep: "#E4D3AC",
        oceanDeep: "#0E2E31",
        oceanMid: "#1F6F72",
        oceanPale: "#DCEBEA",
        coral: "#B94A26",
        coralDeep: "#7A3018",
        terracotta: "#F1DAC4",
        gold: "#C99A3D",
        ink: "#191813",
        inkSoft: "#5C5A4E"
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "serif"],
        sans: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      }
    }
  },
  plugins: []
};
