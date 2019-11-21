// @flow
import getElementClientRect from './getElementClientRect';
import getWindow from './getWindow';

export default (element: HTMLElement) => {
  const win = getWindow(element);
  const documentRect = getElementClientRect(
    element.ownerDocument.documentElement
  );
  documentRect.height = Math.max(documentRect.height, win.innerHeight);
  documentRect.width = Math.max(documentRect.width, win.innerWidth);
  return documentRect;
};
