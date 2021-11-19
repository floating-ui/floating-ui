/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should take in account margins and borders', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/borders-and-margins.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should take into account the common offset parent border', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/container-border.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
