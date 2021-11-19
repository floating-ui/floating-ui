// @flow
import getNodeName from './getNodeName';
import getDocumentElement from './getDocumentElement';
import { isShadowRoot } from './instanceOf';

export default function getParentNode(element: Node | ShadowRoot): Node {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element) // fallback
  );
}
