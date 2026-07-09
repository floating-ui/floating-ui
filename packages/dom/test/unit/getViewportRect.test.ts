import {afterEach, expect, test, vi} from 'vitest';

import type * as utilsDom from '@floating-ui/utils/dom';
import {getViewportRect} from '../../src/utils/getViewportRect';

// `isWebKit` selects which viewport client coordinates are relative to, so
// the branch matrix below needs to control it; everything else is real.
const mocks = vi.hoisted(() => ({isWebKit: false}));

vi.mock('@floating-ui/utils/dom', async (importOriginal) => {
  const actual = await importOriginal<typeof utilsDom>();
  return {...actual, isWebKit: () => mocks.isWebKit};
});

const html = document.documentElement;

interface Geometry {
  htmlClientWidth: number;
  htmlClientHeight: number;
  htmlBCRLeft: number;
  htmlScrollLeft: number;
  bodyClientWidth: number;
  visualViewportWidth: number;
  visualViewportHeight?: number;
  visualViewportOffsetLeft?: number;
  visualViewportOffsetTop?: number;
}

function mockViewport({
  htmlClientWidth,
  htmlClientHeight,
  htmlBCRLeft,
  htmlScrollLeft,
  bodyClientWidth,
  visualViewportWidth,
  visualViewportHeight = htmlClientHeight,
  visualViewportOffsetLeft = 0,
  visualViewportOffsetTop = 0,
}: Geometry) {
  vi.spyOn(html, 'clientWidth', 'get').mockReturnValue(htmlClientWidth);
  vi.spyOn(html, 'clientHeight', 'get').mockReturnValue(htmlClientHeight);
  vi.spyOn(html, 'scrollLeft', 'get').mockReturnValue(htmlScrollLeft);
  vi.spyOn(html, 'getBoundingClientRect').mockReturnValue({
    left: htmlBCRLeft,
    top: 0,
    right: htmlBCRLeft + htmlClientWidth,
    bottom: htmlClientHeight,
    width: htmlClientWidth,
    height: htmlClientHeight,
    x: htmlBCRLeft,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  vi.spyOn(document.body, 'clientWidth', 'get').mockReturnValue(
    bodyClientWidth,
  );
  // Neutralize the default UA body margin so the gutter math is deterministic.
  document.body.style.margin = '0px';
  vi.stubGlobal('visualViewport', {
    width: visualViewportWidth,
    height: visualViewportHeight,
    offsetLeft: visualViewportOffsetLeft,
    offsetTop: visualViewportOffsetTop,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.style.margin = '';
  mocks.isWebKit = false;
});

// scrollbar-gutter: stable reserves space on the inline-end (right) edge.
// `visualViewport.width` still includes that reserved gutter, so it must be
// subtracted from the boundary width.
test('subtracts a right-side reserved gutter from the width', () => {
  mockViewport({
    htmlClientWidth: 807,
    htmlClientHeight: 900,
    htmlBCRLeft: 0,
    htmlScrollLeft: 0,
    bodyClientWidth: 792, // 15px gutter reserved on the right
    visualViewportWidth: 807,
  });

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(792);
});

// A left-side scrollbar (e.g. Firefox `layout.scrollbar.side`) shifts the
// <html> right by its width. It is already excluded from `visualViewport.width`
// and compensated by `getHTMLOffset`, so the boundary width must NOT be
// inflated — doing so pushes the right edge (and the floating element) past
// the viewport.
test('does not inflate the width for a left-side scrollbar', () => {
  mockViewport({
    htmlClientWidth: 1665,
    htmlClientHeight: 900,
    htmlBCRLeft: 15, // 15px scrollbar on the left
    htmlScrollLeft: 0,
    bodyClientWidth: 1665,
    visualViewportWidth: 1664.5,
  });

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(1664.5);
});

// Full branch matrix for the (isWebKit × strategy) × rootBoundary paths while
// the visual viewport is panned/zoomed (offsets 30/20, smaller size).
//
// Client coordinates are relative to the layout viewport, except in WebKit
// with an `absolute` strategy, where they are relative to the visual
// viewport. So:
// - `viewport`: sized to the visual viewport; its origin is the visual
//   viewport's offset within the layout viewport, unless client coords are
//   already visual-relative (WebKit + absolute), where it is 0.
// - `layoutViewport`: sized to the layout viewport (html client size); its
//   origin is 0, unless client coords are visual-relative (WebKit +
//   absolute), where the layout viewport's origin is at minus the visual
//   viewport's offset.
test.each([
  {
    boundary: 'viewport',
    webkit: false,
    strategy: 'absolute',
    expected: {x: 30, y: 20, width: 780, height: 560},
  },
  {
    boundary: 'viewport',
    webkit: false,
    strategy: 'fixed',
    expected: {x: 30, y: 20, width: 780, height: 560},
  },
  {
    boundary: 'viewport',
    webkit: true,
    strategy: 'absolute',
    expected: {x: 0, y: 0, width: 780, height: 560},
  },
  {
    boundary: 'viewport',
    webkit: true,
    strategy: 'fixed',
    expected: {x: 30, y: 20, width: 780, height: 560},
  },
  {
    boundary: 'layoutViewport',
    webkit: false,
    strategy: 'absolute',
    expected: {x: 0, y: 0, width: 800, height: 600},
  },
  {
    boundary: 'layoutViewport',
    webkit: false,
    strategy: 'fixed',
    expected: {x: 0, y: 0, width: 800, height: 600},
  },
  {
    boundary: 'layoutViewport',
    webkit: true,
    strategy: 'absolute',
    expected: {x: -30, y: -20, width: 800, height: 600},
  },
  {
    boundary: 'layoutViewport',
    webkit: true,
    strategy: 'fixed',
    expected: {x: 0, y: 0, width: 800, height: 600},
  },
] as const)(
  '$boundary rect (webkit=$webkit, $strategy)',
  ({boundary, webkit, strategy, expected}) => {
    mockViewport({
      htmlClientWidth: 800,
      htmlClientHeight: 600,
      htmlBCRLeft: 0,
      htmlScrollLeft: 0,
      bodyClientWidth: 800,
      visualViewportWidth: 780,
      visualViewportHeight: 560,
      visualViewportOffsetLeft: 30,
      visualViewportOffsetTop: 20,
    });
    mocks.isWebKit = webkit;

    expect(getViewportRect(html, strategy, boundary)).toEqual(expected);
  },
);
