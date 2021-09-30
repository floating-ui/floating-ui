/**
 * @jest-environment puppeteer
 * @flow
 */
 import { screenshot } from '../utils/puppeteer.js';

 it('should be positioned on the bottom', async () => {
   const page = await browser.newPage();
   await page.goto(`${TEST_URL}/decimal-size.html`);
 
   expect(await screenshot(page)).toMatchImageSnapshot();
 });
 