import {test, expect} from '@playwright/test';

['bottom', 'right', 'left'].forEach((placement) => {
  test(`correctly avoids scrollbar at ${placement}`, async ({page}) => {
    await page.goto('http://localhost:1234/scrollbars');
    await page.evaluate(
      (placement) =>
        (
          document.querySelector(
            `[data-testid="placement-${placement}"]`
          ) as HTMLButtonElement
        )?.click(),
      placement
    );

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}.png`
    );

    await page.evaluate(() =>
      (
        document.querySelector('[data-testid="rtl-true"]') as HTMLButtonElement
      )?.click()
    );
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `${placement}--rtl.png`
    );
  });
});
