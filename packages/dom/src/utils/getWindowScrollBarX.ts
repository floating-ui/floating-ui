import {getDocumentElement} from '../platform/getDocumentElement';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getNodeScroll} from './getNodeScroll';

export function getWindowScrollBarX(element: Element): number {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  return (
    getBoundingClientRect(getDocumentElement(element)).left +
    getNodeScroll(element).scrollLeft
  );
}
