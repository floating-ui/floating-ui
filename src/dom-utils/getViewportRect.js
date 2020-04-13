// @flow
import getWindow from './getWindow';

export default function getViewportRect(element: Element) {
  const win = getWindow(element);
  const visualViewport = win.visualViewport;

  let width = win.innerWidth;
  let height = win.innerHeight;

  // We don't know which browsers have buggy or odd implementations of this, so
  // for now we're only applying it to iOS to fix the keyboard issue.
  // Investigation required
  if (visualViewport && /iPhone|iPod|iPad/.test(navigator.platform)) {
    width = visualViewport.width;
    height = visualViewport.height;
  }

  return { width, height, x: 0, y: 0 };
}
