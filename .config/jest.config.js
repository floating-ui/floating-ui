// https://github.com/smooth-code/jest-puppeteer/issues/160#issuecomment-491975158
process.env.JEST_PLAYWRIGHT_CONFIG = require.resolve(
  './jest-playwright.config.js'
);

module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],
  globals: {
    __DEV__: true,
  },
  globalSetup: 'jest-playwright-preset/setup',
  globalTeardown: 'jest-playwright-preset/teardown',
  testEnvironment: 'jest-environment-jsdom-sixteen',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  reporters: ['default', require.resolve('../tests/imageReporter.js')],
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['tests/visual/dist'],
};
