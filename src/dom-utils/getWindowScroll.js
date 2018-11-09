// @flow
import getWindow from './getWindow';

export default function getWindowScroll(element: Element) {
  const win = getWindow(element);
  const scrollLeft = win.pageXOffset;
  const scrollTop = win.pageYOffset;
  return { scrollLeft, scrollTop };
}
