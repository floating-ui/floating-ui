// @flow
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

global.TEST_URL = `http://localhost:${process.env.DEV_PORT || '5000'}`;
