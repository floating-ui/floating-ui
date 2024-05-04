import {expect, test} from '@playwright/test';

import {allPlacements} from '../visual/utils/allPlacements';
import {click} from './utils/click';
import {scroll} from './utils/scroll';

allPlacements.forEach((placement) => {
  [75, 150].forEach((floatingSize) => {
    [25, 125].forEach((referenceSize) => {
      [0, 20].forEach((arrowPadding) => {
        test(`arrow should be centered to the reference ${placement} ${floatingSize} ${referenceSize} ${arrowPadding}`, async ({
          page,
        }) => {
          await page.goto('http://localhost:1234/arrow');
          await click(page, `[data-testid="placement-${placement}"]`);
          await click(page, `[data-testid="floating-${floatingSize}"]`);
          await click(page, `[data-testid="reference-${referenceSize}"]`);
          await click(page, `[data-testid="arrow-padding-${arrowPadding}"]`);

          expect(await page.locator('.container').screenshot()).toMatchSnapshot(
            `centered-${placement}-${floatingSize}-${referenceSize}-${arrowPadding}.png`,
          );
        });
      });
    });
  });
});

['top', 'bottom'].forEach((placement) => {
  [75, 150].forEach((floatingSize) => {
    [25, 125].forEach((referenceSize) => {
      [0, 20].forEach((arrowPadding) => {
        test(`arrow should not be centered to the reference ${placement} ${floatingSize} ${referenceSize} ${arrowPadding}`, async ({
          page,
        }) => {
          await page.goto('http://localhost:1234/arrow');
          await click(page, `[data-testid="placement-${placement}"]`);
          await click(page, `[data-testid="floating-${floatingSize}"]`);
          await click(page, `[data-testid="reference-${referenceSize}"]`);
          await click(page, `[data-testid="arrow-padding-${arrowPadding}"]`);

          await scroll(page, {x: 765});

          expect(await page.locator('.container').screenshot()).toMatchSnapshot(
            `not-centered-left-${placement}-${floatingSize}-${referenceSize}-${arrowPadding}.png`,
          );

          await scroll(page, {x: 285});

          expect(await page.locator('.container').screenshot()).toMatchSnapshot(
            `not-centered-right-${placement}-${floatingSize}-${referenceSize}-${arrowPadding}.png`,
          );
        });
      });
    });
  });
});

['left', 'right'].forEach((placement) => {
  [75, 150].forEach((floatingSize) => {
    [25, 125].forEach((referenceSize) => {
      [0, 20].forEach((arrowPadding) => {
        test(`arrow should not be centered to the reference ${placement} ${floatingSize} ${referenceSize} ${arrowPadding}`, async ({
          page,
        }) => {
          await page.goto('http://localhost:1234/arrow');
          await click(page, `[data-testid="placement-${placement}"]`);
          await click(page, `[data-testid="floating-${floatingSize}"]`);
          await click(page, `[data-testid="reference-${referenceSize}"]`);
          await click(page, `[data-testid="arrow-padding-${arrowPadding}"]`);

          await scroll(page, {y: 880});

          expect(await page.locator('.container').screenshot()).toMatchSnapshot(
            `not-centered-top-${placement}-${floatingSize}-${referenceSize}-${arrowPadding}.png`,
          );

          await scroll(page, {y: 300});

          expect(await page.locator('.container').screenshot()).toMatchSnapshot(
            `not-centered-bottom-${placement}-${floatingSize}-${referenceSize}-${arrowPadding}.png`,
          );
        });
      });
    });
  });
});

test('svg arrow should be positioned correctly within containing block', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/arrow');
  await click(page, `[data-testid="svg-true"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `svg-arrow.png`,
  );
});

test('large padding value should not uncenter the arrow', async ({page}) => {
  await page.goto('http://localhost:1234/arrow');
  await click(page, `[data-testid="arrow-padding-200"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `arrow-padding-200-center.png`,
  );
});

test('internal shifting should return correct centerOffset value', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/arrow');
  await click(page, `[data-testid="centerOffset-true"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `center-offset-true.png`,
  );
});

test('internal shifting does not double up offset', async ({page}) => {
  await page.goto('http://localhost:1234/arrow');
  await click(page, `[data-testid="placement-bottom-start"]`);
  await click(page, `[data-testid="reference-25"]`);
  await click(page, `[data-testid="floating-150"]`);
  await click(page, `[data-testid="arrow-padding-20"]`);
  await click(page, `[data-testid="add-offset-true"]`);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `arrow-offset-no-doubling.png`,
  );
});

[true, false].forEach((nested) => {
  [true, false].forEach((svg) => {
    test(`arrow should be positioned correctly within nested: ${nested} wrapper with border (${
      svg ? 'SVGElement' : 'HTMLElement'
    })`, async ({page}) => {
      await page.goto('http://localhost:1234/arrow');
      await click(page, `[data-testid="svg-${svg}"]`);
      await click(page, `[data-testid="nested-${nested}"]`);

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `nested-${nested}-${svg ? 'svg-element' : 'html-element'}.png`,
      );
    });
  });
});
