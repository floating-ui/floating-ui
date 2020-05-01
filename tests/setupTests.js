// @flow
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

global.TEST_URL = `http://localhost:${process.env.DEV_PORT || '5000'}`;

global.console = {
  log: console.log,
};

beforeAll(() => {
  page != null &&
    page.on('console', (m) =>
      console.log('Console message: ' + m.text() + '; URL: ' + page.url())
    );
});

beforeEach(() => {
  global.console.error = jest.fn();
  global.console.warn = jest.fn();
});
