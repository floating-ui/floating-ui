/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should not overflow when small reference is at edge of boundary', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/preventOverflow/edge.html`);

  await scroll(page, '#scroll', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should overflow with the arrow length taken into account', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/preventOverflow/arrow.html`);

  await scroll(page, '#scroll', 330);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
