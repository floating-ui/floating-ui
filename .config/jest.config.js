module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  reporters: ['default', require.resolve('../tests/imageReporter.js')],
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['tests/visual/dist'],
};
