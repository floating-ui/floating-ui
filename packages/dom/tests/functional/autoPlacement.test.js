/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should be positioned on top', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/autoPlacement/main.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be positioned on right', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/autoPlacement/main.html`);

  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be positioned on bottom', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/autoPlacement/main.html`);

  await scroll(page, '.scroll1', 400);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(variation) should be positioned at top-start', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/autoPlacement/variation.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(variation) should be positioned at right-end', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/autoPlacement/variation.html`);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('(variation) should be positioned at right-end', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/autoPlacement/variation.html`);

  await scroll(page, 'html', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should only position at right or bottom (not top)', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/autoPlacement/whitelist.html`);

  await scroll(page, '.scroll1', 150);

  expect(await screenshot(page)).toMatchImageSnapshot();

  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
