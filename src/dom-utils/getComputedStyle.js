// @flow
import getWindow from './getWindow';

export default function getComputedStyle(element: HTMLElement) {
  return getWindow(element).getComputedStyle(element);
}
