// https://github.com/smooth-code/jest-puppeteer/issues/160#issuecomment-491975158
process.env.JEST_PUPPETEER_CONFIG = require.resolve(
  './jest-puppeteer.config.js'
);

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
  reporters: ['default', require.resolve('../tests/image-reporter.js')],
  setupFiles: ['dotenv/config'],
  modulePathIgnorePatterns: ['tests/visual/dist'],
};
