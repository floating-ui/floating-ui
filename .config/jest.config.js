module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],
  globals: {
    __DEV__: true,
  },
  globalSetup: 'jest-environment-puppeteer/setup',
  globalTeardown: 'jest-environment-puppeteer/teardown',
  testEnvironment: 'jest-environment-jsdom-fourteen',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  reporters: ['default', require.resolve('../tests/image-reporter.js')],
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['tests/visual/dist'],
};
