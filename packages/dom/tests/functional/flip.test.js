/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should flip from right to bottom', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/main.html`);

  await scroll(page, '.scroll1', 400);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should flip from -end to -start variation', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/checkVariation.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should flip from -end to -start variation while maintaining main axis flipping', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/checkVariation.html`);

  await scroll(page, 'html', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('larger: should be flipped to -end variation', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/checkVariation-larger.html`);

  await scroll(page, 'html', 0);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('larger: should be flipped to -start variation when -end does not fit', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/checkVariation-larger.html`);

  await scroll(page, 'html', 500);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('shorter: should be flipped to -start variation', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/checkVariation-shorter.html`);

  await scroll(page, 'html', 0);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('shorter: should be flipped to original -end variation when it fits', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/checkVariation-shorter.html`);

  await scroll(page, 'html', 600);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should not flip variations with `flipVariations: false`', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/flipVariations-false.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should flip from right to bottom', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/alt-boundary.html`);

  await scroll(page, '.scroll1', 400);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should not flip to the top', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/flip/altAxis-false.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
