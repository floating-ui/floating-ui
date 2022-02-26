import type {Platform} from './types';
import {getRectRelativeToOffsetParent} from './utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './utils/getOffsetParent';
import {getDimensions} from './utils/getDimensions';
import {convertOffsetParentRelativeRectToViewportRelativeRect} from './utils/convertOffsetParentRelativeRectToViewportRelativeRect';
import {isElement} from './utils/is';
import {getDocumentElement} from './utils/getDocumentElement';
import {getClippingRect} from './utils/getClippingRect';
import {getComputedStyle} from './utils/getComputedStyle';

export const platform: Platform = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getElementRects: ({reference, floating, strategy}) => ({
    reference: getRectRelativeToOffsetParent(
      reference,
      getOffsetParent(floating),
      strategy
    ),
    floating: {...getDimensions(floating), x: 0, y: 0},
  }),
  getClientRects: (element) => Array.from(element.getClientRects()),
  isRTL: (element) => getComputedStyle(element).direction === 'rtl',
};
