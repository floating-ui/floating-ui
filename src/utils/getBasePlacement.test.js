// @flow
import getBasePlacement from './getBasePlacement';

it('gets the base placement, given a shifted placement', () => {
  expect(getBasePlacement('bottom-start')).toBe('bottom');
  expect(getBasePlacement('bottom')).toBe('bottom');
  expect(getBasePlacement('bottom-end')).toBe('bottom');

  expect(getBasePlacement('right-start')).toBe('right');
  expect(getBasePlacement('right')).toBe('right');
  expect(getBasePlacement('right-end')).toBe('right');

  expect(getBasePlacement('top-start')).toBe('top');
  expect(getBasePlacement('top')).toBe('top');
  expect(getBasePlacement('top-end')).toBe('top');

  expect(getBasePlacement('left-start')).toBe('left');
  expect(getBasePlacement('left')).toBe('left');
  expect(getBasePlacement('left-end')).toBe('left');

  expect(getBasePlacement('auto-start')).toBe('auto');
  expect(getBasePlacement('auto')).toBe('auto');
  expect(getBasePlacement('auto-end')).toBe('auto');
});
