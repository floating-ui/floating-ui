import {expect, test} from '@playwright/test';

import {click} from './utils/click';

['ancestorScroll', 'elementResize', 'ancestorResize', 'layoutShift'].forEach(
  (option) => {
    [true, false].forEach((bool) => {
      test(`${option}: ${bool}`, async ({page}) => {
        await page.goto('http://localhost:1234/autoUpdate');
        await click(page, `[data-testid="${option}-${bool}"]`);

        if (option === 'ancestorScroll') {
          await page.evaluate(() => window.scrollTo(0, 50));
        }

        expect(await page.locator('.container').screenshot()).toMatchSnapshot(
          `${option}-${bool}.png`
        );
      });
    });
  }
);
