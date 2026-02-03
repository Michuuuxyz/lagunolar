import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
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
        // Lagarto Premium Theme - Cores principais inspiradas no bot
        reptile: {
          gold: '#D4AF37',        // Dourado premium
          amber: '#FF8C00',       // Laranja/âmbar vibrante
          bronze: '#CD7F32',      // Bronze médio
          earth: '#8B4513',       // Marrom terroso
          dark: '#3E2723',        // Marrom escuro
        },
        // Backgrounds escuros premium
        bg: {
          darker: '#0a0a0a',      // Preto profundo
          dark: '#141414',        // Preto cinza
          medium: '#1a1a1a',      // Cinza escuro
          card: '#1f1f1f',        // Cards
          cardHover: '#252525',   // Card hover
        },
        // Acentos e CTAs
        accent: {
          primary: '#D4AF37',     // Dourado (CTAs principais)
          secondary: '#FF8C00',   // Laranja (hover states)
          tertiary: '#CD7F32',    // Bronze
        },
        // Primary (backward compatibility with old theme)
        primary: {
          DEFAULT: "#D4AF37",     // Agora é dourado
          hover: "#FF8C00",       // Laranja no hover
          light: "#F4CF87",       // Dourado claro
        },
        // Status colors (semantic)
        success: '#10B981',       // Verde
        warning: '#F59E0B',       // Amarelo
        error: '#EF4444',         // Vermelho
        info: '#3B82F6',          // Azul
        // Discord colors (mantido para compatibilidade)
        discord: {
          dark: "#202225",
          darker: "#1a1b1e",
          gray: "#36393f",
          lightGray: "#4f545c",
          text: "#dcddde",
          muted: "#72767d",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-hero": "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #3E2723 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(212,175,55,0.05) 0%, transparent 100%)",
        "gradient-text": "linear-gradient(90deg, #D4AF37 0%, #FF8C00 100%)",
        "gradient-gold": "linear-gradient(135deg, #D4AF37 0%, #FF8C00 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      boxShadow: {
        'gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 0 40px rgba(212, 175, 55, 0.5)',
        'gold-xl': '0 0 60px rgba(212, 175, 55, 0.7)',
      },
    },
  },
  plugins: [],
};
export default config;
