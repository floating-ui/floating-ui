import {expect, test} from '@playwright/test';

import {click} from './utils/click';

[
  'referenceScrollParent',
  'floatingScrollParent',
  'sameScrollParent',
  'body',
].forEach((node) => {
  test(`correctly positioned on bottom when ${node} is scrolled`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/scroll');
    await click(page, `[data-testid="scroll-${node}"]`);

    if (node === 'body') {
      await page.evaluate(() => window.scrollTo(0, 200));
    }

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`,
    );

    await click(page, `[data-testid="strategy-fixed"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}--fixed.png`,
    );
  });
});
