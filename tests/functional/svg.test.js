/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should position the popper on the right', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/svg.html');

  expect(await screenshot(page)).toMatchImageSnapshot();
});
