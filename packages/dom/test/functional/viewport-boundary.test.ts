import {expect, test} from '@playwright/test';

import {click} from './utils/click';

const floatingRightX = (page: any) =>
  page
    .locator('[data-testid="floating-right"]')
    .evaluate((el: Element) => el.getBoundingClientRect().x);

// The differentiating behavior of `layoutViewport`: pinch-zooming shrinks the
// visual viewport (emulated via CDP `Emulation.setPageScaleFactor`) but
// leaves the layout viewport unchanged, so a `viewport`-bound floating
// element shifts inward while a `layoutViewport`-bound one stays put.
test('layoutViewport ignores pinch zoom while viewport tracks it', async ({
  page,
}) => {
  await page.goto('http://localhost:1234/viewport-boundary');

  // Gutter off to isolate the zoom effect.
  await click(page, '[data-testid="gutter"]');

  await expect.poll(() => floatingRightX(page)).toBeGreaterThan(500);
  const baseline = await floatingRightX(page);

  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setPageScaleFactor', {pageScaleFactor: 2});

  // Force a recompute with the (default) `viewport` boundary by changing the
  // strategy: the boundary now spans only the halved visual viewport, so the
  // floating element must shift far left.
  await click(page, '[data-testid="strategy-fixed"]');
  await expect.poll(() => floatingRightX(page)).toBeLessThan(baseline - 100);

  // Recompute with `layoutViewport`: back to the pre-zoom position, since
  // the layout viewport is unaffected by pinch zoom.
  await click(page, '[data-testid="boundary-layoutViewport"]');
  await expect
    .poll(async () => Math.abs((await floatingRightX(page)) - baseline))
    .toBeLessThan(1);
});

// RTL smoke test: both floating elements must stay inside the viewport with
// the document in RTL mode. Note that Chromium keeps the root scrollbar on
// the right even in RTL, so this does NOT exercise the left-side scrollbar
// path (Firefox-only; covered by the getViewportRect unit tests and the
// manual /viewport-boundary route).
['viewport', 'layoutViewport'].forEach((boundary) => {
  test(`stays inside the viewport in RTL with ${boundary} rootBoundary`, async ({
    page,
  }) => {
    await page.goto('http://localhost:1234/viewport-boundary');

    await click(page, '[data-testid="rtl"]');
    await click(page, `[data-testid="boundary-${boundary}"]`);

    expect(await page.screenshot()).toMatchSnapshot(`rtl-${boundary}.png`);
  });
});
