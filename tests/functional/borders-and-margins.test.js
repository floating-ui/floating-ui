/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */
it('should take in account margins and borders', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/borders-and-margins.html');

  expect(await page.screenshot()).toMatchImageSnapshot();
});
