// @flow
import type { ClientRectObject, VirtualElement } from '../types';

export default function getBoundingClientRect(
  element: Element | VirtualElement
): ClientRectObject {
  const rect = element.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    y: rect.top,
  };
}
