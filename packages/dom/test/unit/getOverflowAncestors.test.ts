import {getOverflowAncestors} from '../../src/utils/getOverflowAncestors';

test('returns all overflow ancestors', () => {
  const overflowScroll = document.createElement('div');
  overflowScroll.style.overflow = 'scroll';
  const overflowHidden = document.createElement('div');
  overflowHidden.style.overflow = 'hidden';
  const test = document.createElement('div');

  overflowScroll.append(overflowHidden);
  overflowHidden.append(test);

  expect(getOverflowAncestors(test)).toEqual([
    overflowHidden,
    overflowScroll,
    window,
  ]);
});
