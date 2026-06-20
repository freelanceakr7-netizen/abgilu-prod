/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./index.jsx",
    "./App.jsx",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Replace pure white/black globally
        white: '#F0E1C6',
        black: '#4c0e0e',
        
        // Remap default gray scale to warm cream -> crimson scale
        gray: {
          50: '#F0E1C6',
          100: '#F0E1C6',
          200: '#E8D5B0',
          300: '#DFC9A0',
          400: '#C9B48A',
          500: '#BFA882',
          600: '#5C1010',
          700: '#7A1215',
          800: '#6B0F10',
          900: '#4c0e0e',
        },

        // Override existing app palette to map perfectly to new theme
        indigo: {
          DEFAULT: '#4c0e0e',
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffd1d1',
          300: '#ffb2b2',
          400: '#ff8585',
          500: '#4c0e0e',
          600: '#400c0c',
          700: '#350a0a',
          800: '#2a0808',
          900: '#1f0606',
        },
        terracotta: {
          DEFAULT: '#6B0F10', // Was orange, now Hero/Section backgrounds
          light: '#7A1215',   // Was light orange, now dividers/banners
        },
        kora: {
          light: '#F0E1C6',
          DEFAULT: '#F0E1C6',
          dark: '#dcc09c',
        },
        gold: {
          DEFAULT: '#C9B48A', // Borders, hover states, accents
        },

        // Named theme colors as requested for explicit use
        crimson: {
          hero: '#6B0F10',
          footer: '#4c0e0e',
          divider: '#7A1215',
          cta: '#4c0e0e',
        },
        brand: {
          primary: '#4c0e0e',
          secondary: '#6B0F10',
          accent: '#C9B48A',
        },
        cream: {
          nav: '#E8D5B0',
          product: '#DFC9A0',
          light: '#F0E1C6',
          border: '#C9B48A',
        },
        accent: {
          heading: '#4c0e0e',
          body: '#5C1010',
          light: '#F0E1C6',
          muted: '#BFA882',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'fabric-grain': "url('https://www.transparenttextures.com/patterns/linen-unbleached.png')",
        'paper-texture': "url('https://www.transparenttextures.com/patterns/handmade-paper.png')",
      }
    }
  },
  plugins: [],
}
