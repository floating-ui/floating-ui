import {expect, test} from '@playwright/test';
import type {Placement} from '@floating-ui/core';

import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';
import {stringifyPlacement} from '../visual/utils/stringifyPlacement';

const logicalPlacements: Placement[] = [
  {side: 'inline-start', align: 'start'},
  {side: 'inline-start', align: 'center'},
  {side: 'inline-start', align: 'end'},
  {side: 'inline-end', align: 'start'},
  {side: 'inline-end', align: 'center'},
  {side: 'inline-end', align: 'end'},
];

const placementsToTest = [...allPlacements, ...logicalPlacements].map(
  stringifyPlacement,
);

placementsToTest.forEach((placement) => {
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

placementsToTest.forEach((placement) => {
  test(`rtl should be respected ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/placement');
    await click(page, `[data-testid="placement-${placement}"]`);
    await click(page, `[data-testid="rtl-true"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}-rtl.png`,
    );
  });
});
