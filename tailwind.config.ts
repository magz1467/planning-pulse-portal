import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#FFFBF7",  // Kept bright background
        foreground: "#333333",  // Kept for good contrast
        primary: {
          DEFAULT: "#8FA97A",   // Updated to requested sage green
          dark: "#7A9165",      // Adjusted darker shade
          light: "#A4BE8F",     // Adjusted lighter shade
          foreground: "#FFFFFF", // White text for contrast
        },
        secondary: {
          DEFAULT: "#F9E4E8",   // Kept the rose pink
          foreground: "#FFFFFF", // White text for contrast
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F8F6F3",
          foreground: "#4B4B4B",  // Kept for readability
        },
        accent: {
          DEFAULT: "#F9E4E8", // Using rose pink as accent
          foreground: "#333333",  // Kept for readability
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        caveat: ["Caveat", "cursive"],
        playfair: ["Playfair Display", "serif"],
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" }
        }
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;