import {expect, test} from '@playwright/test';

import {scroll} from './utils/scroll';

test('should be anchored on bottom', async ({page}) => {
  await page.goto('http://localhost:1234/virtual-element');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bottom.png`,
  );
});

test('autoUpdate should respect the `contextElement`', async ({page}) => {
  await page.goto('http://localhost:1234/virtual-element');

  await scroll(page, {x: 800});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `scroll.png`,
  );

  await page.waitForSelector('.reference');

  await page.evaluate(() => {
    const reference = document.querySelector(
      '.reference',
    ) as HTMLElement | null;
    if (reference) {
      Object.assign(reference.style, {
        width: '1px',
        height: '1px',
      });
    }
  });

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `reference-resize.png`,
  );
});
