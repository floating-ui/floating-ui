/**
 * @jest-environment jest-playwright-preset
 * @flow
 */
import { scroll, screenshot } from '../utils/playwright.js';

it('should be yellow color when the reference is hidden', async () => {
  await page.goto(`${TEST_URL}/modifiers/hide/index.html`);
  await scroll(page, '.scroll2', 250);
  await scroll(page, '.scroll3', 500);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be white color when the popper has escaped the reference container', async () => {
  await page.goto(`${TEST_URL}/modifiers/hide/index.html`);
  await scroll(page, '.scroll2', 250);
  await scroll(page, '.scroll3', 500);
  await scroll(page, '.scroll1', 10);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should be normal purple color when the reference is visible and popper is not escaped', async () => {
  await page.goto(`${TEST_URL}/modifiers/hide/index.html`);
  await scroll(page, '.scroll2', 250);
  await scroll(page, '.scroll3', 500);
  await scroll(page, '.scroll1', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
