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
        background: "#FDE1D3",  // Changed to a lighter rose pink shade
        foreground: "#403E43",  // Darker charcoal for better contrast
        primary: {
          DEFAULT: "#2E4E3F",
          dark: "#1E3A2E",    // Darker shade for hover states
          light: "#A2B3A1",   // Muted sage for secondary elements
          foreground: "#FFFFFF", // White text for better contrast on primary
        },
        secondary: {
          DEFAULT: "#C16A5A", // Warm terracotta
          foreground: "#FEC6A1", // Lighter peach for contrast
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F1F0FB",
          foreground: "#403E43",  // Darker charcoal for better contrast
        },
        accent: {
          DEFAULT: "#C8A7A2", // Dusty rose
          foreground: "#403E43",  // Darker charcoal for better contrast
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