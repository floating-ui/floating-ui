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
  compatMode?: Document['compatMode'];
  htmlClientWidth: number;
  htmlClientHeight: number;
  htmlBCRLeft: number;
  htmlScrollLeft: number;
  // The <html> border box width. In standards mode, a reserved gutter shrinks
  // this while leaving `clientWidth` at the full viewport width. In quirks
  // mode, both shrink.
  htmlBCRWidth?: number;
  bodyClientWidth?: number;
  visualViewportWidth: number;
  visualViewportHeight?: number;
  visualViewportOffsetLeft?: number;
  visualViewportOffsetTop?: number;
}

function mockViewport({
  compatMode = 'CSS1Compat',
  htmlClientWidth,
  htmlClientHeight,
  htmlBCRLeft,
  htmlScrollLeft,
  htmlBCRWidth = htmlClientWidth,
  bodyClientWidth = htmlClientWidth,
  visualViewportWidth,
  visualViewportHeight = htmlClientHeight,
  visualViewportOffsetLeft = 0,
  visualViewportOffsetTop = 0,
}: Geometry) {
  vi.spyOn(document, 'compatMode', 'get').mockReturnValue(compatMode);
  vi.spyOn(html, 'clientWidth', 'get').mockReturnValue(htmlClientWidth);
  vi.spyOn(html, 'clientHeight', 'get').mockReturnValue(htmlClientHeight);
  vi.spyOn(html, 'scrollLeft', 'get').mockReturnValue(htmlScrollLeft);
  vi.spyOn(html, 'getBoundingClientRect').mockReturnValue({
    left: htmlBCRLeft,
    top: 0,
    right: htmlBCRLeft + htmlBCRWidth,
    bottom: htmlClientHeight,
    width: htmlBCRWidth,
    height: htmlClientHeight,
    x: htmlBCRLeft,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  vi.spyOn(document.body, 'clientWidth', 'get').mockReturnValue(
    bodyClientWidth,
  );
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
  delete (document.body as any).currentCSSZoom;
  html.style.scrollbarGutter = '';
  mocks.isWebKit = false;
});

// scrollbar-gutter: stable reserves space on the inline-end (right) edge.
// `html.clientWidth` and `visualViewport.width` both still include that
// reserved gutter, so it must be subtracted from the boundary width. The
// <html> border box is what shrinks (measured in Chrome: a 900px viewport with
// a 15px gutter reports clientWidth 900, border box width 885).
test('subtracts a right-side reserved gutter from the width', () => {
  mockViewport({
    htmlClientWidth: 900,
    htmlClientHeight: 600,
    htmlBCRLeft: 0,
    htmlBCRWidth: 885, // 15px gutter reserved on the right
    htmlScrollLeft: 0,
    visualViewportWidth: 900,
  });
  html.style.scrollbarGutter = 'stable';

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(885);
});

test('caps a zoomed reserved gutter in CSS pixels', () => {
  mockViewport({
    htmlClientWidth: 900,
    htmlClientHeight: 600,
    htmlBCRLeft: 0,
    htmlBCRWidth: 870, // 15 CSS px painted at `zoom: 2`
    htmlScrollLeft: 0,
    visualViewportWidth: 900,
  });
  // The body's currentCSSZoom is cumulative, including both <html> and <body>
  // zoom, and matches the scale Chrome applies to the root gutter.
  Object.defineProperty(document.body, 'currentCSSZoom', {
    configurable: true,
    value: 2,
  });
  html.style.scrollbarGutter = 'stable';

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(870);
});

// In quirks mode, the viewport `clientWidth` special case moves from <html> to
// <body>. A stable gutter therefore shrinks both the <html> client width and
// border box, while the body retains the full viewport width. The default
// viewport still needs the gutter subtracted, but the layout viewport already
// excludes it and must not be shrunk twice.
test.each([
  {boundary: 'viewport', rootBoundary: undefined},
  {boundary: 'layout viewport', rootBoundary: 'layoutViewport'},
] as const)(
  'uses the right-side reserved gutter in quirks mode for the $boundary',
  ({rootBoundary}) => {
    mockViewport({
      compatMode: 'BackCompat',
      htmlClientWidth: 885,
      htmlClientHeight: 600,
      htmlBCRLeft: 0,
      htmlBCRWidth: 885,
      htmlScrollLeft: 0,
      bodyClientWidth: 900,
      visualViewportWidth: 900,
    });
    html.style.scrollbarGutter = 'stable';

    const rect = getViewportRect(html, 'absolute', rootBoundary);

    expect(rect.x).toBe(0);
    expect(rect.width).toBe(885);
  },
);

// A body narrower than the <html> content box is ordinary CSS — a border, an
// explicit width, or padding on the <html> — not a reserved gutter. The <body>
// box is not read at all, so it cannot shrink the boundary.
test('does not treat body box styles as a reserved gutter', () => {
  mockViewport({
    htmlClientWidth: 900,
    htmlClientHeight: 600,
    htmlBCRLeft: 0,
    htmlScrollLeft: 0,
    bodyClientWidth: 874, // e.g. `body { border: 5px solid }`
    visualViewportWidth: 900,
  });

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(900);
});

// The same body border alongside a real gutter: the gutter is still subtracted
// in full, and the body border adds nothing to it (measured in Chrome: a 900px
// viewport with `scrollbar-gutter: stable` and `body { border: 5px solid }`
// reports clientWidth 900, border box 885, and clips content at 885).
test('subtracts only the gutter when the body also has a border', () => {
  mockViewport({
    htmlClientWidth: 900,
    htmlClientHeight: 600,
    htmlBCRLeft: 0,
    htmlBCRWidth: 885,
    htmlScrollLeft: 0,
    bodyClientWidth: 875,
    visualViewportWidth: 900,
  });
  html.style.scrollbarGutter = 'stable';

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(885);
});

// A narrower <html> border box on its own is not a gutter: `html { margin-right }`
// produces the same measurement and reserves nothing.
test('does not subtract a narrower <html> box without a declared gutter', () => {
  mockViewport({
    htmlClientWidth: 900,
    htmlClientHeight: 600,
    htmlBCRLeft: 0,
    htmlBCRWidth: 890, // e.g. `html { margin-right: 10px }`
    htmlScrollLeft: 0,
    visualViewportWidth: 900,
  });

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(900);
});

// An <html> box wider than the viewport (`html { width }`, a scale transform)
// measures as negative reserved space, which must never widen the boundary.
test('ignores a negative reserved width', () => {
  mockViewport({
    htmlClientWidth: 900,
    htmlClientHeight: 600,
    htmlBCRLeft: 0,
    htmlBCRWidth: 910,
    htmlScrollLeft: 0,
    visualViewportWidth: 900,
  });
  html.style.scrollbarGutter = 'stable';

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(900);
});

// Safety cap: an implausibly large measurement is more likely to be unusual
// styles than a scrollbar gutter, so it is ignored.
test('caps an implausibly large reserved width', () => {
  mockViewport({
    htmlClientWidth: 800,
    htmlClientHeight: 600,
    htmlBCRLeft: 0,
    htmlBCRWidth: 760, // 40px > SCROLLBAR_MAX
    htmlScrollLeft: 0,
    visualViewportWidth: 800,
  });
  html.style.scrollbarGutter = 'stable';

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(800);
});

// `scrollbar-gutter: stable both-edges` reserves a gutter on each inline edge,
// which shifts the <html> origin right by the inline-start one. That shift
// makes `windowScrollbarX` positive, so this case falls out of the gutter
// branch and is left uncorrected. Pins the current (incorrect) result: measured
// in Chrome, a 900px viewport with no scrollbar reports clientWidth 900,
// visualViewport.width 900, and border box left 15 width 870, and content is
// clipped to [15, 885] — so the correct boundary is `{x: 15, width: 870}`.
test('leaves both-edges uncorrected (known: one gutter too wide per edge)', () => {
  mockViewport({
    htmlClientWidth: 900,
    htmlClientHeight: 600,
    htmlBCRLeft: 15,
    htmlBCRWidth: 870,
    htmlScrollLeft: 0,
    visualViewportWidth: 900,
  });
  html.style.scrollbarGutter = 'stable both-edges';

  const rect = getViewportRect(html, 'absolute');

  expect(rect.x).toBe(0);
  expect(rect.width).toBe(900);
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
      visualViewportWidth: 780,
      visualViewportHeight: 560,
      visualViewportOffsetLeft: 30,
      visualViewportOffsetTop: 20,
    });
    mocks.isWebKit = webkit;

    expect(getViewportRect(html, strategy, boundary)).toEqual(expected);
  },
);
