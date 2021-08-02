require('dotenv').config();

module.exports = {
  browser: process.env.PUPPETEER_BROWSER,
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    args: ['--no-sandbox'],
  },
  server: {
    command: `yarn build:dev && DEV_PORT=${process.env.DEV_PORT} yarn serve`,
    port: process.env.DEV_PORT,
  },
};
