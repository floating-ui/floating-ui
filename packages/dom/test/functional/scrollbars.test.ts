import {expect, test} from '@playwright/test';

import {click} from './utils/click';

['bottom', 'right', 'left'].forEach((placement) => {
  test(`correctly avoids scrollbar at ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/scrollbars');

    await click(page, `[data-testid="placement-${placement}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`,
    );

    await click(page, '[data-testid="rtl-true"]');

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}--rtl.png`,
    );
  });
});
