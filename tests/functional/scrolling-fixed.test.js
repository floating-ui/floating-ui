/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should update the position when window is resized', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling-fixed/scroll.html');

  await scroll(page, '#scroll', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle basic nested scrollable parents', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling-fixed/nested.html');

  await scroll(page, '.scroll2', 300);
  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle basic nested scrollable parents when pop/ref are on same div', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling-fixed/nested-same.html');

  await scroll(page, '.scroll2', 300);
  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle case where popper is one level deeper than reference', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling-fixed/nested-alt.html');

  await scroll(page, '.scroll2', 300);
  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle case where root scrolling parent is also offset parent', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling-fixed/offset-parent.html');

  await scroll(page, '.scroll3', 200);
  await scroll(page, '.scroll2', 200);
  await scroll(page, '.scroll1', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
