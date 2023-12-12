import {expect, test} from '@playwright/test';

import {click} from './utils/click';

['table', 'td', 'th'].forEach((node) => {
  test(`correctly positioned on bottom for ${node}`, async ({page}) => {
    await page.goto('http://localhost:1234/table');
    await click(page, `[data-testid="reference-${node}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`,
    );

    await click(page, `[data-testid="inside-true"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}-inside.png`,
    );
  });
});
