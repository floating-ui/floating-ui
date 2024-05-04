const topLayerSelectors = [':popover-open', ':modal'] as const;

export function isTopLayer(element: Element): boolean {
  return topLayerSelectors.some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
