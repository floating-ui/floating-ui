/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should position the popper on the top', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/relative-html.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
