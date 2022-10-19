import {test, expect} from '@playwright/test';
import {click} from './utils/click';

['transform', 'perspective', 'transform, perspective', 'opacity'].forEach(
  (willChange) => {
    test(`should be positioned on bottom ${willChange}`, async ({page}) => {
      await page.goto('http://localhost:1234/containing-block');
      await click(page, `[data-testid="willchange-${willChange}"]`);

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `will-change-${willChange}.png`
      );
    });
  }
);

['paint', 'layout', 'paint, layout', 'strict', 'content', 'size'].forEach(
  (contain) => {
    test(`should be positioned on bottom ${contain}`, async ({page}) => {
      await page.goto('http://localhost:1234/containing-block');
      await click(page, `[data-testid="contain-${contain}"]`);

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `contain-${contain}.png`
      );
    });
  }
);
