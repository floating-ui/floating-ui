module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype', 'unused-imports', 'import'],
  rules: {
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': 'error',
    'import/no-unused-modules': ['error', { unusedExports: true }],
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
