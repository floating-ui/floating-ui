import {Platform} from '../types';
import {getRectRelativeToOffsetParent} from '../utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './getOffsetParent';

export const getElementRects: Platform['getElementRects'] = async function (
  this: Platform,
  {reference, floating, strategy}
) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(
      reference,
      await getOffsetParentFn(floating),
      strategy
    ),
    floating: {x: 0, y: 0, ...(await getDimensionsFn(floating))},
  };
};
