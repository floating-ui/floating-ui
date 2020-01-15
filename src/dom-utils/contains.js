// @flow

export default function contains(parent: Element, child: Element): boolean {
  return (
    parent.contains(child) ||
    (parent.shadowRoot ? parent.shadowRoot.contains(child) : false)
  );
}
