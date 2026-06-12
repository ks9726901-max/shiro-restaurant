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
          DEFAULT: '#0B0B0B',
          card: '#151515',
          light: '#222222',
        },
        gold: {
          DEFAULT: '#D4AF37',
          bright: '#F0C23A',
          hover: '#FFE28A',
          dark: '#9A7D1C',
        },
        amber: {
          DEFAULT: '#FFB347',
        },
        burgundy: {
          DEFAULT: '#6D071A',
        },
        ivory: {
          DEFAULT: '#F5F1E8',
        },
        stone: {
          DEFAULT: '#8D8985',
          border: '#282522',
          light: '#F5F1E8',
        },
        jade: {
          DEFAULT: '#1A3D3C',
          hover: '#2D6A68',
          light: '#428E8C',
        },
        crimson: {
          DEFAULT: '#6D071A',
          bright: '#9B1C31',
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
