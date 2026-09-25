import {getExpandedPlacements} from '../src';

test('aligned placement: returns 3 unique alternatives excluding original', () => {
  expect(getExpandedPlacements('top-start')).toEqual([
    'top-end',
    'bottom-start',
    'bottom-end',
  ]);
  expect(getExpandedPlacements('bottom-end')).toEqual([
    'bottom-start',
    'top-end',
    'top-start',
  ]);
  expect(getExpandedPlacements('left-start')).toEqual([
    'left-end',
    'right-start',
    'right-end',
  ]);
  expect(getExpandedPlacements('right-end')).toEqual([
    'right-start',
    'left-end',
    'left-start',
  ]);
});

test('base placement: returns only the opposite placement (no original, no duplicates)', () => {
  expect(getExpandedPlacements('top')).toEqual(['bottom']);
  expect(getExpandedPlacements('bottom')).toEqual(['top']);
  expect(getExpandedPlacements('left')).toEqual(['right']);
  expect(getExpandedPlacements('right')).toEqual(['left']);
});
