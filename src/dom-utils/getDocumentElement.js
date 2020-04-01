// @flow
import { isElement } from './instanceOf';
import type { Window, VirtualElement } from '../types';

export default function getDocumentElement(
  element: Element | VirtualElement | Window
): HTMLElement {
  if (!isElement(element)) {
    // $FlowFixMe: if we end up here, we assume it's a VirtualElement, and not a Window with a `contextElement` prop
    return getDocumentElement(element.contextElement);
  }

  // $FlowFixMe: assume body is always available
  return (isElement(element) ? element.ownerDocument : element.document)
    .documentElement;
}
