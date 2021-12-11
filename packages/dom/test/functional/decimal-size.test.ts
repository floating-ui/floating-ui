import {test, expect} from '@playwright/test';

test('decimal size reference', async ({page}) => {
  await page.goto('http://localhost:1234/spec/decimal-size');
  expect(await page.screenshot()).toMatchSnapshot('decimal-size.png');
});
