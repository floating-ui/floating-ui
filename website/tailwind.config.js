const colors = require('tailwindcss/colors');

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
            h2: {
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
            color: '#BFC3D9',
            blockquote: {
              color: '#BFC3D9',
            },
            strong: {
              color: '#fff',
            },
            pre: {
              color: '#cddbf7',
              padding: '1rem 1.5rem',
              backgroundColor: '#272935',
              lineHeight: '2.1',
              fontSize: 'inherit',
              '> code': {
                display: 'table',
                width: '100%',
              },
            },
            h1: {
              backgroundClip: 'text',
              color: 'transparent',
              backgroundImage: `linear-gradient(to right, ${colors.yellow['300']}, ${colors.orange['300']})`,
              display: 'inline',
              lineHeight: '1.1',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '2.25rem',
            },
            h2: {
              fontSize: '1.5rem',
              color: '#fff',
              wordBreak: 'break-word',
              '> a': {
                color: 'inherit',
              },
              '&:hover > a': {
                textDecoration: 'underline',
              },
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
              fontWeight: '500',
              background: '#272935',
              '&::before': {
                display: 'none',
              },
              '&::after': {
                display: 'none',
              },
            },
            ':not(pre) > code': {
              padding: '2px 4px',
            },
            a: {
              color: colors.blue[400],
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              '&:hover': {
                borderBottomColor: 'inherit !important',
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
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
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
};
