// @flow
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

global.TEST_URL = `http://localhost:8080`;

global.console = {
  log: console.log,
};

beforeEach(() => {
  global.console.error = jest.fn();
  global.console.warn = jest.fn();
});
