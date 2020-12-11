// @flow
import { isShadowRoot } from './instanceOf';

export default function contains(parent: Element, child: Element) {
  const rootNode = child.getRootNode && child.getRootNode();

  // First, attempt with faster native method
  if (parent.contains(child)) {
    return true;
  }
  // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      // $FlowFixMe[prop-missing]: need a better way to handle this...
      next = next.parentNode || next.host;
    } while (next);
  }

  // Give up, the result is false
  return false;
}
