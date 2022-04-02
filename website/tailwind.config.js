const colors = require('tailwindcss/colors');

const GRAY = {
  1000: '#18191f',
  900: '#1F2028',
  800: '#272935',
  700: '#353849',
  600: '#575969',

  200: '#BFC3D9',
  100: '#dcdfec',
  50: '#FFF',
};

module.exports = {
  plugins: [require('@tailwindcss/typography')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      typography: {
        lg: {
          css: {
            h1: {
              fontSize: '3.5rem',
            },
            'h2 > a': {
              fontSize: '2rem',
            },
            pre: {
              fontSize: '1.05rem',
              lineHeight: '2.1',
            },
            img: {
              margin: '0',
            },
          },
        },
        md: {
          css: {
            fontSize: '1.125rem',
            h1: {
              fontSize: '3rem',
            },
            pre: {
              lineHeight: '2.1',
            },
            img: {
              margin: '0',
            },
            '.card': {
              maxWidth: 'calc(50% - 5px)',
            },
          },
        },
        DEFAULT: {
          css: {
            img: {
              margin: '0',
            },
            '.card': {
              maxWidth: '100%',
            },
            fontSize: '1rem',
            maxWidth: '70ch',
            color: '#b0b2c3',
            blockquote: {
              color: colors.rose[300],
              fontSize: '90%',
              borderTopRightRadius: '0.25rem',
              borderBottomRightRadius: '0.25rem',
              borderLeftColor: colors.rose[400],
              borderLeftWidth: '2px',
              backgroundColor: `rgba(255,125,225,0.15)`,
              padding: '0.25rem 0.5rem 0.25rem 1rem',
              '> p': {
                margin: 0,
              },
            },
            strong: {
              color: '#fff',
            },
            pre: {
              color: '#cddbf7',
              padding: '1rem 1.5rem',
              lineHeight: '2',
              backgroundColor: '#282834',
              '> code': {
                display: 'grid',
              },
              '.line': {
                borderLeft: '2px solid transparent',
                margin: '0 -1.5rem',
                padding: '0 1.5rem',
              },
              '.line.line--highlighted': {
                borderLeftColor: colors.rose[400],
                backgroundColor: '#3b3547',
              },
              span: {
                position: 'relative',
                zIndex: '1',
              },
              '.word': {
                backgroundColor: 'rgba(200,200,255,0.2)',
                padding: '0.2rem 0',
                borderRadius: '0.25rem',
                boxShadow:
                  '-2px 0 0 1px #48485d, 2px 0 0 1px #48485d',
                zIndex: '0',
              },
            },
            h1: {
              display: 'inline',
              lineHeight: '1.1',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '2.25rem',
              color: 'white',
            },
            h2: {
              color: '#fff',
              wordBreak: 'break-word',
              '> a': {
                color: GRAY[50],
                borderBottomColor: 'transparent',
              },
              '> a:hover': {
                color: GRAY[50],
                borderBottomColor: GRAY[50],
              },
            },
            h3: {
              color: '#BFC3D9',
              wordBreak: 'break-word',
              '> a': {
                color: GRAY[50],
                borderBottomColor: 'transparent',
              },
              '> a:hover': {
                color: GRAY[50],
                borderBottomColor: GRAY[50],
              },
            },
            h4: {
              '> a': {
                color: GRAY[50],
                borderBottomColor: 'transparent',
              },
              '> a:hover': {
                color: GRAY[50],
                borderBottomColor: GRAY[50],
              },
            },
            code: {
              color: '#b4c2f0',
              fontWeight: '500',
              '&::before': {
                display: 'none',
              },
              '&::after': {
                display: 'none',
              },
            },
            ':not(pre) > code': {
              borderRadius: '0.25rem',
              padding: '0.2rem 0.4rem',
              backgroundColor: '#30303e',
            },
            a: {
              color: colors.rose[300],
              textDecoration: 'none',
              borderBottom: `2px solid #744d60`,
              paddingBottom: '0.1em',
              transition: 'border-color 0.15s, color 0.15s',
              '&:hover': {
                borderBottomColor: `${colors.rose[200]}`,
                color: `${colors.rose[200]}`,
              },
              '&:active': {
                borderBottomColor: `${colors.rose[100]}`,
              },
            },
            'a code': {
              color: '#fff',
            },
            'blockquote p:first-of-type::before': {
              display: 'none',
            },
          },
        },
      },
      colors: {
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: GRAY,
      },
      zIndex: {
        '-1': '-1',
      },
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(circle at 50% 10%, var(--tw-gradient-stops))',
      },
      inset: {
        '-32': '-128px',
      },
      width: {
        '1200px': '1200px',
      },
      height: {
        128: '32rem',
      },
      lineHeight: {
        'gradient-heading': '1.15 !important',
      },
    },
  },
};
