/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { screenshot } from '../utils/playwright.js';

it('should position the popper on the right', async () => {
  await page.goto(`${TEST_URL}/svg.html`);

  expect(await screenshot(page)).toMatchImageSnapshot({
    failureThreshold: 0.01,
    failureThresholdType: 'percent',
  });
});
