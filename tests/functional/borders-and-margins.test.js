/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should take in account margins and borders', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/borders-and-margins.html');

  expect(await screenshot(page)).toMatchImageSnapshot();
});
