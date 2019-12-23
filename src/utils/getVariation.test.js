// @flow
import getVariation from './getVariation';

it('gets the variation placement, given a shifted placement', () => {
  expect(getVariation('bottom-start')).toBe('start');
  expect(getVariation('bottom')).toBe(undefined);
  expect(getVariation('bottom-end')).toBe('end');

  expect(getVariation('right-start')).toBe('start');
  expect(getVariation('right')).toBe(undefined);
  expect(getVariation('right-end')).toBe('end');

  expect(getVariation('top-start')).toBe('start');
  expect(getVariation('top')).toBe(undefined);
  expect(getVariation('top-end')).toBe('end');

  expect(getVariation('left-start')).toBe('start');
  expect(getVariation('left')).toBe(undefined);
  expect(getVariation('left-end')).toBe('end');

  expect(getVariation('auto-start')).toBe('start');
  expect(getVariation('auto')).toBe(undefined);
  expect(getVariation('auto-end')).toBe('end');
});
