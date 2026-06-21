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
        // Primary — warm terracotta-silk, not cool burgundy
        rouge: {
          DEFAULT: "#8B4A3A",
          light: "#A45A46",
          warm: "#B76E5D",
          pale: "#D4A090",
          deep: "#6B3328",
          ink: "#4A2018",
        },
        // Secondary — warm parchment, aged paper
        parchment: {
          DEFAULT: "#F7F2EB",
          warm: "#F3EEE6",
          deep: "#EFE7DB",
          aged: "#E8DDD0",
          dark: "#DDD0C0",
        },
        // Accent — antique gold
        antique: {
          DEFAULT: "#D4B08A",
          light: "#E0C4A0",
          muted: "#C89F7A",
          pale: "#EDD9C0",
          dark: "#B8905A",
        },
        // Text
        ink: {
          DEFAULT: "#2A221D",
          soft: "#3D3128",
          muted: "#5C4F44",
          light: "#7A6D62",
          faint: "#A89D94",
        },
        // Preserved for compatibility
        canvas: {
          DEFAULT: "#F7F2EB",
          warm: "#F3EEE6",
          cream: "#EFE7DB",
        },
        surface: {
          DEFAULT: "#F3EEE6",
          muted: "#EFE7DB",
          elevated: "#FDFAF7",
        },
        crimson: {
          DEFAULT: "#8B4A3A",
          light: "#A45A46",
          dark: "#6B3328",
          deep: "#4A2018",
        },
        gold: {
          DEFAULT: "#D4B08A",
          light: "#E0C4A0",
          muted: "#C89F7A",
          pale: "#EDD9C0",
          shimmer: "#E8D4B8",
        },
        ivory: {
          DEFAULT: "#FDFAF7",
          warm: "#F7F2EB",
          dark: "#EFE7DB",
          cream: "#F3EEE6",
        },
        stone: {
          DEFAULT: "#8C7D72",
          light: "#B0A498",
          dark: "#6B5E54",
          warm: "#9E8F84",
        },
        slate: {
          DEFAULT: "#E0D8D0",
          light: "#EDE8E2",
          dark: "#CEC4BA",
          subtle: "#E8E2DA",
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
        // Primary display — high contrast editorial serif
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        // Body — clean, airy, readable
        body: ["var(--font-body)", "Outfit", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        // Script — used sparingly, one accent word only
        script: ["var(--font-script)", "Great Vibes", "cursive"],
      },
      fontSize: {
        // Oversized editorial display — the key to luxury feel
        "display-hero": ["7rem", { lineHeight: "0.9", letterSpacing: "-0.03em", fontWeight: "300" }],
        "display-2xl": ["5.5rem", { lineHeight: "0.92", letterSpacing: "-0.03em", fontWeight: "300" }],
        "display-xl": ["4.5rem", { lineHeight: "0.94", letterSpacing: "-0.025em", fontWeight: "300" }],
        "display-lg": ["3.5rem", { lineHeight: "0.97", letterSpacing: "-0.02em", fontWeight: "300" }],
        "display-md": ["2.75rem", { lineHeight: "1.05", letterSpacing: "-0.018em", fontWeight: "400" }],
        "display-sm": ["2.125rem", { lineHeight: "1.1", letterSpacing: "-0.012em", fontWeight: "400" }],
        "h1": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.022em", fontWeight: "400" }],
        "h2": ["2.25rem", { lineHeight: "1.12", letterSpacing: "-0.018em", fontWeight: "400" }],
        "h3": ["1.75rem", { lineHeight: "1.18", letterSpacing: "-0.01em", fontWeight: "400" }],
        "h4": ["1.375rem", { lineHeight: "1.28", letterSpacing: "-0.005em", fontWeight: "500" }],
        "body-xl": ["1.25rem", { lineHeight: "1.7", letterSpacing: "0" }],
        "body-lg": ["1.125rem", { lineHeight: "1.72", letterSpacing: "0" }],
        "body": ["1rem", { lineHeight: "1.78", letterSpacing: "0.005em" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.72", letterSpacing: "0.005em" }],
        "body-xs": ["0.875rem", { lineHeight: "1.65", letterSpacing: "0.01em" }],
        "label": ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.14em", fontWeight: "500" }],
        "caption": ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.06em" }],
      },
      // No rounded corners — luxury fashion is sharp
      borderRadius: {
        DEFAULT: "0px",
        sm: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
        "3xl": "4px",
        full: "9999px",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      boxShadow: {
        // Flat, paper-weight shadows — no glows, no blurs
        "premium": "0 2px 20px rgba(42, 34, 29, 0.07)",
        "premium-sm": "0 1px 8px rgba(42, 34, 29, 0.05)",
        "premium-md": "0 4px 30px rgba(42, 34, 29, 0.09)",
        "premium-lg": "0 8px 48px rgba(42, 34, 29, 0.11)",
        "premium-xl": "0 16px 64px rgba(42, 34, 29, 0.13)",
        // Paper shadow for polaroid/frame elements
        "paper": "2px 4px 12px rgba(42, 34, 29, 0.12), 0 1px 3px rgba(42, 34, 29, 0.08)",
        "paper-lg": "4px 8px 24px rgba(42, 34, 29, 0.14), 0 2px 6px rgba(42, 34, 29, 0.08)",
        // Insets
        "inner-subtle": "inset 0 1px 2px rgba(42, 34, 29, 0.04)",
        // Legacy compatibility
        "glow-gold": "0 0 24px rgba(212, 176, 138, 0.2)",
        "glow-crimson": "0 0 24px rgba(139, 74, 58, 0.15)",
      },
      transitionDuration: {
        DEFAULT: "350ms",
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.4, 0, 0.2, 1)",
        "smooth": "cubic-bezier(0.33, 1, 0.68, 1)",
        "editorial": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUpFade: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 70s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.6s ease-out",
        revealUp: "revealUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        slideUpFade: "slideUpFade 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
