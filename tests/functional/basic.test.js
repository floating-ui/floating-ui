/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot } from '../utils/puppeteer.js';

it('should position the popper on the right', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/basic.html');

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position the popper on the left of a fixed reference', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/basic.html');

  await page.evaluate(() => {
    document.getElementById('fixed-reference').scrollIntoView();
  });

  expect(await screenshot(page)).toMatchImageSnapshot();
});