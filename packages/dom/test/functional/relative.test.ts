import {test, expect} from '@playwright/test';

[null, 'html', 'body', 'offsetParent'].forEach((node) => {
  test(`correctly positioned on bottom when ${node} is an offsetParent`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/relative');
    await page.click(`[data-testid="relative-${node}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`
    );
  });
});
