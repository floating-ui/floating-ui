/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('should update the position when window is resized', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/scrolling-absolute/scroll.html`);
  await scroll(page, '#scroll', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle basic nested scrollable parents', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/scrolling-absolute/nested.html`);
  await scroll(page, '.scroll2', 300);
  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle basic nested scrollable parents when pop/ref are on same div', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/scrolling-absolute/nested-same.html`);

  await scroll(page, '.scroll2', 300);
  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle case where popper is one level deeper than reference', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/scrolling-absolute/nested-alt.html`);

  await scroll(page, '.scroll2', 300);
  await scroll(page, '.scroll1', 300);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle basic offset parent', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/scrolling-absolute/offset-basic.html`);

  await scroll(page, 'html', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle case where root scrolling parent is also offset parent', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/scrolling-absolute/offset-parent.html`);

  await scroll(page, '.scroll3', 200);
  await scroll(page, '.scroll2', 200);
  await scroll(page, '.scroll1', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle multiple nested offsetParents', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/scrolling-absolute/offset-parent-multiple.html`);

  await scroll(page, '.scroll3', 200);
  await scroll(page, '.scroll2', 200);
  await scroll(page, '.scroll1', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle same offset parent', async () => {
  const page = await browser.newPage();
  await page.goto(
    `${TEST_URL}/scrolling-absolute/scroll-same-offset-parent.html`
  );

  await scroll(page, '#scroll', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should handle alt offset parent', async () => {
  const page = await browser.newPage();
  await page.goto(
    `${TEST_URL}/scrolling-absolute/scroll-alt-offset-parent.html`
  );

  await scroll(page, '#scroll', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('finds scrolling parent through assigned slots', async () => {
  const page = await browser.newPage();
  await page.goto(
    `${TEST_URL}/scrolling-absolute/parent-through-assigned-slot.html`
  );

  await scroll(page, '#scroll', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
