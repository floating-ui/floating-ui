// @flow
import getWindow from './getWindow';

export default function getWindowScroll(node: Node) {
  const win = getWindow(node);
  const scrollLeft = win.pageXOffset;
  const scrollTop = win.pageYOffset;
  return { scrollLeft, scrollTop };
}
