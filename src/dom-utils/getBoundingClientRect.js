// @flow
import type { ClientRectObject, VirtualElement } from '../types';

export default (element: Element | VirtualElement): ClientRectObject => {
  const rect = JSON.parse(JSON.stringify(element.getBoundingClientRect()));
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
};
