// @flow
import { isElement } from './instanceOf';
import type { Window, VirtualElement } from '../types';

export default function getDocumentElement(
  element: Element | VirtualElement | Window
): HTMLElement {
  // $FlowFixMe: assume body is always available
  return (isElement(element) ? element.ownerDocument : element.document)
    .documentElement;
}
