module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'blue-gray': {
          '50': '#ECEFF1',
          '100': '#CFD8DC',
          '200': '#B0BEC5',
          '300': '#90A4AE',
          '400': '#78909C',
          '500': '#607D8B',
          '600': '#546E7A',
          '700': '#455A64',
          '800': '#37474F',
          '900': '#263238'
        }
      },
      fontFamily: {
        'sans': ['Titillium Web', 'Sans-serif']
      },
      transitionProperty: {
        'box': 'width, height'
       },
      width: {
        '18': '4.5rem'
      }
    }
  },
  variants: {
    extend: {
      width: ['hover']
    }
  },
  plugins: []
}
