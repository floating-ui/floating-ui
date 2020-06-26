/**
 * @jest-environment puppeteer
 * @flow
 */
import { screenshot, scroll } from '../utils/puppeteer.js';

const hack = async (page) => {
  // HACK: fixes issue with tables on GitHub Actions
  if (Boolean(process.env.CI)) {
    await page.addStyleTag({ content: 'table { margin-left: 4px; }' });
  }
};

it('should position popper on right when reference is in table', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/basic.html`);
  await hack(page);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position popper on right when reference and popper are in table', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/same.html`);
  await hack(page);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position popper on right when reference is in table inside offsetParents', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/offset-parent.html`);
  await hack(page);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position popper on right when reference and popper are in table inside offsetParents', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/same-offset-parent.html`);
  await hack(page);

  await scroll(page, 'html', 100);

  expect(await screenshot(page)).toMatchImageSnapshot();
});

it('should position popper on right #1124', async () => {
  const page = await browser.newPage();
  await page.goto(`${TEST_URL}/table/offset-parent-2.html`);

  expect(await screenshot(page)).toMatchImageSnapshot();
});
