export function getFloatingFocusElement(
  floatingElement: HTMLElement | null,
): HTMLElement | null {
  if (!floatingElement) {
    return null;
  }
  // Try to find the element that has `{...getFloatingProps()}` spread on it.
  // This indicates the floating element is acting as a positioning wrapper, and
  // so focus should be managed on the child element with the event handlers and
  // aria props.
  return floatingElement.hasAttribute('data-floating-ui-focusable')
    ? floatingElement
    : floatingElement.querySelector('[data-floating-ui-focusable]') ||
        floatingElement;
}
