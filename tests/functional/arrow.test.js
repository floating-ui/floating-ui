/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';

it('shuld center the arrow', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/arrow/index.html`);

  await scroll(page, '.scroll3', 300);
  await scroll(page, '.scroll2', 200);
  await scroll(page, '.scroll1', 200);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should keep arrow within popper edges', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/modifiers/arrow/index.html`);

  await scroll(page, '.scroll2', 400);
  await scroll(page, '.scroll3', 200);
  await scroll(page, '.scroll1', 450);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
