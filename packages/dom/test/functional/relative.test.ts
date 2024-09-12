import {expect, test} from '@playwright/test';

import {click} from './utils/click';

[null, 'html', 'body', 'offsetParent'].forEach((node) => {
  test(`correctly positioned on bottom when ${node} is an offsetParent`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/relative');
    await click(page, `[data-testid="relative-${node}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`,
    );
  });

  test(`correctly positioned on bottom when ${node} is an offsetParent with an offset of -100px`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/relative');
    await click(page, `[data-testid="relative-${node}"]`);
    await click(page, `[data-testid="offset-100"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}-offset-100.png`,
    );
  });
});
