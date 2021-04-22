module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      animation: {
        'increase': 'increase 2s infinite',
        'decrease': 'decrease 2s 0.5s infinite'
      },
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
        },
        'primary-dark': '#1D1F20',
        'secondary': '#F9DCE1',
        'primary': '#36393A',
        'secondary-light': '#F7F1F8'
      },
      fontFamily: {
        'sans': ['Titillium Web', 'Sans-serif']
      },
      keyframes: {
        'increase': {
          'from': {
            'left': '-5%',
            'width': '5%'
          },
          'to': {
            'left': '-130%',
            'width': '100%'
          }
        },
        'decrease': {
          'from': {
            'left': '-80%',
            'width': '80%'
          },
          'to': {
            'left': '100%',
            'width': '10%'
          }
        }
      },
      margin: {
        '4.5': '1.125rem'
      },
      transitionProperty: {
        'box': 'width, height'
       },
      width: {
        '18': '4.5rem',
        '3/2': '150%'
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

