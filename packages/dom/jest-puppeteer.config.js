// @flow
require('dotenv').config();

module.exports = {
  launch: {
    dumpio: false,
    headless: process.env.HEADLESS !== 'false',
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    args: ['--no-sandbox'],
    product: process.env.PUPPETEER_BROWSER,
  },
  server: {
    command: `rollup -c && serve -l 8080 tests/visual`,
    port: 8080,
    launchTimeout: 10 * 1000,
  },
};
