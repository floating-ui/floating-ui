// @flow
import getWindow from './getWindow';

export default function getComputedStyle(element: Element) {
  return getWindow(element).getComputedStyle(element);
}
