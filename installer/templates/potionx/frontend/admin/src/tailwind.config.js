module.exports = {
  purge: [
    'src/**/*.tsx?',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderRadius: {
      'sm': '0.125rem',
      'base': '0.25rem',
      'md': '0.35rem',
      'lg': '0.5rem',
      'xl': '0.75rem',
      '2xl': "1rem",
      '3xl': '1.5rem',
      '4xl': '2rem',
      '5xl': '2.5rem',
      '6xl': '3rem',
      '7xl': '3.5rem',
      '8xl': '4rem'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      serif: ['Inter', 'sans-serif']
    },
    fontSize: {
      '3xs': ['8px', '1.25'],
      '2xs': ['10px', '1.25'],
      xs: ['12px', '1.25'],
      sm: ['14px', '1.25'],
      base: ['16px', '1.4'],
      lg: ['18px', '1.4'],
      xl: ['20px', '1.4'],
      '2xl': ['24px', '1.3'],
      '3xl': ['30px', '1.3'],
      '4xl': ['32px', '1.3'],
      '5xl': ['40px', '1.2'],
      '6xl': ['48px', '1.2'],
      '7xl': ['68px', '1.1'],
      '8xl': ['80px', '1.1'],
      '9xl': ['92px', '1.1']
    },
    maxWidth: {
      '50': '50px',
      '100': '100px',
      '150': '150px',
      '200': '200px',
      '250': '250px',
      '300': '300px',
      '350': '350px',
      '400': '400px',
      '450': '450px',
      '500': '500px',
      '550': '550px',
      '600': '600px',
      '650': '650px',
      '700': '700px',
      '750': '750px',
      '800': '800px',
      '850': '850px',
      '900': '900px',
      '950': '950px',
      '1000': '1000px',
      '1050': '1050px',
      '1100': '1100px',
      '1150': '1150px',
      '1200': '1200px',
      '1250': '1250px',
      '1300': '1300px',
      '1350': '1350px',
      '1400': '1400px',
      '1450': '1450px',
      '1-4': '25%',
      '1-3': '33.3333333%',
      '1-2': '50%',
      '2-3': '66.6666666%',
      '3-4': '75%'
    },
    screens: {
      's350': '350px',
      's450': '450px',
      's550': '550px',
      's650': '650px',
      's750': '750px',
      's850': '850px',
      's950': '950px',
      's1050': '1050px',
      's1150': '1150px',
      's1250': '1250px',
      's1350': '1350px',
      's1450': '1450px',
      's1550': '1550px',
      's1650': '1650px',
      's1750': '1750px',
      's1850': '1850px',
      's1950': '1950px',
      's2050': '2050px',
      's2150': '2150px',
      's2250': '2250px',
      's2350': '2350px',
      's2450': '2450px',
      's2550': '2550px',
      's350m': {
        'max': '349px'
      },
      's450m': {
        'max': '449px'
      },
      's550m': {
        'max': '549px'
      },
      's650m': {
        'max': '649px'
      },
      's750m': {
        'max': '749px'
      },
      's850m': {
        'max': '849px'
      },
      's950m': {
        'max': '949px'
      },
      's1050m': {
        'max': '1049px'
      },
      's1150m': {
        'max': '1149px'
      },
      's1250m': {
        'max': '1249px'
      },
      's1350m': {
        'max': '1349px'
      },
      's1450m': {
        'max': '1449px'
      },
      's1550m': {
        'max': '1549px'
      },
      's1650m': {
        'max': '1649px'
      },
      's1750m': {
        'max': '1749px'
      },
      's1850m': {
        'max': '1849px'
      },
      's1950m': {
        'max': '1949px'
      },
      's2050m': {
        'max': '2049px'
      },
      's2150m': {
        'max': '2149px'
      },
      's2250m': {
        'max': '2249px'
      },
      's2350m': {
        'max': '2349px'
      },
      's2450m': {
        'max': '2449px'
      },
      's2550m': {
        'max': '2549px'
      }
    },
    zIndex: {
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '7',
      '8': '8',
      '9': '9'
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}