// If <html> has a CSS width greater than the viewport, then this will be
// incorrect for RTL.
export function getWindowScrollBarX(
  html: Element,
  rect: DOMRect = html.getBoundingClientRect(),
): number {
  return rect.left + html.scrollLeft;
}
