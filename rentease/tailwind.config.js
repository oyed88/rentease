/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#16a34a',  // main brand green
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
        },
        earth: {
          50:  '#fdf8f0',
          100: '#faebd7',
          200: '#f5d5aa',
          300: '#edb96b',
          400: '#e09a38',
          500: '#c97c1e',  // warm accent
          600: '#a8621a',
          700: '#874d18',
          800: '#6b3d16',
          900: '#4a2b10',
        },
        dark: '#0f1a0f',
        surface: '#f9fbf9',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
