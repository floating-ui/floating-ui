import {isElement, isRootElement, isShadowRoot} from './is';

export function closest(node: Node | null, selector: string): Node | null {
  if (!node || (isElement(node) && isRootElement(node))) {
    return null;
  }

  if (isShadowRoot(node)) {
    return closest(node.host, selector);
  }

  if (isElement(node) && node.matches(selector)) {
    return node;
  }

  return closest(node.parentNode, selector);
}
