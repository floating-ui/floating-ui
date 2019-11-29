/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */
import screenshot from '../utils/cleanScreenshot.js';

it('should flip from right to bottom', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/modifiers/flip');

  await page.$eval('.scroll1', evt => (evt.scrollTop += 200));

  expect(await screenshot(page)).toMatchImageSnapshot();

  await page.$eval('.scroll1', evt => (evt.scrollTop += 200));

  expect(await screenshot(page)).toMatchImageSnapshot();
});
