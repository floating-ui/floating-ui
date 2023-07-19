import {getWindow} from '@floating-ui/utils/dom';

export function getComputedStyle(element: Element) {
  return getWindow(element).getComputedStyle(element);
}
