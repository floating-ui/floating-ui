import type {Platform} from '@floating-ui/core';
import {getRectRelativeToOffsetParent} from './utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './utils/getOffsetParent';
import {getDimensions} from './utils/getDimensions';
import {convertOffsetParentRelativeRectToViewportRelativeRect} from './utils/convertOffsetParentRelativeRectToViewportRelativeRect';
import {isElement} from './utils/is';
import {getDocumentElement} from './utils/getDocumentElement';
import {getClippingClientRect} from './utils/getClippingClientRect';

export const platform: Platform = {
  getElementRects: ({reference, floating, strategy}) => ({
    reference: getRectRelativeToOffsetParent(
      reference,
      getOffsetParent(floating),
      strategy
    ),
    floating: {...getDimensions(floating), x: 0, y: 0},
  }),
  convertOffsetParentRelativeRectToViewportRelativeRect: (args) =>
    convertOffsetParentRelativeRectToViewportRelativeRect(args),
  getOffsetParent: ({element}) => getOffsetParent(element),
  isElement: (value) => isElement(value),
  getDocumentElement: ({element}) => getDocumentElement(element),
  getClippingClientRect: (args) => getClippingClientRect(args),
  getDimensions: ({element}) => getDimensions(element),
};
