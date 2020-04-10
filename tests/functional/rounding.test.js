/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { screenshot } from '../utils/playwright.js';

it('the 4 test cases should all be aligned', async () => {
  await page.goto(`${TEST_URL}/rounding.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
