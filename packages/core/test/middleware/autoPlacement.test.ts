import {computePosition, autoPlacement} from '../../src';
import {getPlacementList} from '../../src/middleware/autoPlacement';

test('checks remaining placements after consecutive duplicates', async () => {
  const {placement} = await computePosition(
    {},
    {},
    {
      placement: 'top',
      middleware: [
        autoPlacement({allowedPlacements: ['top', 'top', 'bottom']}),
      ],
      platform: {
        getElementRects: () => ({
          reference: {x: 0, y: 0, width: 10, height: 10},
          floating: {x: 0, y: 0, width: 5, height: 5},
        }),
        getClippingRect: () => ({x: 0, y: 0, width: 100, height: 100}),
        getDimensions: () => ({width: 5, height: 5}),
      },
    },
  );

  expect(placement).toBe('bottom');
});

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
