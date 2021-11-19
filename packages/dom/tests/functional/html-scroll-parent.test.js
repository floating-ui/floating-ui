/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should be positioned on the bottom', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/html-scroll-parent.html`);
  await page.setViewport({ width: 800, height: 400 });

  await scroll(page, 'body', 280);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
