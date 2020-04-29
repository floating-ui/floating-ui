/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { scroll, screenshot } from '../utils/playwright.js';

it('should be positioned on the bottom', async () => {
  await page.goto(`${TEST_URL}/html-scroll-parent.html`);
  await page.setViewport({ width: 800, height: 400 });

  await scroll(page, 'body', 280);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
