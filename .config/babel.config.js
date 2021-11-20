const BROWSER_COMPAT = process.env.BROWSER_COMPAT === 'true';

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        modules: false,
        targets: '> 1%, not dead',
        useBuiltIns: false,
      },
    ],
    '@babel/react',
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    'babel-plugin-add-import-extension',
    ...(BROWSER_COMPAT
      ? [
          [
            'inline-replace-variables',
            {
              __DEV__: false,
            },
          ],
        ]
      : ['dev-expression']),
    'annotate-pure-calls',
  ],
  env: {
    test: {
      presets: [['@babel/env', { targets: 'current node' }]],
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
