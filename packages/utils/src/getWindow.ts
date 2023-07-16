export function getWindow(node: any): Window {
  const win = window;
  if (node && 'ownerDocument' in node) {
    return node.ownerDocument?.defaultView || win;
  }
  return win;
}
