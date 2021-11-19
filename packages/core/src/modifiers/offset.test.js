// @flow
import { convertTupleToCoords } from './offset';

const reference = { width: 0, height: 0, x: 0, y: 0 };
const popper = { width: 0, height: 0, x: 0, y: 0 };

['top', 'right', 'bottom', 'left'].forEach((placement) => {
  it(placement, () => {
    expect(
      convertTupleToCoords({
        placement,
        rects: { reference, popper },
        coords: { x: 0, y: 0 },
        tuple: () => [10, 20],
      })
    ).toMatchSnapshot();
  });
});
