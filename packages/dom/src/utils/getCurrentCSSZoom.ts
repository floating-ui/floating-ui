export function getCurrentCSSZoom(element: Element): number {
  return (element as any).currentCSSZoom || 1;
}
