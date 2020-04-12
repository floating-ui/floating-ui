// @flow
import getWindow from './getWindow';

export default function getViewportRect(element: Element) {
  const win = getWindow(element);
  const visualViewport = win.visualViewport || {};

  return {
    width: visualViewport.width || win.innerWidth,
    height: visualViewport.height || win.innerHeight,
    x: visualViewport.offsetLeft || 0,
    y: visualViewport.offsetTop || 0,
  };
}
