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
    overflow?: 'shift' | 'both';
  },
) {
  await page.goto('http://localhost:1234/zoom');
  await click(page, `[data-testid="zoom-strategy-${strategy}"]`);
  if (zoom != null) {
    await click(page, `[data-testid="zoom-${zoom}"]`);
  }
  if (overflow) {
    await click(page, `[data-testid="zoom-overflow-${overflow}"]`);
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

// These capture the viewport rather than the container, because an element
// screenshot scrolls it into view and would undo the scroll.
[1.5, 2].forEach((zoom) => {
  test(`shift() and size() with zoom ${zoom} on body using the fixed strategy on a scrolled document`, async ({
    page,
  }) => {
    await setup(page, {
      node: 'body',
      zoom,
      strategy: 'fixed',
      scroll: 250,
      overflow: 'both',
    });
    expect(await page.screenshot()).toMatchSnapshot(
      `scrolled-${zoom}-fixed.png`,
    );
  });
});

// The forward conversion divides the combined rect-plus-scroll value by the
// zoom. Its inverse must scale the rect without scaling the Window scroll,
// whose values remain in viewport units. A screenshot alone can bless a
// clipped element, so assert the rendered boundary directly.
test('size() with zoom 2 on body using the absolute strategy on a scrolled document', async ({
  page,
}) => {
  await setup(page, {
    node: 'body',
    zoom: 2,
    strategy: 'absolute',
    scroll: 250,
    overflow: 'both',
  });

  const floatingRect = await page.locator('.floating').boundingBox();
  const viewport = page.viewportSize();

  expect(floatingRect).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(floatingRect!.y + floatingRect!.height).toBeLessThanOrEqual(
    viewport!.height - 2,
  );
});

// This covers absolute anchoring. The size() assertion above covers the
// asymmetric Window scroll conversion.
test('shift() with zoom 2 on body using the absolute strategy on a scrolled document', async ({
  page,
}) => {
  await setup(page, {
    node: 'body',
    zoom: 2,
    strategy: 'absolute',
    scroll: 250,
    overflow: 'shift',
  });
  expect(await page.screenshot()).toMatchSnapshot('scrolled-2-absolute.png');
});
