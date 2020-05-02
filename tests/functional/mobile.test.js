/**
 * @jest-environment puppeteer
 * @flow
 */
import { scroll, screenshot } from '../utils/puppeteer.js';
import devices from 'puppeteer/DeviceDescriptors';

const iPhonex = devices['iPhone X'];

it('preventOverflow works on mobile devices with horizontal scrollbars', async () => {
  const page = await browser.newPage();
  await page.emulate(iPhonex);
  await page.goto(`${TEST_URL}/mobile/viewport.html`);

  await page.evaluate(() => {
    window.scrollBy(400, 0);
  });

  expect(await screenshot(page)).toMatchImageSnapshot();
});
