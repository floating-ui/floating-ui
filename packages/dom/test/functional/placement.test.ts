import {expect, test} from '@playwright/test';

import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';

allPlacements.forEach((placement) => {
  test(`correctly positioned on ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/placement');
    await click(page, `[data-testid="placement-${placement}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`,
    );

    await page.evaluate((placement) => {
      const target = document.querySelector(
        `[data-testid="placement-${placement}"]`,
      ) as HTMLInputElement;

      if (target) {
        target.value = '200';
      }

      (window as any).__handleSizeChange_floating({target});
    }, placement);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}--size.png`,
    );
  });
});

allPlacements.forEach((placement) => {
  test(`rtl should be respected ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/placement');
    await click(page, `[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="rtl-true"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}-rtl.png`,
    );
  });
});
