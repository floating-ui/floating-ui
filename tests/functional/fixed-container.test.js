/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/playwright.js';

it('should position the popper on the top', async () => {
  await page.goto(`${TEST_URL}/fixed-container.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
