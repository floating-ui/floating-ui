// @flow
import type { ClientRectObject, VirtualElement } from '../types';
import { isHTMLElement } from './instanceOf';

const round = Math.round;

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
      scaleX = rect.width / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = rect.height / offsetHeight || 1;
    }
  }

  return {
    width: round(rect.width / scaleX),
    height: round(rect.height / scaleY),
    top: round(rect.top / scaleY),
    right: round(rect.right / scaleX),
    bottom: round(rect.bottom / scaleY),
    left: round(rect.left / scaleX),
    x: round(rect.left / scaleX),
    y: round(rect.top / scaleY),
  };
}
