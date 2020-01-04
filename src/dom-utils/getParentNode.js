// @flow
import getNodeName from './getNodeName';

export default function getParentNode(element: Node | ShadowRoot): Node {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (
    element.parentNode || // DOM Element detected
    // $FlowFixMe: need a better way to handle this...
    element.host || // ShadowRoot detected
    document.ownerDocument || // Fallback to ownerDocument if available
    document.documentElement // Or to documentElement if everything else fails
  );
}
