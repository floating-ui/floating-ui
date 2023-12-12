import {expect, test} from '@playwright/test';

import {click} from './utils/click';

[
  null,
  'reference',
  'floating',
  'body',
  'html',
  'offsetParent',
  'content-box',
].forEach((node) => {
  test(`correctly positioned on bottom when ${node} has a border`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/border');
    await click(page, `[data-testid="border-${node}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`,
    );
  });
});
