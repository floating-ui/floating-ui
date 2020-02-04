/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should update the position when window is resized', async () => {
  await page.goto(`${TEST_URL}/resize.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();

  await page.setViewport({ width: 400, height: 400 });

  expect(await screenshot(page)).toMatchImageSnapshot();
});
