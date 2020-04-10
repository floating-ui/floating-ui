/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { screenshot } from '../utils/playwright.js';

it('should offset the popper correctly', async () => {
  await page.goto(`${TEST_URL}/modifiers/offset.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
