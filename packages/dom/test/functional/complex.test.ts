import {test, expect} from '@playwright/test';
import {click} from './utils/click';
import {positions} from '../visual/utils/positions';
import {boxSizes} from '../visual/utils/box-sizes';

positions.forEach((position) => {
  boxSizes.forEach((boxSize) => {
    test(`arrow keep padding at the container edges with ${boxSize} reference on ${position}`,
      async ({page}) => {
        await page.goto('http://localhost:1234/complex');
        await click(page, `[data-testid="position-${position}"]`);
        await click(page, `[data-testid="reference-size-${boxSize}"]`);

        expect(await page.locator('.container').screenshot()).toMatchSnapshot(
          `${boxSize}-${position}-padding.png`
        );
      });
  });
});
