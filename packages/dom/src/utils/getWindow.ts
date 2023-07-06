export function getWindow(node: Node | undefined): Window {
  return node?.ownerDocument?.defaultView || window;
}
