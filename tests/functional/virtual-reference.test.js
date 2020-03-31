/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should follow the cursor', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/virtual-reference.html`);

  await scroll(page, '#scroll', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
