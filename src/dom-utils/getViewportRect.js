// @flow
import getWindow from './getWindow';
import getDocumentElement from './getDocumentElement';
import getWindowScrollBarX from './getWindowScrollBarX';

export default function getViewportRect(element: Element) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;

  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;

  // We don't know which browsers have buggy or odd implementations of this, so
  // for now we're only applying it to iOS to fix the keyboard issue.
  // Investigation required
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;

    // Not Safari (which uses visual viewport by default)
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y,
  };
}
