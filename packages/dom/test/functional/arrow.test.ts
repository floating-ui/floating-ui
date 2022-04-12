import {test, expect} from '@playwright/test';
import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';

allPlacements.forEach((placement) => {
  test(`arrow should be centered to the reference ${placement}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/arrow');
    await page.waitForSelector(`[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="placement-${placement}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`
    );
  });
});

allPlacements.forEach((placement) => {
  test(`arrow should not overflow floating element ${placement}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/arrow');
    await click(page, `[data-testid="placement-${placement}"]`);

    await page.evaluate(() => {
      const target = document.querySelector(
        `input[type="range"]`
      ) as HTMLInputElement;

      if (target) {
        target.value = '50';
      }

      (window as any).__HANDLE_SIZE_CHANGE__({target});
    });

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}-no-overflow.png`
    );
  });
});
