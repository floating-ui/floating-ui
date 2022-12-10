/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    __DEV__: true,
  },
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
};
