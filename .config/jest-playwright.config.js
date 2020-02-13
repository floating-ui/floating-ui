module.exports = {
  launchBrowserApp: {
    headless: process.env.HEADLESS !== 'false',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
