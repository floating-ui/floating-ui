// @flow
import { convertValueToCoords } from './offset';

const reference = { width: 0, height: 0, x: 0, y: 0 };
const popper = { width: 0, height: 0, x: 0, y: 0 };

['top', 'right', 'bottom', 'left'].forEach((placement) => {
  it(placement, () => {
    expect(
      convertValueToCoords({
        placement,
        rects: { reference, popper },
        value: () => ({ mainAxis: 20, crossAxis: 10 }),
      })
    ).toMatchSnapshot();
  });
});
