// @flow
import getWindow from './getWindow';

export default function getViewportRect(element: Element) {
  const win = getWindow(element);

  return {
    width: win.innerWidth,
    height: win.innerHeight,
    x: 0,
    y: 0,
  };
}
