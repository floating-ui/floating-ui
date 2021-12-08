import {test, expect} from '@playwright/test';

test('not overflowing clipping container on the bottom', async ({page}) => {
  await page.goto('http://localhost:1234/spec/scroll-border');
  expect(await page.screenshot()).toMatchSnapshot('scroll-border.png');
});

test('not overflowing clipping container on the right', async ({page}) => {
  await page.goto('http://localhost:1234/spec/scroll-border-right');
  expect(await page.screenshot()).toMatchSnapshot('scroll-border-right.png');
});

test('not overflowing clipping container on the left (RTL)', async ({page}) => {
  await page.goto('http://localhost:1234/spec/scroll-border-rtl');
  expect(await page.screenshot()).toMatchSnapshot('scroll-border-rtl.png');
});
