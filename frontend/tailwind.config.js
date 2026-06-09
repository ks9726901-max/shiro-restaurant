/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ebony: {
          DEFAULT: '#0B0A0A',
          card: '#151313',
          light: '#201E1E',
        },
        gold: {
          DEFAULT: '#C5A880',
          bright: '#D4AF37',
          hover: '#E6D3B8',
          dark: '#9F845C',
        },
        stone: {
          DEFAULT: '#7D7975',
          border: '#2A2827',
          light: '#A39F9C',
        },
        jade: {
          DEFAULT: '#1A3D3C',
          hover: '#2D6A68',
          light: '#428E8C',
        },
        crimson: {
          DEFAULT: '#8B0000',
          bright: '#C00000',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
