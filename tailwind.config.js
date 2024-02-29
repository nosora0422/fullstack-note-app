/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
       '--surface-container-low': '#F2F5EA',
        '--primary': '#436833',
        '--main-font-color': '#212121',
        '--on-primary': '#ffffff',
        '--surface-container': '#ECEFE5;',
        '--primary-container': '#C4EFAC',
        '--secondary-container':' #C0D0B4',
        '--on-primary-container': '#052100',
        '--secondary': '#55624C',
        '--outline': '#73796E',
        '--outline-variation': '#C3C8BB',
        '--tertiary': '#386667',
        '--tertiary-container': '#BBEBEC',
        '--surface-bright':'#F8FAF0',
        '--surface-container-highest': '#E1E4DA',
        '--surface': '#F8FAF0',
        '--search-bar': '#F2F2F2'
      },
      fontFamily: {
        Roboto: ['"Roboto"', ...defaultTheme.fontFamily.sans],
        Quicksand: ['"Quicksand"', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}

