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
        background: "#FFF9F3",  // Updated to new light background
        foreground: "#333333",  // Updated to new text color
        primary: {
          DEFAULT: "#A4B884",   // Updated to sage green
          dark: "#8FA374",      // Darker shade for hover states
          light: "#B8C9A0",     // Lighter shade for secondary elements
          foreground: "#FFFFFF", // White text for better contrast on primary
        },
        secondary: {
          DEFAULT: "#F9E4E8",   // Updated to new rose pink shade
          foreground: "#FFFFFF", // White text for contrast
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F8F6F3",
          foreground: "#4B4B4B",  // Updated to specified text color
        },
        accent: {
          DEFAULT: "#F9E4E8", // Using new rose pink shade as accent
          foreground: "#333333",  // Updated to specified text color
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