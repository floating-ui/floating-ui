// @flow
module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],
  globals: {
    __DEV__: true,
  },
  globalSetup: 'jest-environment-puppeteer/setup',
  globalTeardown: 'jest-environment-puppeteer/teardown',
  testEnvironment: 'jest-environment-jsdom-sixteen',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['tests/visual/dist'],
};
