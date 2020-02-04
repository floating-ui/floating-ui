// https://github.com/smooth-code/jest-puppeteer/issues/160#issuecomment-491975158
process.env.JEST_PUPPETEER_CONFIG = require.resolve(
  './jest-playwright.config.js'
);

module.exports = {
  testMatch: ['<rootDir>/src/**/*.test.js', '<rootDir>/tests/**/*.test.js'],
  globals: {
    __DEV__: true,
  },
  testEnvironment: 'jest-environment-jsdom-sixteen',
  globalSetup: 'jest-playwright-preset/setup',
  globalTeardown: 'jest-playwright-preset/teardown',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  reporters: ['default', require.resolve('../tests/imageReporter.js')],
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['tests/visual/dist'],
};
