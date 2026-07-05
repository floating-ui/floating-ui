import {expect, test} from '@playwright/test';

import {click} from './utils/click';

[
  // Fixed element with no containing block ancestor escapes an overflow
  // ancestor's clipping (#2291).
  {scenario: 'no-cb', expected: 'viewport'},
  // A static containing block's clip chain passes through the overflow
  // ancestor above it.
  {scenario: 'static-cb-overflow', expected: 'clipper'},
  // An absolute containing block escapes static overflow ancestors between
  // it and its positioned ancestor.
  {scenario: 'absolute-cb', expected: 'viewport'},
  // A fixed containing block (e.g. a transformed drawer or modal) escapes
  // the overflow ancestor above it, and so does the fixed element (#2934).
  {scenario: 'fixed-cb', expected: 'viewport'},
  // A fixed overflow ancestor above a static containing block clips.
  {scenario: 'static-cb-fixed-overflow', expected: 'clipper'},
  // A fixed overflow ancestor that is not the containing block of the fixed
  // element does not clip it (#2291).
  {scenario: 'fixed-overflow-no-cb', expected: 'viewport'},
  // An absolute element inside a fixed ancestor escapes with it only up to
  // the fixed ancestor's containing block; the overflow ancestor above that
  // containing block clips.
  {scenario: 'absolute-in-fixed-static-cb', expected: 'clipper'},
].forEach(({scenario, expected}) => {
  test(`${scenario} clipping rect is the ${expected}`, async ({page}) => {
    await page.goto('http://localhost:1234/fixed-clipping');
    await click(page, `[data-testid="scenario-${scenario}"]`);

    const {clipping, viewport} = JSON.parse(
      (await page
        .locator(`[data-testid="rects"][data-scenario="${scenario}"]`)
        .textContent()) ?? '{}',
    );

    // The computed clipping rect is drawn as a dashed outline; the fixed
    // element must never render outside it.
    expect(await page.screenshot()).toMatchSnapshot(`${scenario}.png`);

    if (expected === 'viewport') {
      expect(clipping).toEqual(viewport);
    } else {
      const clipper = await page.evaluate(() => {
        const rect = document
          .querySelector('[data-testid="clipper"]')
          ?.getBoundingClientRect();
        return (
          rect && {width: rect.width, height: rect.height, x: rect.x, y: rect.y}
        );
      });
      expect(clipping).toEqual(clipper);
      expect(clipping).not.toEqual(viewport);
    }
  });
});
