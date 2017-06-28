module.exports = {
  presets: [require.resolve('babel-preset-stage-2')],
  plugins: [require.resolve('babel-plugin-external-helpers')],
  env: {
    coverage: {
      plugins: [
        [
          require.resolve('babel-plugin-istanbul'),
          {
            exclude: ['tests/**'],
          },
        ],
      ],
    },
  },
};
