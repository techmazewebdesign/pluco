import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#F8F6F2",
          100: "#E8E4DB",
          200: "#D8D0C0",
          300: "#C8BCA8",
          400: "#B8A890",
          500: "#A89478",
          600: "#987860",
          700: "#5E6470",
          800: "#0B234A",
          900: "#071C3C",
          950: "#051530",
        },
        graphite: {
          50: "#F8F6F2",
          100: "#E8E4DB",
          200: "#D8D0C0",
          300: "#C8BCA8",
          400: "#B8A890",
          500: "#A89478",
          600: "#987860",
          700: "#5E6470",
          800: "#1E2430",
          900: "#141820",
          950: "#0A0C10",
        },
        gold: {
          50: "#FEF7E6",
          100: "#FDF0D0",
          200: "#FCE9BA",
          300: "#FAE2A4",
          400: "#D8B46A",
          500: "#C9A35A",
          600: "#B8944A",
          700: "#A7853A",
          800: "#96762A",
          900: "#856720",
          950: "#645815",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
