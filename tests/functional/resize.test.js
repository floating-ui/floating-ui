/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */

it('should update the position when window is resized', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/resize.html');

  expect(await page.screenshot()).toMatchImageSnapshot();

  await page.setViewport({ width: 400, height: 400 });

  expect(await page.screenshot()).toMatchImageSnapshot();
});
