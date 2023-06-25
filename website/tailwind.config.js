const colors = require('tailwindcss/colors');
const {fontFamily} = require('tailwindcss/defaultTheme');

const GRAY = {
  1000: '#18191f',
  900: '#1F2028',
  800: '#272935',
  700: '#2d2e3a',
  600: '#575969',

  200: '#BFC3D9',
  150: '#B0B2C3',
  100: '#dcdfec',
  75: '#f3f3f7',
  50: '#fff',
};

module.exports = {
  plugins: [require('@tailwindcss/typography')],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        variable: ['var(--font-variable)', ...fontFamily.sans],
      },
      keyframes: {
        'blur-in': {
          '0%': {
            filter: 'brightness(1) blur(10px)',
            transform: 'scale(0.94)',
          },
          '10%': {
            filter: 'brightness(1.15) blur(5px)',
            transform: 'scale(0.98)',
          },
          '100%': {
            filter: 'brightness(1) blur(0)',
            transform: 'scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'rotate(-1deg) translate(-0.1rem, 1rem)',
          },
          '50%': {
            transform: 'rotate(2deg)',
          },
          '75%': {
            transform:
              'rotate(0.5deg) translate(0.25rem, 0.5rem)',
          },
        },
        string: {
          '25%': {
            transform:
              'translate(0.02rem, -0.05rem) scaleY(1.03) scaleX(1.02)',
          },
          '50%': {
            transform:
              'translate(0.1rem, 0.1rem) scaleY(1.05) scaleX(0.95)',
          },
          '75%': {
            transform:
              'translate(0.05rem, 0.05rem) scaleY(0.96) scaleX(1)',
          },
        },
      },
      animation: {
        'blur-in': 'blur-in 1s cubic-bezier(0, 0.55, 0.45, 1)',
        float: 'float 8s ease infinite',
        string: 'string 0.25s ease-in-out infinite',
      },
      typography: ({theme}) => ({
        lg: {
          css: {
            h1: {
              fontSize: '3.5rem',
            },
            'h2 > a': {
              fontSize: '2rem',
            },
            pre: {
              lineHeight: '2.1',
              fontSize: '0.9375rem',
              padding: '1rem 1.5rem',
            },
            code: {
              fontSize: '0.9375rem',
              whiteSpace: 'pre',
            },
            img: {
              margin: '0',
            },
          },
        },
        md: {
          css: {
            fontSize: '1.075rem',
            h1: {
              fontSize: '3rem',
            },
            'h2 > a': {
              fontSize: '2rem',
            },
            pre: {
              lineHeight: '2.1',
              fontSize: '0.875rem',
            },
            code: {
              fontSize: '0.875em',
              whiteSpace: 'pre',
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
            '--tw-prose-body': theme('colors.gray[800]'),
            '--tw-prose-invert-body': theme('colors.gray[150]'),
            '--tw-prose-bullets': theme('colors.gray[800]'),
            '--tw-prose-invert-bullets': theme(
              'colors.gray[150]'
            ),
            'a code': {
              color: 'inherit !important',
            },
            'a:has(code)': {
              textDecorationThickness: '1px',
              textUnderlineOffset: '3px',
            },
            img: {
              margin: '0',
            },
            '.card': {
              maxWidth: '100%',
            },
            fontSize: '1rem',
            maxWidth: '70ch',
            '[data-rehype-pretty-code-fragment]': {
              position: 'relative',
            },
            pre: {
              padding: '1rem 1.5rem',
              lineHeight: '2',
              '> code': {
                display: 'grid',
                fontSize: 'inherit',
                boxShadow: 'none',
              },
              '[data-line]': {
                margin: '0 -1.5rem',
                padding: '0 1.5rem',
              },
              '[data-highlighted-chars]': {
                padding: '0.2rem 0',
                borderRadius: '0.25rem',
                zIndex: '0',
              },
              '&::before': {
                position: 'absolute',
                fontSize: '0.8rem',
                right: '0',
                top: '0',
                content: 'attr(data-language)',
                padding: '0.25rem 0.5rem',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 'bold',
                borderRadius: '0.25rem 0.25rem 0 0',
                lineHeight: '1.5',
              },
              '&[data-theme="light"]::before': {
                background: GRAY[50],
                color: GRAY[700],
              },
              '&[data-theme="dark"]::before': {
                background: GRAY[800],
                color: GRAY[200],
              },
              'code[data-theme="light"] [data-highlighted-line]':
                {
                  borderLeftColor: colors.rose[400],
                  backgroundColor: colors.orange[50],
                },
              'code[data-theme="dark"] [data-highlighted-line]':
                {
                  borderLeftColor: colors.rose[400],
                  backgroundColor: `rgb(221 214 254 / 0.1)`,
                },
              'code[data-theme="light"] [data-highlighted-chars]':
                {
                  backgroundColor: colors.orange[100],
                  boxShadow: `0 0 0 1px ${colors.orange[100]}`,
                },
              'code[data-theme="dark"] [data-highlighted-chars]':
                {
                  backgroundColor: 'rgba(200,200,255,0.2)',
                  boxShadow: '0 0 0 1px rgb(200 200 255 / 20%)',
                },
              '[data-chars-id]': {
                borderBottom: '1px solid transparent',
                boxShadow: 'none',
                padding: '0.25rem',
              },
              'code[data-theme="dark"] [data-chars-id="a"]': {
                backgroundColor: theme.colors.rose[800],
                color: `${theme.colors.rose[200]} !important`,
                borderBottomColor: theme.colors.rose[500],
                boxShadow: 'none',
              },
              'code[data-theme="dark"] [data-chars-id="b"]': {
                backgroundColor: theme.colors.cyan[800],
                color: `${theme.colors.cyan[200]} !important`,
                borderBottomColor: theme.colors.cyan[500],
                boxShadow: 'none',
              },
              'code[data-theme="light"] [data-chars-id="a"]': {
                backgroundColor: theme.colors.rose[100],
                color: `${theme.colors.rose[900]} !important`,
                borderBottomColor: theme.colors.rose[300],
                boxShadow: 'none',
              },
              'code[data-theme="light"] [data-chars-id="b"]': {
                backgroundColor: theme.colors.cyan[100],
                color: `${theme.colors.cyan[900]} !important`,
                borderBottomColor: theme.colors.cyan[300],
                boxShadow: 'none',
              },
              span: {
                position: 'relative',
                zIndex: '1',
              },
              code: {
                fontSize: 'inherit',
                background: 'inherit',
                whiteSpace: 'pre',
                border: 'none',
              },
            },
            h1: {
              display: 'inline',
              lineHeight: '1.1',
              wordBreak: 'break-word',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '2.25rem',
            },
            h2: {
              wordBreak: 'break-word',
              '> a': {
                textDecoration: 'none',
              },
            },
            h3: {
              wordBreak: 'break-word',
              '> a': {
                textDecoration: 'none',
              },
            },
            h4: {
              '> a': {
                textDecoration: 'none',
              },
            },
            code: {
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
              padding: '0.3rem 0.4rem',
            },
            'blockquote p:first-of-type::before': {
              display: 'none',
            },
          },
        },
      }),
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
        'dark-nav-gradient': `linear-gradient(
          195deg,
          hsl(348deg 10% 90%) 0%,
          hsl(351deg 31% 80%) 2%,
          hsl(325deg 45% 69%) 6%,
          hsl(330deg 32% 57%) 12%,
          hsl(320deg 22% 48%) 19%,
          hsl(285deg 22% 33%) 27%,
          hsl(240deg 20% 22%) 38%,
          hsl(232deg 18% 17%) 50%,
          hsl(232deg 13% 14%) 68%,
          hsl(233deg 15% 14%) 100%
        )`,
        'light-nav-gradient': `linear-gradient(
          195deg, 
          rgb(245, 245, 255) 0%, 
          rgb(245, 200, 255) 2%, 
          rgb(255 210 225) 6%, 
          rgb(255 227 225) 12%, 
          rgb(249, 246, 248) 19%, 
          rgb(240, 240, 255) 27%, 
          rgb(245, 245, 255) 38%, 
          rgb(240, 252, 253) 50%, 
          rgb(252, 252, 253) 68%, 
          rgb(255, 255, 255) 100%
        )`,
      },
    },
  },
};
