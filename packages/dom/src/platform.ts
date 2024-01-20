import {convertOffsetParentRelativeRectToViewportRelativeRect} from './platform/convertOffsetParentRelativeRectToViewportRelativeRect';
import {getClientRects} from './platform/getClientRects';
import {getClippingRect} from './platform/getClippingRect';
import {getDimensions} from './platform/getDimensions';
import {getDocumentElement} from './platform/getDocumentElement';
import {getElementRects} from './platform/getElementRects';
import {getOffsetParent} from './platform/getOffsetParent';
import {getScale} from './platform/getScale';
import {isElement} from './platform/isElement';
import {isRTL} from './platform/isRTL';
import type {Platform} from './types';

export const platform: Platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement,
  isRTL,
};
