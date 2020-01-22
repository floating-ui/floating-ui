// @flow
export default function contains(parent: Element, child: Element) {
  const isShadow =
    child.getRootNode && child.getRootNode().hasOwnProperty('host');

  // First, attempt with faster native method
  if (parent.contains(child)) {
    return true;
  }
  // then fallback to custom implementation with Shadow DOM support
  else if (isShadow) {
    let next = child;
    do {
      if (next && next.isSameNode(parent)) {
        return true;
      }
      // $FlowFixMe: need a better way to handle this...
      next = next.parentNode || next.host;
    } while (next);
  }

  // Give up, the result is false
  return false;
}
