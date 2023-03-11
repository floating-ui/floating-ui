import {mergeRects} from '../../src/middleware/inline';

test('merges rects on the same line (y coordinate)', () => {
  expect(
    mergeRects([
      {
        top: 0,
        left: 0,
        bottom: 10,
        right: 10,
        width: 10,
        height: 10,
        x: 0,
        y: 0,
      },
      {
        top: 0,
        left: 10,
        bottom: 10,
        right: 30,
        width: 20,
        height: 10,
        x: 10,
        y: 0,
      },
      {
        top: 10,
        left: 0,
        bottom: 20,
        right: 10,
        width: 10,
        height: 10,
        x: 0,
        y: 10,
      },
    ])
  ).toEqual([
    {
      top: 0,
      left: 0,
      bottom: 10,
      right: 30,
      width: 30,
      height: 10,
      x: 0,
      y: 0,
    },
    {
      top: 10,
      left: 0,
      bottom: 20,
      right: 10,
      width: 10,
      height: 10,
      x: 0,
      y: 10,
    },
  ]);
});
