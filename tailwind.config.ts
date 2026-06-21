import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand: M letter logo blends indigo->teal/green
        brand: {
          50: "#eef1ff",
          100: "#e0e6ff",
          200: "#c7d0ff",
          300: "#a3afff",
          400: "#7d83fb",
          500: "#5b6cf5", // primary CTA
          600: "#4a55e0",
          700: "#3f47bd",
          800: "#343c98",
          900: "#2e3580",
        },
        // Accent: green from logo gradient end
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        // Neutral surfaces
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, #2e3580 0%, #5b6cf5 50%, #10b981 100%)",
        "soft-mesh":
          "radial-gradient(at 20% 0%, rgba(91,108,245,0.10) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(16,185,129,0.08) 0px, transparent 50%)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)",
        ring: "0 0 0 4px rgba(91,108,245,0.15)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
