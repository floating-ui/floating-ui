import {convertOffsetParentRelativeRectToViewportRelativeRect} from '../../src/platform/convertOffsetParentRelativeRectToViewportRelativeRect';
import {getRectRelativeToOffsetParent} from '../../src/utils/getRectRelativeToOffsetParent';

test('does not apply Window CSS zoom normalization to an SVG offset parent', () => {
  const offsetParent = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'foreignObject',
  );
  const reference = document.createElement('div');
  const floating = document.createElement('div');

  Object.defineProperty(floating, 'currentCSSZoom', {value: 2});
  vi.spyOn(reference, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 30,
    bottom: 40,
    width: 30,
    height: 40,
    toJSON: () => ({}),
  });

  const offsetParentRect = getRectRelativeToOffsetParent(
    reference,
    offsetParent,
    'fixed',
    floating,
  );
  const viewportRect = convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: {reference, floating},
    rect: {x: 0, y: 0, width: 30, height: 40},
    offsetParent,
    strategy: 'fixed',
  });

  expect(offsetParentRect).toMatchObject({width: 30, height: 40});
  expect(viewportRect).toMatchObject({width: 30, height: 40});
});
