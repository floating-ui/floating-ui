module.exports = {
  launchBrowserApp: {
    headless: process.env.HEADLESS !== 'false',
    args: process.env.BROWSER === 'chromium' ? ['--no-sandbox', '--disable-setuid-sandbox'] : []
  },
};
