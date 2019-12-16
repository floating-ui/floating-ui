/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot, scroll } from '../utils/puppeteer.js';

it('should position popper on right when reference is in table', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/basic.html`);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position popper on right when reference and popper are in table', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/same.html`);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position popper on right when reference is in table inside offsetParents', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/offset-parent.html`);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position popper on right when reference and popper are in table inside offsetParents', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/same-offset-parent.html`);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
