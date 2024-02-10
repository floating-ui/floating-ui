import type {Platform} from '../types';
import {getRectRelativeToOffsetParent} from '../utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './getOffsetParent';

export const getElementRects: Platform['getElementRects'] = async function (
  this: Platform,
  data,
) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(
      data.reference,
      await getOffsetParentFn(data.floating),
      data.strategy,
    ),
    floating: {x: 0, y: 0, ...(await getDimensionsFn(data.floating))},
  };
};
