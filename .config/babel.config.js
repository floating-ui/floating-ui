const MJS = process.env.MJS === 'true';

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
    [
      'babel-plugin-add-import-extension',
      {
        extension: MJS ? 'mjs' : 'js',
      },
    ],
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        loose: true,
        useBuiltIns: true,
      },
    ],
    ...(MJS
      ? [
          [
            'inline-replace-variables',
            {
              __DEV__: false,
            },
          ],
        ]
      : ['dev-expression']),
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
