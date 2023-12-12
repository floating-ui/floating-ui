import {getPlacementList} from '../../src/middleware/autoPlacement';

test('base placement', () => {
  expect(
    getPlacementList(null, false, [
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'right-end',
    ]),
  ).toEqual(['top', 'bottom', 'left', 'right']);
});

test('start alignment without auto alignment', () => {
  expect(
    getPlacementList('start', false, [
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'right-end',
      'left-start',
    ]),
  ).toEqual(['top-start', 'left-start']);
});

test('start alignment with auto alignment', () => {
  expect(
    getPlacementList('start', true, [
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'right-end',
      'left-start',
    ]),
  ).toEqual(['top-start', 'left-start', 'right-end']);
});

test('end alignment without auto alignment', () => {
  expect(
    getPlacementList('end', false, [
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'right-end',
      'left-start',
    ]),
  ).toEqual(['right-end']);
});

test('end alignment with auto alignment', () => {
  expect(
    getPlacementList('end', true, [
      'top',
      'bottom',
      'left',
      'right',
      'top-start',
      'right-end',
      'left-start',
    ]),
  ).toEqual(['right-end', 'top-start', 'left-start']);
});
