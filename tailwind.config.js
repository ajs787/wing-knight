/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "Apple Color Emoji", "Segoe UI Emoji"],
      },

      // exact spacing scale
      spacing: {
        s1: "0.25rem",
        s2: "0.5rem",
        s3: "1rem",
        s4: "1.5rem",
        s5: "2rem",
        s6: "3rem",
        s7: "4rem",
      },

      borderRadius: {
        // shadcn vars (keep for UI component compat)
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // wing tokens
        xl:  "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },

      colors: {
        // ─── shadcn infrastructure ───────────────────────────────────
        border:     "hsl(var(--border))",
        input:      "hsl(var(--input))",
        ring:       "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // ─── wing design palette (exact) ─────────────────────────────
        bg:      "#0E0E11",
        panel:   "#15151A",
        panel2:  "#1B1B22",
        stroke:  "rgba(255,255,255,0.08)",
        stroke2: "rgba(255,255,255,0.12)",
        text:    "#F4F4F5",
        muted: {
          DEFAULT:    "#A1A1AA",
          foreground: "#71717A",
        },
        muted2: "#71717A",
        pink:   "#F472B6",
        pink2:  "#EC4899",
      },

      boxShadow: {
        card:       "0 1px 0 rgba(255,255,255,0.04), 0 12px 30px rgba(0,0,0,0.45)",
        lift:       "0 1px 0 rgba(255,255,255,0.06), 0 18px 45px rgba(0,0,0,0.55)",
        ring:       "inset 0 0 0 1px rgba(255,255,255,0.08)",
        glow:       "0 0 0 1px rgba(244,114,182,0.18), 0 12px 40px rgba(244,114,182,0.25)",
        glowStrong: "0 0 0 1px rgba(244,114,182,0.25), 0 18px 70px rgba(244,114,182,0.35)",
      },

      backgroundImage: {
        accent: "linear-gradient(135deg, #F472B6 0%, #EC4899 100%)",
        aura:   "radial-gradient(900px circle at 15% 10%, rgba(244,114,182,0.12), transparent 60%)",
        aura2:  "radial-gradient(700px circle at 90% 20%, rgba(236,72,153,0.08), transparent 55%)",
      },

      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 1px rgba(244,114,182,0.18), 0 12px 40px rgba(244,114,182,0.18)" },
          "50%":     { boxShadow: "0 0 0 1px rgba(244,114,182,0.28), 0 18px 70px rgba(244,114,182,0.30)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "card-enter": {
          from: { opacity: "0", transform: "scale(0.96) translateY(12px)" },
          to:   { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "swipe-left":  { to: { opacity: "0", transform: "translateX(-120%) rotate(-20deg)" } },
        "swipe-right": { to: { opacity: "0", transform: "translateX(120%) rotate(20deg)" } },
      },
      animation: {
        shimmer:       "shimmer 1.2s ease-in-out infinite",
        floaty:        "floaty 6s ease-in-out infinite",
        pulseGlow:     "pulseGlow 1.6s ease-in-out infinite",
        "fade-in":     "fade-in 0.4s ease-out",
        "slide-in":    "slide-in 0.3s ease-out",
        "card-enter":  "card-enter 0.35s ease-out",
        "swipe-left":  "swipe-left 0.35s ease-in forwards",
        "swipe-right": "swipe-right 0.35s ease-in forwards",
      },
    },
  },
  plugins: [],
};
