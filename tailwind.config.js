module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
        display: ["'Space Grotesk'", "sans-serif"],
      },
      colors: {
        brand: {
          50:"#f5f3ff", 100:"#ede9fe", 200:"#ddd6fe",
          300:"#c4b5fd", 400:"#a78bfa", 500:"#8b5cf6",
          600:"#7c3aed", 700:"#6d28d9", 800:"#5b21b6", 900:"#4c1d95",
        },
        sage: {
          50:"#f0fdf4", 100:"#dcfce7", 200:"#bbf7d0",
          300:"#86efac", 400:"#4ade80", 500:"#22c55e",
          600:"#16a34a", 700:"#15803d", 800:"#166534", 900:"#14532d",
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.4)",
        glow: "0 0 30px rgba(139,92,246,0.25)",
      },
    },
  },
  plugins: [],
};