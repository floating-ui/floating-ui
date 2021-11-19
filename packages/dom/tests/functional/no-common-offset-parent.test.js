/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should be positioned on the right', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/no-common-offset-parent.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
