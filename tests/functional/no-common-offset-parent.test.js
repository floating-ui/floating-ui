/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { screenshot } from '../utils/playwright.js';

it('should be positioned on the right', async () => {
  await page.goto(`${TEST_URL}/no-common-offset-parent.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
