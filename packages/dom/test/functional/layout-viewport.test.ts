import {expect, test} from '@playwright/test';

import {click} from './utils/click';

['viewport', 'layoutViewport', 'rect'].forEach((boundary) => {
  test(`respects scrollbar-gutter space with ${boundary} rootBoundary`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/layout-viewport');

    await click(page, `[data-testid="rootboundary-${boundary}"]`);

    expect(await page.screenshot()).toMatchSnapshot(`${boundary}.png`);
  });
});
