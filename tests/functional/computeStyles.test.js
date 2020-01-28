/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

// FIXME: enable them again once we migrate to Playwright
it.skip('should grow to the left', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/main.html`);

  await scroll(page, '.scroll1', 100);

  await page.evaluate(() => {
    const popper = document.querySelector('#popper');
    if (popper) popper.innerText = 'This is longer than the previous text';
  });

  expect(await screenshot(page)).toMatchImageSnapshot();
});

// FIXME: enable them again once we migrate to Playwright
it.skip('should grow to the top', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/main.html`);

  await page.evaluate(() => {
    const popper = document.querySelector('#popper');
    if (popper) popper.innerText = 'This is longer than the previous text';
  });

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position the popper on the left', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/adaptive-left.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position the popper on the top', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/adaptive-top.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position the popper on the left (gpu)', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/adaptive-left-gpu.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position the popper on the top (gpu)', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/adaptive-top-gpu.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
