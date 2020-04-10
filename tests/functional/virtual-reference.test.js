/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { scroll, screenshot } from '../utils/playwright.js';

it('should follow the cursor', async () => {
  await page.goto(`${TEST_URL}/virtual-reference.html`);

  await scroll(page, '#scroll', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
