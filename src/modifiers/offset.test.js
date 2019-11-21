// @flow
import createRectMock from '../../tests/utils/createRectMock';
import { distanceAndSkiddingToXY } from './offset';

const reference = createRectMock({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
});

const popper = createRectMock({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
});

['top', 'right', 'bottom', 'left'].forEach(placement => {
  it(placement, () => {
    expect(
      distanceAndSkiddingToXY(placement, { reference, popper }, () => [10, 20])
    ).toMatchSnapshot();
  });
});
