import type {Page} from '@playwright/test';
import {expect, test} from '@playwright/test';

import {click} from './utils/click';

async function setup(
  page: Page,
  {
    node,
    zoom,
    strategy,
    scroll,
    overflow,
  }: {
    node: string;
    zoom?: number;
    strategy: string;
    scroll?: number;
    overflow?: boolean;
  },
) {
  await page.goto('http://localhost:1234/zoom');
  await click(page, `[data-testid="zoom-strategy-${strategy}"]`);
  if (zoom != null) {
    await click(page, `[data-testid="zoom-${zoom}"]`);
  }
  if (overflow) {
    await click(page, '[data-testid="zoom-overflow-true"]');
  }
  await click(page, `[data-testid="zoom-node-${node}"]`);
  if (scroll) {
    await click(page, `[data-testid="zoom-scroll-${scroll}"]`);
  }
}

test('unzoomed control', async ({page}) => {
  await setup(page, {node: 'null', strategy: 'absolute'});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'control.png',
  );
});

// `zoom` on <body> makes the offsetParent resolve to the Window, which is the
// branch `getScale()` never ran in.
[0.8, 1.5, 2].forEach((zoom) => {
  test(`anchored with zoom ${zoom} on body`, async ({page}) => {
    await setup(page, {node: 'body', zoom, strategy: 'absolute'});
    expect(await page.locator('.container').screenshot()).toMatchSnapshot(
      `body-${zoom}.png`,
    );
  });
});

// `zoom` on <html> renders identically to <body>, but takes a different path
// through `getHTMLOffset()`, whose rect is read from the documentElement.
test('anchored with zoom 2 on html using the fixed strategy', async ({
  page,
}) => {
  await setup(page, {node: 'html', zoom: 2, strategy: 'fixed'});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'html-2-fixed.png',
  );
});

// A mid-tree static element. Only `fixed` is covered: with `absolute`, Chrome
// reports an `offsetParent` that isn't the containing block across a zoom
// boundary, a separate pre-existing bug this change doesn't fix.
test('anchored with zoom 2 on a mid-tree element using the fixed strategy', async ({
  page,
}) => {
  await setup(page, {node: 'container', zoom: 2, strategy: 'fixed'});
  expect(await page.locator('.container').screenshot()).toMatchSnapshot(
    'container-2-fixed.png',
  );
});

// Scrolled document with overflow middleware. The forward conversion divides
// the combined rect-plus-scroll value by the zoom, so the inverse used by
// `detectOverflow()` must scale the rect without scaling the scroll
// subtraction. These capture the viewport rather than the container, because
// an element screenshot scrolls it into view and would undo the scroll.
(
  [
    [1.5, 'absolute'],
    [2, 'absolute'],
    [2, 'fixed'],
  ] as const
).forEach(([zoom, strategy]) => {
  test(`shift() and size() with zoom ${zoom} on body using the ${strategy} strategy on a scrolled document`, async ({
    page,
  }) => {
    await setup(page, {
      node: 'body',
      zoom,
      strategy,
      scroll: 250,
      overflow: true,
    });
    expect(await page.screenshot()).toMatchSnapshot(
      `scrolled-${zoom}-${strategy}.png`,
    );
  });
});
