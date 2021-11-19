/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should offset the popper correctly', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/offset.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
