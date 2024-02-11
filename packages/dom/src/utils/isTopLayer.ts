const topLayerSelectors = [':popover-open', ':modal'] as const;

export function isTopLayer(floating: HTMLElement) {
  return topLayerSelectors.some((selector) => {
    try {
      return floating.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
