/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
       '--surface-container-low': '#F2F5EA',
        '--primary': '#436833',
        '--primary-hover': '#2D462B',
        '--main-font-color': '#212121',
        '--on-primary': '#ffffff',
        '--surface-container': '#f9f9f9',
        '--primary-container': '#f0f1ee',
        '--primary-container-hover': '#f0f1ee',
        '--secondary-container':' #C0D0B4',
        '--on-primary-container': '#052100a3',
        '--secondary': '#55624C',
        '--outline': '#73796E',
        '--outline-variation': '#C3C8BB',
        '--tertiary': '#386667',
        '--tertiary-container': '#BBEBEC',
        '--surface-bright':'#F8FAF0',
        '--surface-container-highest': '#E1E4DA',
        '--surface-container-highest-hover': '#C9CEBD',
        '--surface': '#F8FAF0',
        '--search-bar': '#F2F2F2',
        '--accent-pink': '#f6dbff',
        '--on-accent-pink': '#661a7f',
        '--accent-blue': '#c2d5ff',
        '--on-accent-blue': '#1F3D73',
        '--accent-amber': '#FFD79A',
        '--on-accent-amber': '#6A4300',
      },
      fontFamily: {
        Roboto: ['"Roboto"', ...defaultTheme.fontFamily.sans],
        Quicksand: ['"Quicksand"', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}

