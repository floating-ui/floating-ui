import type {Platform} from './types';
import {convertOffsetParentRelativeRectToViewportRelativeRect} from './utils/convertOffsetParentRelativeRectToViewportRelativeRect';
import {getClippingRect} from './utils/getClippingRect';
import {getComputedStyle} from './utils/getComputedStyle';
import {getDimensions} from './utils/getDimensions';
import {getDocumentElement} from './utils/getDocumentElement';
import {getOffsetParent} from './utils/getOffsetParent';
import {getRectRelativeToOffsetParent} from './utils/getRectRelativeToOffsetParent';
import {getScale} from './utils/getScale';
import {isElement} from './utils/is';

export const platform: Required<Platform> = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getScale,
  async getElementRects({reference, floating, strategy}) {
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
  },
  getClientRects: (element) => Array.from(element.getClientRects()),
  isRTL: (element) => getComputedStyle(element).direction === 'rtl',
};
