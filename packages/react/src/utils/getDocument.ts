export function getDocument(node: Element | null) {
  return node?.ownerDocument || document;
}
