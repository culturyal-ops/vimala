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
          DEFAULT: "#F8F4EE",
          warm: "#F4EFE6",
          cream: "#EDE8DE",
        },
        surface: {
          DEFAULT: "#F2EDE3",
          muted: "#E8E2D6",
          elevated: "#FDFAF5",
        },
        burgundy: {
          DEFAULT: "#6B1525",
          rich: "#56101D",
          soft: "#7D2133",
        },
        crimson: {
          DEFAULT: "#7A1525",
          light: "#92293A",
          dark: "#5C0F1B",
          deep: "#3D0812",
        },
        gold: {
          DEFAULT: "#C8A96E",
          light: "#D9BC85",
          muted: "#B0925A",
          pale: "#E8DEC8",
          shimmer: "#E0D0AA",
        },
        ivory: {
          DEFAULT: "#FBF8F1",
          warm: "#F5F0E4",
          dark: "#EAE4D8",
          cream: "#F0EAD8",
        },
        ink: {
          DEFAULT: "#1A1614",
          soft: "#2D2926",
          muted: "#524D48",
          lighter: "#6B6560",
        },
        stone: {
          DEFAULT: "#78716C",
          light: "#A8A29E",
          dark: "#57534E",
          warm: "#8C857F",
        },
        slate: {
          DEFAULT: "#E7E5E4",
          light: "#F5F5F4",
          dark: "#D6D3D1",
          subtle: "#F0EEEB",
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
        display: ["var(--font-display)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        body: ["var(--font-body)", "Outfit", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        script: ["var(--font-script)", "Great Vibes", "cursive"],
      },
      fontSize: {
        // Display sizes for hero and major headings
        "display-2xl": ["5.5rem", { lineHeight: "0.95", letterSpacing: "-0.04em", fontWeight: "300" }],
        "display-xl": ["4.5rem", { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "300" }],
        "display-lg": ["3.5rem", { lineHeight: "1.0", letterSpacing: "-0.03em", fontWeight: "400" }],
        "display-md": ["2.5rem", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "400" }],
        "display-sm": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" }],
        
        // Heading scales
        "h1": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "500" }],
        "h2": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "500" }],
        "h3": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "500" }],
        "h4": ["1.375rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        
        // Body text
        "body-xl": ["1.25rem", { lineHeight: "1.65", letterSpacing: "-0.01em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", letterSpacing: "0" }],
        "body": ["1rem", { lineHeight: "1.75", letterSpacing: "0" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.7", letterSpacing: "0.005em" }],
        "body-xs": ["0.875rem", { lineHeight: "1.65", letterSpacing: "0.01em" }],
        
        // UI elements
        "label": ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.08em", fontWeight: "500" }],
        "caption": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.05em" }],
      },
      borderRadius: {
        lg: "10px",
        md: "8px",
        sm: "6px",
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        // Premium shadows with subtle warmth
        "premium": "0 24px 64px -16px rgba(26, 22, 20, 0.08), 0 8px 24px -8px rgba(139, 30, 63, 0.04)",
        "premium-sm": "0 4px 20px -4px rgba(26, 22, 20, 0.05), 0 2px 8px -2px rgba(139, 30, 63, 0.03)",
        "premium-md": "0 12px 40px -12px rgba(26, 22, 20, 0.09), 0 4px 16px -4px rgba(139, 30, 63, 0.04)",
        "premium-lg": "0 32px 80px -24px rgba(26, 22, 20, 0.12), 0 12px 32px -12px rgba(139, 30, 63, 0.05)",
        "premium-xl": "0 48px 120px -32px rgba(26, 22, 20, 0.14), 0 16px 48px -16px rgba(139, 30, 63, 0.06)",
        
        // Glow effects
        "glow-gold": "0 0 32px -8px rgba(201, 169, 110, 0.3)",
        "glow-crimson": "0 0 32px -8px rgba(139, 30, 63, 0.25)",
        
        // Inner shadows
        "inner-subtle": "inset 0 1px 2px 0 rgba(26, 22, 20, 0.05)",
        "inner-premium": "inset 0 2px 8px 0 rgba(26, 22, 20, 0.08)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
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
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInScale: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        slideUpFade: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDownFade: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        fadeInScale: "fadeInScale 0.4s ease-out",
        shimmer: "shimmer 3s linear infinite",
        float: "float 3s ease-in-out infinite",
        slideUpFade: "slideUpFade 0.5s ease-out",
        slideDownFade: "slideDownFade 0.5s ease-out",
        scaleIn: "scaleIn 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
