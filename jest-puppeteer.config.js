module.exports = {
  browser: process.env.BROWSER || 'chromium',
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
  },
  server: {
    command: 'yarn dev',
    port: 5000,
  },
};
