import {expect, test} from '@playwright/test';

import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';
import {scroll} from './utils/scroll';

allPlacements.forEach((placement) => {
  test(`correctly sized for placement ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${placement}"]`);

    await scroll(page, {x: 525, y: 605});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`
    );
  });

  test(`placement ${placement} correctly sized with rtl enabled`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="rtl-true"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}-rtl.png`
    );
  });
});

['bottom', 'top'].forEach((verticalPlacement) => {
  test(`does not overflow due to size ${verticalPlacement}`, async ({page}) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${verticalPlacement}"]`);

    await scroll(page, {x: 650});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-left-start.png`
    );

    await scroll(page, {x: 575});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-left-end.png`
    );

    await scroll(page, {x: 400});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-right-start.png`
    );

    await scroll(page, {x: 500});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${verticalPlacement}-right-end.png`
    );
  });
});

['right', 'left'].forEach((horizontalPlacement) => {
  test(`does not overflow due to size ${horizontalPlacement}`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/size');
    await click(page, `[data-testid="placement-${horizontalPlacement}"]`);

    await scroll(page, {y: 725});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-top-start.png`
    );

    await scroll(page, {y: 650});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-top-end.png`
    );

    await scroll(page, {y: 475});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-bottom-start.png`
    );

    await scroll(page, {x: 575});

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${horizontalPlacement}-bottom-end.png`
    );
  });
});
