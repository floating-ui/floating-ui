// @flow
import getVariationPlacement from './getVariationPlacement';

it('gets the variation placement, given a shifted placement', () => {
  expect(getVariationPlacement('bottom-start')).toBe('start');
  expect(getVariationPlacement('bottom')).toBe(undefined);
  expect(getVariationPlacement('bottom-end')).toBe('end');

  expect(getVariationPlacement('right-start')).toBe('start');
  expect(getVariationPlacement('right')).toBe(undefined);
  expect(getVariationPlacement('right-end')).toBe('end');

  expect(getVariationPlacement('top-start')).toBe('start');
  expect(getVariationPlacement('top')).toBe(undefined);
  expect(getVariationPlacement('top-end')).toBe('end');

  expect(getVariationPlacement('left-start')).toBe('start');
  expect(getVariationPlacement('left')).toBe(undefined);
  expect(getVariationPlacement('left-end')).toBe('end');

  expect(getVariationPlacement('auto-start')).toBe('start');
  expect(getVariationPlacement('auto')).toBe(undefined);
  expect(getVariationPlacement('auto-end')).toBe('end');
});
