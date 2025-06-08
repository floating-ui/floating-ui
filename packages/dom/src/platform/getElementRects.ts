import type {Platform} from '../types';
import {getRectRelativeToOffsetParent} from '../utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './getOffsetParent';

export const getElementRects: Platform['getElementRects'] = function (
  this: Platform,
  data,
) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = getDimensionsFn(data.floating);

  return {
    reference: getRectRelativeToOffsetParent(
      data.reference,
      getOffsetParentFn(data.floating),
      data.strategy,
    ),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height,
    },
  };
};
