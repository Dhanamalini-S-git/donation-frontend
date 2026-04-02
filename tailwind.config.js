/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      colors: {
        brand: {
          50: "#fef3ec",
          100: "#fde0cc",
          200: "#fbc09a",
          300: "#f89a63",
          400: "#f5722d",
          500: "#e85d0a",
          600: "#c44c08",
          700: "#9a3b07",
          800: "#712b07",
          900: "#4a1c05",
        },
        sage: {
          50: "#f0f7f4",
          100: "#dcede5",
          200: "#b9dace",
          300: "#8dc2b0",
          400: "#5ea48f",
          500: "#3d8a75",
          600: "#2e6e5d",
          700: "#265849",
          800: "#1f4539",
          900: "#19352d",
        },
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
        sidebar: "4px 0 24px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
