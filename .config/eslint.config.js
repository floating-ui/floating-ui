module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype', 'unused-imports'],
  rules: {
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',
  },
  ignorePatterns: [
    'docs',
    'node_modules',
    'tests',
    'lib',
    'flow-typed',
    'dist',
    '/*.js',
    'coverage',
  ],
};
