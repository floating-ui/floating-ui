import {convertOffsetParentRelativeRectToViewportRelativeRect} from '../../src/platform/convertOffsetParentRelativeRectToViewportRelativeRect';

test.each([
  [0.5, 0.5],
  [1, 1],
  [2, 0.75],
])('scales offset-parent borders with the viewport axes (%s, %s)', (x, y) => {
  const offsetParent = document.createElement('div');
  offsetParent.style.width = '500px';
  offsetParent.style.height = '300px';
  Object.defineProperties(offsetParent, {
    offsetWidth: {value: 500},
    offsetHeight: {value: 300},
    clientLeft: {value: 20},
    clientTop: {value: 12},
    scrollLeft: {value: 5},
    scrollTop: {value: 7},
  });
  vi.spyOn(offsetParent, 'getBoundingClientRect').mockReturnValue({
    x: 50,
    y: 80,
    left: 50,
    top: 80,
    width: 500 * x,
    height: 300 * y,
    right: 50 + 500 * x,
    bottom: 80 + 300 * y,
    toJSON: () => ({}),
  });

  const result = convertOffsetParentRelativeRectToViewportRelativeRect({
    rect: {x: 30, y: 40, width: 60, height: 70},
    offsetParent,
    strategy: 'absolute',
  });

  expect(result).toEqual({
    x: 50 + (20 + 30 - 5) * x,
    y: 80 + (12 + 40 - 7) * y,
    width: 60 * x,
    height: 70 * y,
  });
});
