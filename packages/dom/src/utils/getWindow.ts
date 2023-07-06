export function getWindow(node: Node | undefined): Window {
  return node ? node.ownerDocument?.defaultView || window : window;
}
