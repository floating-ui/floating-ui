import {test, expect} from '@playwright/test';

[null, 'reference', 'floating', 'body', 'html', 'offsetParent'].forEach(
  (node) => {
    test(`correctly positioned on bottom when ${node} has a border`, async ({
      page,
    }) => {
      await page.goto('http://localhost:1234/border');
      await page.click(`[data-testid="border-${node}"]`);
      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${node}.png`
      );
    });
  }
);
