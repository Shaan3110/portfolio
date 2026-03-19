import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        accent: "var(--color-accent)",
        "accent-secondary": "var(--color-accent-secondary)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out 2s infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "bounce-arrow": "bounce-arrow 1.5s ease-in-out infinite",
      },
      backgroundSize: {
        "300%": "300%",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
