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
    // Fallback to 1 in case both values are `0`
    scaleX = rect.width / element.offsetWidth || 1;
    scaleY = rect.height / element.offsetHeight || 1;
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
