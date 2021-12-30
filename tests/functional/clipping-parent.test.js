/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it.skip('is positioned at bottom-start', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/clipping-parent.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
