const colors = require('tailwindcss/colors');

const GRAY = {
  1000: '#18191f',
  900: '#1F2028',
  800: '#272935',
  700: '#2d2e3a',
  600: '#575969',

  200: '#BFC3D9',
  150: '#B0B2C3',
  100: '#dcdfec',
  75: '#f1f3f7',
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
      keyframes: {
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
              '.line': {
                margin: '0 -1.5rem',
                padding: '0 1.5rem',
              },
              '.word': {
                padding: '0.2rem 0',
                borderRadius: '0.25rem',
                zIndex: '0',
              },
              '&::before': {
                position: 'absolute',
                fontSize: '80%',
                right: '0.6rem',
                top: '0.2rem',
                content: 'attr(data-language)',
                textTansform: 'uppercase',
              },
              '&[data-theme="light"]::before': {
                color: GRAY[1000],
              },
              '&[data-theme="dark"]::before': {
                color: GRAY[50],
              },
              'code[data-theme="light"] .line--highlighted': {
                borderLeftColor: colors.rose[400],
                backgroundColor: colors.orange[50],
              },
              'code[data-theme="dark"] .line--highlighted': {
                borderLeftColor: colors.rose[400],
                backgroundColor: `rgb(221 214 254 / 0.1)`,
              },
              'code[data-theme="light"] .word': {
                backgroundColor: colors.orange[100],
                boxShadow: `0 0 0 1px ${colors.orange[100]}`,
              },
              'code[data-theme="dark"] .word': {
                backgroundColor: 'rgba(200,200,255,0.2)',
                boxShadow: '0 0 0 1px rgb(200 200 255 / 20%)',
              },
              'code[data-theme="dark"] [data-word-id="a"]': {
                backgroundColor: theme.colors.rose[800],
                color: theme.colors.rose[200],
                boxShadow: `0 0 0 1px ${theme.colors.rose[800]}`,
              },
              'code[data-theme="dark"] [data-word-id="b"]': {
                backgroundColor: theme.colors.cyan[800],
                color: theme.colors.cyan[200],
                boxShadow: `0 0 0 1px ${theme.colors.cyan[800]}`,
              },
              'code[data-theme="light"] [data-word-id="a"]': {
                backgroundColor: theme.colors.rose[100],
                color: theme.colors.rose[900],
                boxShadow: `0 0 0 1px ${theme.colors.rose[100]}`,
              },
              'code[data-theme="light"] [data-word-id="b"]': {
                backgroundColor: theme.colors.cyan[100],
                color: theme.colors.cyan[900],
                boxShadow: `0 0 0 1px ${theme.colors.cyan[100]}`,
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
