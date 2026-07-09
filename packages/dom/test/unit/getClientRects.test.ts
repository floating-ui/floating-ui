import {getClientRects} from '../../src/platform/getClientRects';
import type {VirtualElement} from '../../src/types';

test('returns an empty array for a virtual element without getClientRects', () => {
  const virtualElement: VirtualElement = {
    getBoundingClientRect: () => ({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
    }),
  };

  expect(getClientRects(virtualElement)).toEqual([]);
});

test('returns the rects of a virtual element with getClientRects', () => {
  const rect = {
    x: 10,
    y: 20,
    top: 20,
    left: 10,
    bottom: 30,
    right: 40,
    width: 30,
    height: 10,
  };
  const virtualElement: VirtualElement = {
    getBoundingClientRect: () => rect,
    getClientRects: () => [rect],
  };

  expect(getClientRects(virtualElement)).toEqual([rect]);
});

test('returns the rects of a DOM element', () => {
  const element = document.createElement('div');
  document.body.appendChild(element);

  expect(getClientRects(element)).toEqual(Array.from(element.getClientRects()));

  element.remove();
});
