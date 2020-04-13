// @flow
import getWindow from './getWindow';

export default function getViewportRect(element: Element) {
  const win = getWindow(element);
  const visualViewport = win.visualViewport;

  let width = win.innerWidth;
  let height = win.innerHeight;
  let x = 0;
  let y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;

    // iOS has a buggy implementation as expected
    if (!/iPhone|iPod|iPad/.test(navigator.platform)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return { width, height, x, y };
}
