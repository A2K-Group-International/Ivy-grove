/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        school: {
          50: "oklch(0.99 0.01 142)",
          100: "oklch(0.96 0.03 142)",
          200: "oklch(0.91 0.06 142)",
          300: "oklch(0.82 0.12 142)",
          400: "oklch(0.71 0.15 142)",
          500: "oklch(0.61 0.16 142)",
          600: "oklch(0.45 0.15 142)",
          700: "oklch(0.35 0.12 142)",
          800: "oklch(0.28 0.09 142)",
          900: "oklch(0.22 0.06 142)",
          950: "oklch(0.15 0.04 142)",
        },
      },
    },
  },
  plugins: [],
};
