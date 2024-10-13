/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B6A6D9',
        secondary: 'rgb(38, 38, 38);',
        tertiary:'rgb(241,241,241)'
      }
    },
  },
  plugins: [],
}

