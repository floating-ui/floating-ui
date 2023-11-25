import {expect, test} from '@playwright/test';

import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';

allPlacements.forEach((placement) => {
  [
    '0',
    '10',
    '-10',
    'cA: 10',
    'mA: 5, cA: -10',
    '() => -f.height',
    '() => cA: -f.width/2',
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
