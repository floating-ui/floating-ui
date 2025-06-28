import {expect, test} from '@playwright/test';

import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';
import {stringifyPlacement} from '../visual/utils/stringifyPlacement';

allPlacements.map(stringifyPlacement).forEach((placement) => {
  [
    '0',
    '10',
    '-10',
    'aA: 10',
    'sA: 5, aA: -10',
    '() => -f.height',
    '() => aA: -f.width/2',
  ].forEach((name) => {
    [true, false].forEach((rtl) => {
      const rtlStr = rtl ? 'rtl' : 'ltr';
      test(`correctly offset ${name} for placement ${placement} (${rtlStr})`, async ({
        page,
      }) => {
        await page.goto('http://localhost:1234/offset');

        await click(page, `[data-testid="offset-${name}"]`);
        await click(page, `[data-testid="placement-${placement}"]`);
        await click(page, `[data-testid="rtl-${rtl}"]`);

        expect(await page.locator('.container').screenshot()).toMatchSnapshot(
          `${name}-${placement}-${rtlStr}.png`,
        );
      });
    });
  });
});
