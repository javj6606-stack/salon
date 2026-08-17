import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#FDF3F2",
          100: "#FBE6E4",
          200: "#F6C9C6",
          300: "#EDA6A0",
          400: "#E17F76",
          500: "#D15B50", // primary brand accent
          600: "#B4463C",
          700: "#8F372F",
        },
        gold: {
          400: "#E8C989",
          500: "#D4AF6A", // rose-gold accent
          600: "#B8944F",
        },
        ink: "#241A18",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
