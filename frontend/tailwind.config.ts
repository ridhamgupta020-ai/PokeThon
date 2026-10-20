import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
        },
        ink: "#0A0A0A",
        mist: "#F5F5F4",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,10,10,.04), 0 8px 24px -8px rgba(10,10,10,.10)",
        glow: "0 0 0 1px rgba(250,204,21,.4), 0 10px 40px -10px rgba(250,204,21,.55)",
      },
      keyframes: {
        spin360: { to: { transform: "rotate(360deg)" } },
      },
    },
  },
  plugins: [],
};
export default config;
