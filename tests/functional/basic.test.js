/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */
it('should position the popper on the right', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/basic.html');

  expect(await page.screenshot()).toMatchImageSnapshot();
});
