import {afterEach, expect, test, vi} from 'vitest';

import {getViewportRect} from '../../src/utils/getViewportRect';

const html = document.documentElement;

interface Geometry {
  htmlClientWidth: number;
  htmlClientHeight: number;
  htmlBCRLeft: number;
  htmlScrollLeft: number;
  bodyClientWidth: number;
  visualViewportWidth: number;
}

function mockViewport({
  htmlClientWidth,
  htmlClientHeight,
  htmlBCRLeft,
  htmlScrollLeft,
  bodyClientWidth,
  visualViewportWidth,
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
    height: htmlClientHeight,
    offsetLeft: 0,
    offsetTop: 0,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.style.margin = '';
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
