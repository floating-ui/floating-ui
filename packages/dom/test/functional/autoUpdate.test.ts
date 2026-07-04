import {expect, test} from '@playwright/test';

import {click} from './utils/click';

async function getHorizontalOffset(page: any) {
  return await page.evaluate(() => {
    const reference = document.querySelector(
      '[data-testid="rootResize-reference"]',
    );
    const floating = document.querySelector(
      '[data-testid="rootResize-floating"]',
    );

    if (!reference || !floating) {
      return Number.POSITIVE_INFINITY;
    }

    return Math.abs(
      reference.getBoundingClientRect().left -
        floating.getBoundingClientRect().left,
    );
  });
}

async function expectFloatingTracksReference(page: any) {
  await expect.poll(() => getHorizontalOffset(page)).toBeLessThanOrEqual(1);
}

['ancestorScroll', 'elementResize', 'ancestorResize'].forEach((option) => {
  [true, false].forEach((bool) => {
    test(`${option}: ${bool}`, async ({page}) => {
      await page.goto('http://localhost:1234/autoUpdate');
      await click(page, `[data-testid="${option}-${bool}"]`);

      if (option === 'ancestorScroll') {
        await page.evaluate(() => window.scrollTo(0, 50));
      }

      if (option === 'ancestorResize') {
        await page.setViewportSize({width: 700, height: 720});
      }

      expect(await page.locator('.container').screenshot()).toMatchSnapshot(
        `${option}-${bool}.png`,
      );
    });
  });
});

['none', 'move', 'insert', 'delete'].forEach((option) => {
  test(`layoutShift: ${option}`, async ({page}) => {
    await page.goto('http://localhost:1234/autoUpdate');
    await click(page, `[data-testid="layoutShift-init"]`);
    await click(page, `[data-testid="layoutShift-${option}"]`);

    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `layoutShift-${option}.png`,
    );
  });
});

test(`layoutShift: does not wait for the 1s throttle when the reference moves during a refresh`, async ({
  page,
}) => {
  await page.goto('http://localhost:1234/autoUpdate');
  await click(page, `[data-testid="layoutShift-init"]`);
  await click(page, `[data-testid="layoutShift-moveTwice"]`);

  // Well under the 1s ratio-0 refresh throttle: the floating element must
  // already be anchored to the reference's final position.
  await page.waitForTimeout(600);

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `layoutShift-moveTwice.png`,
  );
});

test(`layoutShift updates after viewport resize with ancestorResize disabled`, async ({
  page,
}) => {
  await page.setViewportSize({width: 620, height: 720});
  await page.goto('http://localhost:1234/autoUpdate-root-resize');

  await expectFloatingTracksReference(page);

  await page.setViewportSize({width: 1000, height: 720});
  await expectFloatingTracksReference(page);

  await click(page, `[data-testid="rootResize-reference"]`);
  await expectFloatingTracksReference(page);
});

test(`reactive whileElementsMounted`, async ({page}) => {
  await page.goto('http://localhost:1234/autoUpdate');

  // option is `false` on mount by default, so test that changing it to `true`
  // works
  await click(page, `[data-testid="whileElementsMounted-true"]`);
  await page.evaluate(() => window.scrollTo(0, 25));

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `whileElementsMounted-true.png`,
  );

  // test that changing it back to `undefined` works
  await click(page, `[data-testid="whileElementsMounted-false"]`);
  await page.evaluate(() => window.scrollTo(0, 50));

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `whileElementsMounted-false.png`,
  );
});
