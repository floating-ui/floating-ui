import {test, expect} from '@playwright/test';

['table', 'td', 'th'].forEach((node) => {
  test(`correctly positioned on bottom for ${node}`, async ({page}) => {
    await page.goto('http://localhost:1234/table');
    await page.click(`[data-testid="reference-${node}"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}.png`
    );

    await page.click(`[data-testid="inside-true"]`);
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${node}-inside.png`
    );
  });
});
