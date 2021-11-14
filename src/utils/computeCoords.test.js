// @flow
import createRectMock from '../../tests/utils/createRectMock';
import computeCoords from './computeCoords';
import { placements } from '../enums';

const reference = createRectMock({ width: 200, height: 200, x: 100, y: 100 });
const popper = createRectMock({ width: 100, height: 100, x: 0, y: 0 });

placements.forEach((placement) => {
  describe(`[placement: ${placement}]`, () => {
    it('computes offsets', () => {
      expect(computeCoords({ reference, popper, placement })).toMatchSnapshot();
    });
  });
});
