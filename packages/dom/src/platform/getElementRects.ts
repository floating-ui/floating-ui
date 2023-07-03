import {Platform} from '../types';
import {getRectRelativeToOffsetParent} from '../utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './getOffsetParent';

export const getElementRects: Platform['getElementRects'] = function (
  this: Platform,
  {reference, floating, strategy}
) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  return {
    reference: getRectRelativeToOffsetParent(
      reference,
      getOffsetParentFn(floating),
      strategy
    ),
    floating: {x: 0, y: 0, ...getDimensionsFn(floating)},
  };
};
