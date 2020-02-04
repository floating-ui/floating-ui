/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should be positioned on top', async () => {
  await page.goto(`${TEST_URL}/auto/main.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be positioned on right', async () => {
  await page.goto(`${TEST_URL}/auto/main.html`);

  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be positioned on bottom', async () => {
  await page.goto(`${TEST_URL}/auto/main.html`);

  await scroll(page, '.scroll1', 400);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(variation) should be positioned at top-start', async () => {
  await page.goto(`${TEST_URL}/auto/variation.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(variation) should be positioned at right-start', async () => {
  await page.goto(`${TEST_URL}/auto/variation.html`);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(variation) should be positioned at right-end', async () => {
  await page.goto(`${TEST_URL}/auto/variation.html`);

  await scroll(page, 'html', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
