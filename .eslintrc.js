module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['packages/vue/**/*.{js,ts}'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-undef': 'off',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: 'useModernLayoutEffect',
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
  },
  settings: {
    react: {
      version: '18',
    },
  },
};
