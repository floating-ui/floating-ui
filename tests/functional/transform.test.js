/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should position the popper on the right when the reference element is scaled', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/transform/reference-scaled.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position the popper on the right when the popper element is scaled', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/transform/popper-scaled.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it.skip('should position the popper on the right when the parent element is scaled', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/transform/parent-scaled.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position the popper on the right when the reference element and popper element have different scales', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/transform/different-scales.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
