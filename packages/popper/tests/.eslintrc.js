module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['eslint-plugin-jasmine'],
  env: {
    jasmine: true,
  },
  globals: {
    jasmineWrapper: false,
  },
  rules: {
    'no-unused-vars': 1,
  },
};
