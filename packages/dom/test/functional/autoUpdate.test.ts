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
        `${option}-${bool}.png`
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
      `layoutShift-${option}.png`
    );
  });
});
