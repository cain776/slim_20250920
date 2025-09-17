/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./modals/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#36005E',
          light: '#f5f3ff',
          dark: '#250040'
        }
      },
      fontFamily: {
        sans: ['Pretendard Variable JP', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
