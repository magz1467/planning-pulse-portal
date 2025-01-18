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
        background: "#FFFBF7",  // Keeping bright background for contrast
        foreground: "#47463f",  // Updated to Gunmetal Gray
        primary: {
          DEFAULT: "#33C3F0",   // Updated to a brighter turquoise
          dark: "#1EAEDB",      // Darker shade for hover
          light: "#47D3FF",     // Lighter shade
          foreground: "#FFFFFF", // White text for contrast
        },
        secondary: {
          DEFAULT: "#af5662",   // Honeysuckle
          foreground: "#FFFFFF", // White text for contrast
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f6c8cc",   // Rose Quartz
          foreground: "#47463f",  // Using Gunmetal Gray for text
        },
        accent: {
          DEFAULT: "#f6c8cc", // Using Rose Quartz as accent
          foreground: "#47463f",  // Using Gunmetal Gray for text
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