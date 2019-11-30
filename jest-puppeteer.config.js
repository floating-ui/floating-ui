require('dotenv').config();

module.exports = {
  browser: process.env.PUPPETEER_BROWSER,
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
  },
  server: {
    command: 'yarn dev:serve',
    port: 5000,
  },
};
