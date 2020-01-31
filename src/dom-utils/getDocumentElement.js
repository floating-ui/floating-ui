// @flow
import { isElement } from './instanceOf';

export default function getDocumentElement(
  element: Element | Window
): HTMLElement {
  // $FlowFixMe: assume body is always available
  return (isElement(element) ? element.ownerDocument : element.document)
    .documentElement;
}
