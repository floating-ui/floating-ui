// @flow
export default function getFirstVisibleElementChild(
  element: Element
): ?HTMLElement {
  return Array.from(element.children).find(
    (childElement: HTMLElement) => childElement.offsetParent != null
  );
}
