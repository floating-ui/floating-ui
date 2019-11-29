/**
 * @jest-environment jest-environment-puppeteer
 * @flow
 */
import screenshot from '../utils/cleanScreenshot.js';

it('should update the position when window is resized', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling/scroll.html');

  await page.$eval('#scroll', evt => (evt.scrollTop += 300));

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle basic nested scrollable parents', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling/nested.html');

  await page.$eval('.scroll2', evt => (evt.scrollTop += 300));

  await page.$eval('.scroll1', evt => (evt.scrollTop += 300));

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle basic nested scrollable parents when pop/ref are on same div', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling/nested-same.html');

  await page.$eval('.scroll2', evt => (evt.scrollTop += 300));

  await page.$eval('.scroll1', evt => (evt.scrollTop += 300));

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle case where popper is one level deeper than reference', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling/nested-alt.html');

  await page.$eval('.scroll2', evt => (evt.scrollTop += 300));

  await page.$eval('.scroll1', evt => (evt.scrollTop += 300));

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle case where root scrolling parent is also offset parent', async () => {
  const page = await browser.newPage();
  await page.goto('http://localhost:5000/scrolling/offset-parent.html');

  await page.$eval('.scroll3', evt => (evt.scrollTop += 200));
  await page.$eval('.scroll2', evt => (evt.scrollTop += 200));
  await page.$eval('.scroll1', evt => (evt.scrollTop += 200));

  expect(await screenshot(page)).toMatchImageSnapshot();
});
