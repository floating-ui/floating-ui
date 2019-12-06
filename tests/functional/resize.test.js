/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should update the position when window is resized', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/resize.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();

  await page.setViewport({ width: 400, height: 400 });

  expect(await screenshot(page)).toMatchImageSnapshot();
});
