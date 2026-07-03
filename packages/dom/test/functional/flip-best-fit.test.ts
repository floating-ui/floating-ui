import {expect, test} from '@playwright/test';

import {click} from './utils/click';
import {scroll} from './utils/scroll';

// https://github.com/floating-ui/floating-ui/issues/3014
// No placement fits, and the side toward the scroll origin overflows the
// least. The `bestFit` fallback should nevertheless prefer the opposite side,
// whose overflow can be scrolled into view.

test('prefers scrollable overflow (bottom) when no placement fits on the y-axis', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip-best-fit');
  await click(page, `[data-testid="scenario-y"]`);

  await scroll(page, {y: 60}, '.scroller');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bestfit-scrollable-y.png`,
  );

  // The overflowing portion remains reachable by scrolling.
  await scroll(page, {y: 1000}, '.scroller');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bestfit-scrollable-y-scrolled.png`,
  );
});

test('prefers scrollable overflow (right) when no placement fits on the x-axis', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip-best-fit');
  await click(page, `[data-testid="scenario-x"]`);

  await scroll(page, {x: 60}, '.scroller');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bestfit-scrollable-x.png`,
  );
});

test('prefers scrollable overflow (left) when no placement fits on the x-axis in RTL', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip-best-fit');
  await click(page, `[data-testid="scenario-x-rtl"]`);

  await scroll(page, {x: -60}, '.scroller');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bestfit-scrollable-x-rtl.png`,
  );
});

test('does not bias toward the scrollable side when `size()` constrains the floating element', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/flip-best-fit');
  await click(page, `[data-testid="scenario-size"]`);

  await scroll(page, {y: 60}, '.scroller');

  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    `bestfit-size-neutral.png`,
  );
});
