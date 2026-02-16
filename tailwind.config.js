/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        board: {
          todo: 'rgb(99 102 241)',
          doing: 'rgb(245 158 11)',
          done: 'rgb(34 197 94)',
        },
      },
    },
  },
  plugins: [],
};
