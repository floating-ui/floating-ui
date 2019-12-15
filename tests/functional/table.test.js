/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('td: should position the popper on the right', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/td.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('th: should position the popper on the right', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/th.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
