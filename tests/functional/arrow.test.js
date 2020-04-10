/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { scroll, screenshot } from '../utils/playwright.js';

it('shuld center the arrow', async () => {
  await page.goto(`${TEST_URL}/modifiers/arrow/main.html`);

  await scroll(page, '.scroll3', 300);
  await scroll(page, '.scroll2', 200);
  await scroll(page, '.scroll1', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should keep arrow within popper edges', async () => {
  await page.goto(`${TEST_URL}/modifiers/arrow/main.html`);

  await scroll(page, '.scroll2', 400);
  await scroll(page, '.scroll3', 200);
  await scroll(page, '.scroll1', 450);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('tether should activate at correct time', async () => {
  await page.goto(`${TEST_URL}/modifiers/arrow/main.html`);

  await scroll(page, '.scroll2', 400);
  await scroll(page, '.scroll3', 200);
  await scroll(page, '.scroll1', 490);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should hide arrow if it is at the edge (min)', async () => {
  await page.goto(`${TEST_URL}/modifiers/arrow/hide.html`);

  await scroll(page, '.scroll', 390);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should hide arrow if it is at the edge (max)', async () => {
  await page.setViewportSize({ width: 800, height: 400 });
  await page.goto(`${TEST_URL}/modifiers/arrow/hide.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
