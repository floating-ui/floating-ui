import type {Platform} from '@floating-ui/core';
import {getRectRelativeToOffsetParent} from './utils/getRectRelativeToOffsetParent';
import {getOffsetParent} from './utils/getOffsetParent';
import {getDimensions} from './utils/getDimensions';
import {convertOffsetParentRelativeRectToViewportRelativeRect} from './utils/convertOffsetParentRelativeRectToViewportRelativeRect';
import {isElement} from './utils/is';
import {getDocumentElement} from './utils/getDocumentElement';
import {getClippingClientRect} from './utils/getClippingClientRect';

export const platform: Platform = {
  getElementRects: ({reference, floating, strategy}) =>
    Promise.resolve({
      reference: getRectRelativeToOffsetParent(
        reference,
        getOffsetParent(floating),
        strategy
      ),
      floating: {...getDimensions(floating), x: 0, y: 0},
    }),
  convertOffsetParentRelativeRectToViewportRelativeRect: (args) =>
    Promise.resolve(
      convertOffsetParentRelativeRectToViewportRelativeRect(args)
    ),
  getOffsetParent: ({element}) => Promise.resolve(getOffsetParent(element)),
  isElement: (value) => Promise.resolve(isElement(value)),
  getDocumentElement: ({element}) =>
    Promise.resolve(getDocumentElement(element)),
  getClippingClientRect: (args) => Promise.resolve(getClippingClientRect(args)),
  getDimensions: ({element}) => Promise.resolve(getDimensions(element)),
};
