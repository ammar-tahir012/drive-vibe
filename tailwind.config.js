/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'brand-gold': '#e8c97a',
        'brand-gold-dark': '#c9a84c',
        'brand-dark': '#0c0c0e',
        'surface': '#1a1a1f',
        'surface2': '#252530',
        'surface3': '#2e2e3a',
      },
      boxShadow: {
        glow: '0 0 40px rgba(232,201,122,0.15)',
        'glow-lg': '0 0 80px rgba(232,201,122,0.2)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        equalize: {
          '0%, 100%': { height: '6px' },
          '50%': { height: '18px' },
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'equalize': 'equalize 0.8s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease infinite',
      },
    },
  },
  plugins: [],
}
