module.exports = () =>
  ({
    browser: process.env.BROWSER || 'chromium',
    launch: {
      dumpio: true,
      headless: process.env.HEADLESS !== 'false',
    },
    server: {
      command: 'yarn dev:serve',
      port: 5000,
    },
  }());
