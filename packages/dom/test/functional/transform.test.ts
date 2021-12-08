import {test, expect} from '@playwright/test';

test('positioned on the right', async ({page}) => {
  await page.goto('http://localhost:1234/spec/transform/reference-scaled');
  expect(await page.screenshot()).toMatchSnapshot(
    'transform-reference-scaled.png'
  );
});
