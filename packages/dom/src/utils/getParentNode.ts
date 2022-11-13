import {getNodeName} from './getNodeName';
import {getDocumentElement} from './getDocumentElement';
import {isShadowRoot} from './is';

export function getParentNode(node: Node): Node {
  if (getNodeName(node) === 'html') {
    return node;
  }

  const result =
    // Step into the shadow DOM of the parent of a slotted node
    (node as any).assignedSlot ||
    // DOM Element detected
    node.parentNode ||
    // ShadowRoot detected
    (isShadowRoot(node) ? node.host : null) ||
    // Fallback
    getDocumentElement(node);

  return isShadowRoot(result) ? result.host : result;
}
