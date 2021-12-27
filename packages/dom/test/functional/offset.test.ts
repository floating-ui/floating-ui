import {test, expect} from '@playwright/test';
import {click} from './utils/click';

['top', 'right', 'bottom', 'left'].forEach((placement) => {
  [
    '0',
    '10',
    '-10',
    'cA: 10',
    'mA: 5, cA: -10',
    '() => -f.height',
    '() => cA: -f.width/2',
  ].forEach((name) => {
    test(`correctly offset ${name} for placement ${placement}`, async ({
      page,
    }) => {
      await page.goto('http://localhost:1234/offset');
      await click(page, `[data-testid="offset-${name}"]`);
      await click(page, `[data-testid="placement-${placement}"]`);

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${name}-${placement}.png`
      );
    });
  });
});
