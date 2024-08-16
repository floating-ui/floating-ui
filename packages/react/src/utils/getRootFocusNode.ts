export function getRootFocusNode(
  floatingElement: HTMLElement | null,
  floatingId: string,
) {
  // Try to find the element that has `{...getFloatingProps()}` spread on it.
  // This indicates the floating element is acting as a positioning wrapper, and
  // so focus should be managed on the child element with the event handlers and
  // aria props.
  if (floatingElement) {
    return (
      floatingElement.querySelector<HTMLElement>(`[id="${floatingId}"]`) ||
      floatingElement
    );
  }
  return null;
}
