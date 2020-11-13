const BROWSER_COMPAT = process.env.BROWSER_COMPAT === 'true';

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    'babel-plugin-add-import-extension',
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        loose: true,
        useBuiltIns: true,
      },
    ],
    ...(BROWSER_COMPAT
      ? [
          [
            'inline-replace-variables',
            {
              __DEV__: false,
            },
          ],
        ]
      : [
          [
            'inline-replace-variables',
            {
              __DEV__: {
                type: 'node',
                replacement: `typeof process !== 'undefined' && process.env.NODE_ENV !== "production"`,
              },
            },
          ],
        ]),
    'annotate-pure-calls',
  ],
  env: {
    test: {
      presets: ['@babel/env'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
    dev: {
      plugins: [
        [
          'transform-inline-environment-variables',
          {
            include: ['NODE_ENV'],
          },
        ],
      ],
    },
  },
};
