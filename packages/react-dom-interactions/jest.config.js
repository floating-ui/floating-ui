/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    __DEV__: true,
  },
  setupFilesAfterEnv: ['<rootDir>/test/unit/setupJest.ts']
};
