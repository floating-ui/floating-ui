// @flow
import createRectMock from 'createRectMock';
import computeOffsets from './computeOffsets';
import { basePlacements, placements } from '../enums';
import type { Placement } from '../enums';
import getMainAxisFromPlacement from './getMainAxisFromPlacement';
import getAltAxis from './getAltAxis';
import getOppositePlacement from './getOppositePlacement';

const reference = createRectMock({
  width: 200,
  height: 200,
  x: 100,
  y: 100,
});
const popper = createRectMock({ width: 100, height: 100, x: 0, y: 0 });

describe('[strategy: absolute]', () =>
  basePlacements.forEach((placement: Placement) =>
    describe('[placement: ${placement}]', () => {
      it('computes offsets', () => {
        expect(
          computeOffsets({
            reference,
            popper,
            strategy: 'absolute',
            placement,
          })
        ).toMatchSnapshot('x and y');

        expect(
          computeOffsets({
            reference,
            popper,
            strategy: 'absolute',
            placement,
          })[getMainAxisFromPlacement(placement)]
        ).toEqual(
          computeOffsets({
            reference,
            popper,
            strategy: 'absolute',
            placement: getOppositePlacement(placement),
          })[getMainAxisFromPlacement(placement)]
        );
      });
    })
  ));
