import {computePosition} from '../../src';

// Transforms need real layout, so this only runs in the browser test
// environment (`pnpm test:browser`). Under jsdom it is skipped.
const inBrowser = typeof IntersectionObserver === 'function';

test.runIf(inBrowser)(
  'does not scale by a `contextElement` named property when the offsetParent is the Window',
  async () => {
    // An element `id` is exposed as a named property on the Window.
    const named = document.createElement('div');
    named.id = 'contextElement';
    named.style.cssText =
      'width: 100px; height: 100px; transform: scale(2); transform-origin: 0 0;';
    const reference = document.createElement('div');
    reference.style.cssText =
      'position: absolute; left: 100px; top: 100px; width: 100px; height: 40px;';
    const floating = document.createElement('div');
    floating.style.cssText = 'position: absolute; width: 150px; height: 75px;';
    document.body.append(named, reference, floating);

    try {
      expect(window).toHaveProperty('contextElement', named);

      const {x, y} = await computePosition(reference, floating, {
        placement: 'bottom',
      });

      expect({x, y}).toEqual({x: 75, y: 140});
    } finally {
      named.remove();
      reference.remove();
      floating.remove();
    }
  },
);
