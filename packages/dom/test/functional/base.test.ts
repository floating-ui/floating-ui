import {test, expect} from '@playwright/test';

test('positioned on the right', async ({page}) => {
  await page.goto('http://localhost:1234/spec/base');
  expect(await page.screenshot()).toMatchSnapshot('base.png');
});
