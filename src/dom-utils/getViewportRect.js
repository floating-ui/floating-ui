// @flow
import getWindow from './getWindow';

export default function getViewportRect(element: Element) {
  const win = getWindow(element);
  const visualViewport = win.visualViewport || {};

  return {
    width: visualViewport.width || win.innerWidth,
    height: visualViewport.height || win.innerHeight,
    x: 0,
    y: 0,
  };
}
