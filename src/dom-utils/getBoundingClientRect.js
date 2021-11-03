// @flow
import type { ClientRectObject, VirtualElement } from '../types';
import { isHTMLElement } from './instanceOf';
import { round } from '../utils/math';

export default function getBoundingClientRect(
  element: Element | VirtualElement,
  includeScale: boolean = false
): ClientRectObject {
  const rect = element.getBoundingClientRect();
  let scaleX = 1;
  let scaleY = 1;

  if (isHTMLElement(element) && includeScale) {
    const offsetHeight = element.offsetHeight;
    const offsetWidth = element.offsetWidth;

    // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
    // Fallback to 1 in case both values are `0`
    if (offsetWidth > 0) {
      scaleX = round(rect.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect.height) / offsetHeight || 1;
    }
  }

  return {
    width: rect.width / scaleX,
    height: rect.height / scaleY,
    top: rect.top / scaleY,
    right: rect.right / scaleX,
    bottom: rect.bottom / scaleY,
    left: rect.left / scaleX,
    x: rect.left / scaleX,
    y: rect.top / scaleY,
  };
}
