import type {Platform} from './types';
import {getRectRelativeToOffsetParent} from './utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './utils/getOffsetParent';
import {getDimensions} from './utils/getDimensions';
import {convertOffsetParentRelativeRectToViewportRelativeRect} from './utils/convertOffsetParentRelativeRectToViewportRelativeRect';
import {isElement} from './utils/is';
import {getDocumentElement} from './utils/getDocumentElement';
import {getClippingRect} from './utils/getClippingRect';
import {getComputedStyle} from './utils/getComputedStyle';
import {getScale} from './utils/getScale';

export const platform: Platform = {
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
