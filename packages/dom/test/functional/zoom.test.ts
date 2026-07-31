import {expect, test} from '@playwright/test';

import {click} from './utils/click';

// The `zoom` node is `null` by default, so the `None` case covers the
// unzoomed control.
['html', 'body', 'container'].forEach((node) => {
  [0.8, 1.5, 2].forEach((zoom) => {
    ['absolute', 'fixed'].forEach((strategy) => {
      test(`correctly positioned with zoom ${zoom} on ${node} using the ${strategy} strategy`, async ({
        page,
      }) => {
        await page.goto('http://localhost:1234/zoom');
        await click(page, `[data-testid="zoom-strategy-${strategy}"]`);
        await click(page, `[data-testid="zoom-${zoom}"]`);
        await click(page, `[data-testid="zoom-node-${node}"]`);
        expect(await page.locator('.container').screenshot()).toMatchSnapshot(
          `${node}-${zoom}-${strategy}.png`,
        );
      });
    });
  });
});
