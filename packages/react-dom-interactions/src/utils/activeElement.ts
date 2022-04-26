/**
 * Find the real active element. Traverses into shadowRoots.
 */
export function activeElement(doc: Document) {
  let activeElement = doc.activeElement;

  while (activeElement?.shadowRoot?.activeElement != null) {
    activeElement = activeElement.shadowRoot.activeElement;
  }

  return activeElement;
}
