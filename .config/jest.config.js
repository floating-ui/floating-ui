module.exports = {
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'jest-environment-jsdom-fourteen',
  globalSetup: 'jest-playwright-preset/setup',
  globalTeardown: 'jest-playwright-preset/teardown',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  reporters: ['default', require.resolve('../tests/imageReporter.js')],
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['tests/visual/dist'],
};
