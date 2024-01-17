import {expect, test} from '@playwright/test';

import {click} from './utils/click';

['ancestorScroll', 'elementResize', 'ancestorResize'].forEach((option) => {
  [true, false].forEach((bool) => {
    test(`${option}: ${bool}`, async ({page}) => {
      await page.goto('http://localhost:1234/autoUpdate');
      await click(page, `[data-testid="${option}-${bool}"]`);

      if (option === 'ancestorScroll') {
        await page.evaluate(() => window.scrollTo(0, 50));
      }

      if (option === 'ancestorResize') {
        await page.setViewportSize({width: 700, height: 720});
      }

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${option}-${bool}.png`,
      );
    });
  });
});

['none', 'move', 'insert', 'delete'].forEach((option) => {
  test(`layoutShift: ${option}`, async ({page}) => {
    await page.goto('http://localhost:1234/autoUpdate');
    await click(page, `[data-testid="layoutShift-init"]`);
    await click(page, `[data-testid="layoutShift-${option}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `layoutShift-${option}.png`,
    );
  });
});

test(`reactive whileElementsMounted`, async ({page}) => {
  await page.goto('http://localhost:1234/autoUpdate');

  // option is `false` on mount by default, so test that changing it to `true`
  // works
  await click(page, `[data-testid="whileElementsMounted-true"]`);
  await page.evaluate(() => window.scrollTo(0, 25));

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `whileElementsMounted-true.png`,
  );

  // test that changing it back to `undefined` works
  await click(page, `[data-testid="whileElementsMounted-false"]`);
  await page.evaluate(() => window.scrollTo(0, 50));

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `whileElementsMounted-false.png`,
  );
});
