import {test, expect} from '@playwright/test';
import {allPlacements} from '../visual/utils/allPlacements';

allPlacements.forEach((placement) => {
  test(`correctly sized for placement ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/size');
    await page.click(`[data-testid="placement-${placement}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`
    );
  });
});
