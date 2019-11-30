/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should flip from right to bottom', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/modifiers/flip');

  await scroll(page, '.scroll1', 400);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
