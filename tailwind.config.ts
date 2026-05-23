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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#6b4f4f", // muted cocoa-rose (primary button/heading/icon color)
          foreground: "#ffffff",
          hover: "#563e3e", // darker rose
        },
        secondary: {
          DEFAULT: "#483434", // deep warm dark brown (espresso dark brown)
          foreground: "#ffffff",
          hover: "#3a2929", // darker brown
        },
        accent: {
          DEFAULT: "#eed6c4", // warm sand / peach champagne
          foreground: "#6b4f4f",
          light: "#fff3e4", // soft champagne cream
        },
        muted: {
          DEFAULT: "#fff3e4", // soft warm ivory
          foreground: "#6b4f4f",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-outfit)"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "subtle-zoom": "subtleZoom 20s infinite alternate",
        "marquee": "marquee 35s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        subtleZoom: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
