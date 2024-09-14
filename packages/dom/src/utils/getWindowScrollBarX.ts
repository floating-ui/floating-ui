import {getNodeScroll} from '@floating-ui/utils/dom';

import {getDocumentElement} from '../platform/getDocumentElement';
import {getBoundingClientRect} from './getBoundingClientRect';

// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
export function getWindowScrollBarX(element: Element, rect?: DOMRect): number {
  const leftScroll = getNodeScroll(element).scrollLeft;

  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }

  return rect.left + leftScroll;
}
