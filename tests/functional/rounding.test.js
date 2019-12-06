/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('the 4 test cases should all be aligned', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/rounding.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
