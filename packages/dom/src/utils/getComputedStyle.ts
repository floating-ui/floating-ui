import {getWindow} from '@floating-ui/utils';

export function getComputedStyle(element: Element) {
  return getWindow(element).getComputedStyle(element);
}
