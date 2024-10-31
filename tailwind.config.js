/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        ocean: {
          DEFAULT: '#004851', // PMS 316C
          50: '#004851/5',
          100: '#004851/10',
          200: '#004851/20',
          900: '#004851/90',
        },
        sky: {
          DEFAULT: '#DAEEF1', // PMS 628C
          50: '#DAEEF1/5',
          100: '#DAEEF1/10',
          200: '#DAEEF1/20',
        },
        kitchen: {
          DEFAULT: '#F1B434', // PMS 143C
          hover: '#d99b1d',
        },
        fish: {
          DEFAULT: '#5CB8B2', // PMS 7472C
          hover: '#4a9691',
        },
        rock: {
          DEFAULT: '#CF4520', // PMS 173C
          hover: '#b33a1b',
        },
        neutral: {
          DEFAULT: '#231F20', // Neutral Black C
          50: '#231F20/5',
          100: '#231F20/10',
          200: '#231F20/20',
          300: '#231F20/30',
          400: '#231F20/40',
          500: '#231F20/50',
          600: '#231F20/60',
          700: '#231F20/70',
          800: '#231F20/80',
          900: '#231F20/90',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};