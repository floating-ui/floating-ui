import {test, expect} from '@playwright/test';

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
    await page.click(`[data-testid="scroll-${node}"]`);

    if (node === 'body') {
      await page.evaluate(() => window.scrollTo(0, 200));
    }

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`
    );

    await page.click(`[data-testid="strategy-fixed"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}--fixed.png`
    );
  });
});
