module.exports = {
  launchBrowserApp: {
    headless: process.env.HEADLESS !== 'false',
    dumpio: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
