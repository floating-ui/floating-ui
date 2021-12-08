const colors = require('tailwindcss/colors');

module.exports = {
  plugins: [require('@tailwindcss/typography')],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      typography: {
        lg: {
          css: {
            pre: {
              '@media (max-width: 500px)': {
                paddingLeft: '5%',
                paddingRight: '5%',
              },
              lineHeight: '2.1',
              marginBottom: '0',
              ' > code': {
                display: 'flex',
                flexDirection: 'column',
              },
            },
            h1: {
              lineHeight: '1.1',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '@media (max-width: 500px)': {
                fontSize: '2.25rem',
              },
            },
          },
        },
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: '#BFC3D9',
            blockquote: {
              color: '#BFC3D9',
            },
            strong: {
              color: '#fff',
            },
            pre: {
              color: '#cddbf7',
            },
            h1: {
              backgroundClip: 'text',
              color: 'transparent',
              backgroundImage: `linear-gradient(to right, ${colors.yellow['300']}, ${colors.pink['400']})`,
            },
            h2: {
              color: '#fff',
              wordBreak: 'break-word',
            },
            h3: {
              color: '#BFC3D9',
              wordBreak: 'break-word',
            },
            'h2 a': {
              color: 'inherit',
            },
            'h3 a': {
              color: 'inherit',
            },
            code: {
              color: '#93a4b5',
              borderRadius: '4px',
              padding: '2px 4px',
              fontWeight: '500',
              background: '#272935',
              '&::before': {
                display: 'none',
              },
              '&::after': {
                display: 'none',
              },
            },
            a: {
              color: '#87e1fc',
              fontSize: '',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              '&:hover': {
                borderBottomColor: 'inherit',
              },
              '&:active': {
                borderBottomStyle: 'dashed',
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
        gray: {
          1000: '#1c1d24',
          900: '#1F2028',
          800: '#272935',
          700: '#353849',
          600: '#575969',

          200: '#BFC3D9',
          100: '#dcdfec',
          50: '#FFF',
        },
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
        'gradient-heading': '1.1 !important',
      },
    },
  },
  variants: {
    extend: {
      filter: ['hover'],
      saturate: ['hover'],
      brightness: ['hover'],
    },
  },
};
