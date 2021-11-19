/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot, scroll } from '../utils/puppeteer.js';

it('should be positioned on the bottom', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/containing-block.html`);
  await scroll(page, '#containing-block', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
