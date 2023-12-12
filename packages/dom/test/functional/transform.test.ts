import {expect, test} from '@playwright/test';

import {click} from './utils/click';

[
  null,
  'reference',
  'floating',
  'body',
  'html',
  'offsetParent',
  'offsetParent-inverse',
  'offsetParent-3d',
  'offsetParent-reference',
  'virtual',
  'inline',
].forEach((node) => {
  test(`correctly positioned on bottom when ${node} has a border`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/transform');
    await click(page, `[data-testid="transform-${node}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`,
    );
  });
});
