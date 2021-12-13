import {isShadowRoot} from './is';

export function contains(parent: Element, child: Element): boolean {
  const rootNode = child.getRootNode?.();

  // First, attempt with faster native method
  if (parent.contains(child)) {
    return true;
  }
  // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    do {
      // use `===` replace node.isSameNode()
      if (next && parent === next) {
        return true;
      }
      // @ts-ignore: need a better way to handle this...
      next = next.parentNode || next.host;
    } while (next);
  }

  return false;
}
