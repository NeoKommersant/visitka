/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0B0C10',
          medium: '#1F2833',
          light: '#C5C6C7',
          darker: '#151719',
        },
        accent: {
          primary: '#66FCF1',
          secondary: '#45A29E',
          highlight: '#D83F87'
        }
      }
    },
  },
  plugins: [],
}