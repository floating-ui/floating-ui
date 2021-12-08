import {test, expect} from '@playwright/test';

test('positioned on the right when html is relative', async ({page}) => {
  await page.goto('http://localhost:1234/spec/relative-html');
  expect(await page.screenshot()).toMatchSnapshot('relative-html.png');
});

test('positioned on the right when body is relative', async ({page}) => {
  await page.goto('http://localhost:1234/spec/relative-body');
  expect(await page.screenshot()).toMatchSnapshot('relative-body.png');
});
