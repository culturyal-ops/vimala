import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FAFAF9",
          warm: "#F5F5F4",
        },
        surface: {
          DEFAULT: "#F8F7F6",
          muted: "#F0EFED",
        },
        burgundy: "#722F37",
        crimson: {
          DEFAULT: "#8B1E3F",
          light: "#A02449",
          dark: "#6B1731",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#D9B97E",
          muted: "#B89860",
          pale: "#E8DCC8",
        },
        ivory: {
          DEFAULT: "#F8F7F6",
          warm: "#F0EFED",
          dark: "#E5E3E0",
        },
        ink: {
          DEFAULT: "#1A1614",
          soft: "#2D2926",
          muted: "#524D48",
        },
        stone: {
          DEFAULT: "#78716C",
          light: "#A8A29E",
          dark: "#57534E",
        },
        slate: {
          DEFAULT: "#E7E5E4",
          light: "#F5F5F4",
          dark: "#D6D3D1",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--canvas))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-body)", "Outfit", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["4rem", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "display-lg": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-md": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        premium: "0 20px 60px -20px rgba(26, 22, 20, 0.12), 0 8px 16px -8px rgba(26, 22, 20, 0.08)",
        "premium-sm": "0 4px 16px -4px rgba(26, 22, 20, 0.06)",
        "premium-lg": "0 32px 80px -24px rgba(26, 22, 20, 0.16)",
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
