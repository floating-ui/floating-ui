import {test, expect} from '@playwright/test';
import {click} from './utils/click';

['ancestorScroll' /*'elementResize'*/].forEach((option) => {
  [true, false].forEach((bool) => {
    test(`${option}: ${bool}`, async ({page}) => {
      await page.goto('http://localhost:1234/autoUpdate');
      await click(page, `[data-testid="${option}-${bool}"]`);

      await page.evaluate(() => window.scrollTo(0, 50));

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${option}-${bool}.png`
      );
    });
  });
});

test('ancestorResize: false', async ({page}) => {
  await page.goto('http://localhost:1234/autoUpdate');
  await click(page, `[data-testid="ancestorResize-false"]`);

  await page.setViewportSize({width: 700, height: 720});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `ancestorResize-false.png`
  );
});

test('ancestorResize: true', async ({page}) => {
  await page.goto('http://localhost:1234/autoUpdate');
  await click(page, `[data-testid="ancestorResize-true"]`);

  await page.setViewportSize({width: 700, height: 720});

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `ancestorResize-true.png`
  );
});
