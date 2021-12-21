import {test, expect} from '@playwright/test';
import {allPlacements} from '../visual/utils/allPlacements';

allPlacements.forEach((placement) => {
  test(`correctly positioned on ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/placement');
    await page.click(`[data-testid="placement-${placement}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`
    );

    await page.evaluate((placement) => {
      const target = document.querySelector(
        `[data-testid="placement-${placement}"]`
      ) as HTMLInputElement;

      if (target) {
        target.value = '200';
      }

      (window as any).__HANDLE_SIZE_CHANGE__({target});
    }, placement);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}--size.png`
    );
  });
});
