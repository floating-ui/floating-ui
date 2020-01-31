// @flow
import { isElement } from './instanceOf';
import type { Window } from '../types';

export default function getDocumentElement(
  element: Element | Window
): HTMLElement {
  // $FlowFixMe: assume body is always available
  return (isElement(element) ? element.ownerDocument : element.document)
    .documentElement;
}
