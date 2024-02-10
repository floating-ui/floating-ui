const topLayerSelectors = [':popover-open', ':modal'] as const;

export function topLayer(floating: HTMLElement) {
  let isTopLayer = false;

  function setIsTopLayer(selector: (typeof topLayerSelectors)[number]) {
    try {
      isTopLayer = isTopLayer || floating.matches(selector);
    } catch (e) {}
  }

  topLayerSelectors.forEach((selector) => {
    setIsTopLayer(selector);
  });

  return isTopLayer;
}
