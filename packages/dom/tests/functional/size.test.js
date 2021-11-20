/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('(base) all 4 should be limited in size', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/size/base.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(variation) all 4 should be limited in size', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/size/variation.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
