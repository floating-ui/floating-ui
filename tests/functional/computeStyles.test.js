/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should grow to the left', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/index.html`);

  await scroll(page, '.scroll1', 100);

  await page.evaluate(() => {
    const popper = document.querySelector('#popper');
    if (popper) popper.innerText = 'This is longer than the previous text';
  });

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should grow to the top', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/computeStyles/index.html`);

  await page.evaluate(() => {
    const popper = document.querySelector('#popper');
    if (popper) popper.innerText = 'This is longer than the previous text';
  });

  expect(await screenshot(page)).toMatchImageSnapshot();
});
