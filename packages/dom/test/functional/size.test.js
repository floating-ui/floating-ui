import {test, expect} from '@playwright/test';

test('same width as reference', async ({page}) => {
  await page.goto('http://localhost:1234/spec/middleware/size/same-width');
  expect(await page.screenshot()).toMatchSnapshot('same-width.png');
});
