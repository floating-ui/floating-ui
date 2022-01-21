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
          },
        },
        md: {
          css: {
            fontSize: '1.125rem',
            h1: {
              fontSize: '3rem',
            },
          },
        },
        DEFAULT: {
          css: {
            fontSize: '1rem',
            maxWidth: '70ch',
            color: '#b0b2c3',
            blockquote: {
              color: colors.purple['300'],
              fontSize: '90%',
              borderTopRightRadius: '0.25rem',
              borderBottomRightRadius: '0.25rem',
              borderLeftColor: colors.purple['400'],
              borderLeftWidth: '2px',
              backgroundColor: `rgba(200,100,255,0.15)`,
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
              backgroundColor: GRAY['800'],
              lineHeight: '2.1',
              fontSize: 'inherit',
              '> code': {
                display: 'grid',
              },
              '.line': {
                borderLeft: '2px solid transparent',
              },
              '.line.line--highlighted': {
                borderLeftColor: colors.blue['400'],
                backgroundColor: GRAY['700'],
                margin: '0 -1.5rem',
                padding: '0 1.5rem',
              },
              '.word': {
                backgroundColor: 'rgba(200,200,255,0.2)',
                padding: '0.2rem 0.4rem',
                borderRadius: '0.25rem',
              },
            },
            h1: {
              backgroundClip: 'text',
              color: 'transparent',
              backgroundImage: `linear-gradient(to right, ${colors.violet['300']}, ${colors.cyan['400']})`,
              display: 'inline',
              lineHeight: '1.1',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '2.25rem',
            },
            h2: {
              color: '#fff',
              wordBreak: 'break-word',
              '> a': {
                color: GRAY['50'],
                borderBottomColor: 'transparent !important',
              },
              '> a:hover': {
                borderBottomColor: `${GRAY['50']} !important`,
              },
            },
            h3: {
              color: '#BFC3D9',
              wordBreak: 'break-word',
              '> a': {
                color: GRAY['50'],
                borderBottomColor: 'transparent !important',
              },
              '> a:hover': {
                borderBottomColor: `${GRAY['50']} !important`,
              },
            },
            h4: {
              '> a': {
                color: GRAY['50'],
                borderBottomColor: 'transparent !important',
              },
              '> a:hover': {
                borderBottomColor: `${GRAY['50']} !important`,
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
              backgroundColor: GRAY['800'],
            },
            a: {
              color: colors.cyan['400'],
              textDecoration: 'none',
              borderBottom: `2px solid ${colors.cyan['900']}`,
              paddingBottom: '0.1em',
              transition: 'border-color 0.2s !important',
              '&:hover': {
                borderBottomColor: `${colors.cyan['400']} !important`,
              },
              '&:active': {
                color: `${colors.cyan['100']} !important`,
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
