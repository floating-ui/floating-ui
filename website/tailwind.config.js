const colors = require('tailwindcss/colors');

const GRAY = {
  1000: '#18191f',
  900: '#1F2028',
  800: '#272935',
  700: '#353849',
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
            fontSize: '1.125rem',
            h1: {
              fontSize: '3rem',
            },
            pre: {
              lineHeight: '2.1',
              fontSize: '0.875rem',
            },
            code: {
              fontSize: '0.875rem',
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
              span: {
                position: 'relative',
                zIndex: '1',
              },
              code: {
                fontSize: 'inherit',
                whiteSpace: 'pre',
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
                textDecoration: 'underline',
                textDecorationColor: 'transparent',
                textUnderlineOffset: '8px',
                textDecorationThickness: '2px',
                transition:
                  'color 0.2s ease, text-decoration 0.2s ease',
              },
            },
            h3: {
              wordBreak: 'break-word',
              '> a': {
                textDecoration: 'underline',
                textDecorationColor: 'transparent',
                textUnderlineOffset: '8px',
                textDecorationThickness: '2px',
                transition:
                  'color 0.2s ease, text-decoration 0.2s ease',
              },
            },
            h4: {
              '> a': {
                textDecoration: 'underline',
                textDecorationColor: 'transparent',
                textUnderlineOffset: '8px',
                textDecorationThickness: '2px',
                transition:
                  'color 0.2s ease, text-decoration 0.2s ease',
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
    },
  },
};
