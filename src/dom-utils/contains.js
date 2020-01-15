// @flow

export default function contains(parent: Element, child: Element): boolean {
  return parent.shadowRoot
    ? parent.shadowRoot.contains(child)
    : parent.contains(child);
}
