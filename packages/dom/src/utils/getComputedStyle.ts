import {getWindow} from './getWindow';

export function getComputedStyle(element: Element) {
  return getWindow(element).getComputedStyle(element);
}
