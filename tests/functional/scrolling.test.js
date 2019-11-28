/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */

it('should update the position when window is resized', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling/scroll.html');

  await page.$eval('#scroll', evt => (evt.scrollTop += 300));

  expect(await page.screenshot()).toMatchImageSnapshot();
});
