// @flow
import getRectRelativeToOffsetParent from './getRectRelativeToOffsetParent';
import getWindow from './getWindow';
import getDocumentElement from './getDocumentElement';

export default (element: HTMLElement) => {
  const win = getWindow(element);
  const documentRect = getRectRelativeToOffsetParent(
    getDocumentElement(element)
  );
  documentRect.height = Math.max(documentRect.height, win.innerHeight);
  documentRect.width = Math.max(documentRect.width, win.innerWidth);
  return documentRect;
};
