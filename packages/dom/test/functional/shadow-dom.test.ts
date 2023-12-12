import {expect, test} from '@playwright/test';

import {allPlacements} from '../visual/utils/allPlacements';
import {useCases} from '../visual/utils/shadowDOM';
import {click} from './utils/click';

useCases.forEach((useCase) => {
  allPlacements.forEach((placement) => {
    ['static', 'relative', 'absolute'].forEach((cssPosition) => {
      ['absolute', 'fixed'].forEach((strategy) => {
        [true, false].forEach((withTransform) => {
          test(`shadow DOM (${useCase}): correctly positioned on ${strategy} + host-position-${cssPosition} + ${placement} + ${
            withTransform ? 'with' : 'without'
          }`, async ({page}) => {
            await page.goto('http://localhost:1234/shadow-DOM');
            await click(page, `[data-testid="use-case-${useCase}"]`);
            await click(page, `[data-testid="css-position-${cssPosition}"]`);
            await click(page, `[data-testid="placement-${placement}"]`);
            await click(page, `[data-testid="strategy-${strategy}"]`);
            await click(
              page,
              `[data-testid="with-transform-${withTransform}"]`,
            );
            expect(
              await page.locator('.container').screenshot(),
            ).toMatchSnapshot(
              `${useCase}-host-position-${cssPosition}-${placement}-${strategy}-${
                withTransform ? 'with' : 'without'
              }-transform.png`,
            );
          });
        });
      });
    });
  });
});

test('relative position host polyfill', async ({page}) => {
  await page.goto('http://localhost:1234/shadow-DOM');

  await click(
    page,
    '[data-testid="use-case-relative-host-with-shadowed-floating-child"]',
  );

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `without-polyfill.png`,
  );

  await click(page, '[data-testid="polyfill-true"]');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `with-polyfill.png`,
  );
});
