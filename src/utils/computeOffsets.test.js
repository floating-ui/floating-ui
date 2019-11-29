// @flow
import createRectMock from '../../tests/utils/createRectMock';
import computeOffsets from './computeOffsets';
import { basePlacements } from '../enums';
import type { Placement } from '../enums';
import getMainAxisFromPlacement from './getMainAxisFromPlacement';
import getOppositePlacement from './getOppositePlacement';

const reference = createRectMock({
  width: 200,
  height: 200,
  x: 100,
  y: 100,
});
const element = createRectMock({ width: 100, height: 100, x: 0, y: 0 });
const scroll = { scrollTop: 10, scrollLeft: 20 };

describe('[strategy: absolute]', () =>
  basePlacements.forEach((placement: Placement) =>
    describe('[placement: ${placement}]', () => {
      it('computes offsets', () => {
        expect(
          computeOffsets({
            reference,
            element,
            strategy: 'absolute',
            placement,
            scroll,
          })
        ).toMatchSnapshot('x and y');

        expect(
          computeOffsets({
            reference,
            element,
            strategy: 'absolute',
            placement,
            scroll,
          })[getMainAxisFromPlacement(placement)]
        ).toEqual(
          computeOffsets({
            reference,
            element,
            strategy: 'absolute',
            placement: getOppositePlacement(placement),
            scroll,
          })[getMainAxisFromPlacement(placement)]
        );
      });
    })
  ));
