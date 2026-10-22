import {afterEach, expect, test, vi} from 'vitest';

import {platform} from '../../src';

afterEach(() => {
  vi.restoreAllMocks();
});

const windowConfigurable =
  Object.getOwnPropertyDescriptor(globalThis, 'window')?.configurable === true;

test.runIf(windowConfigurable).each([
  {direction: 'ltr', scrollLeft: 40, x: -40},
  {direction: 'rtl', scrollLeft: -40, x: -160},
])(
  'returns the $direction document boundary without a body',
  ({direction, scrollLeft, x}) => {
    const doc = document.implementation.createHTMLDocument();
    doc.body.remove();
    const html = doc.documentElement;
    html.style.direction = direction;
    html.scrollLeft = scrollLeft;
    html.scrollTop = 75;

    vi.spyOn(html, 'clientWidth', 'get').mockReturnValue(800);
    vi.spyOn(html, 'clientHeight', 'get').mockReturnValue(600);
    vi.spyOn(html, 'scrollWidth', 'get').mockReturnValue(1000);
    vi.spyOn(html, 'scrollHeight', 'get').mockReturnValue(900);
    vi.spyOn(html, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(-scrollLeft, -75, 800, 600),
    );

    expect(
      platform.getClippingRect({
        element: html,
        boundary: [],
        rootBoundary: 'document',
        strategy: 'absolute',
      }),
    ).toEqual({width: 1000, height: 900, x, y: -75});
  },
);
