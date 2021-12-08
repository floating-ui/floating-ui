import {getWindow} from './window';

export function getComputedStyle(element: Element) {
  return getWindow(element).getComputedStyle(element);
}
