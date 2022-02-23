import {test, expect} from '@playwright/test';
import {click} from './utils/click';

['ancestorScroll', 'ancestorResize', 'elementResize'].forEach((option) => {
  [true, false].forEach((bool) => {
    test(`${option}: ${bool}`, async ({page}) => {
      await page.goto('http://localhost:1234/autoUpdate');
      await click(page, `[data-testid="${option}-${bool}"]`);

      await page.evaluate(() => window.scrollTo(0, 200));

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${option}-${bool}.png`
      );
    });
  });
});

test('animationFrame: false', async ({page}) => {
  await page.goto('http://localhost:1234/autoUpdate');
  await click(page, `[data-testid="animationFrame-false"]`);

  // Wait 500ms for the animation to complete
  await new Promise((resolve) => setTimeout(resolve, 1000));

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `animationFrame-false.png`
  );
});

test('animationFrame: true', async ({page}) => {
  await page.goto('http://localhost:1234/autoUpdate');
  await click(page, `[data-testid="animationFrame-true"]`);

  // Wait 500ms for the animation to complete
  await new Promise((resolve) => setTimeout(resolve, 1000));

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `animationFrame-true.png`
  );
});
