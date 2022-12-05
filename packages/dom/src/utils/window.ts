export function getWindow(node: Node): Window {
  return node.ownerDocument?.defaultView || window;
}
