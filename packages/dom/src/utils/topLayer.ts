import {
  getContainingBlock,
  getNodeScroll,
  getWindow,
} from '@floating-ui/utils/dom';

const topLayerSelectors = [':popover-open', ':modal'] as const;

export function topLayer(floating: HTMLElement, isFixed: boolean) {
  let isTopLayer = false;
  let x = 0;
  let y = 0;

  function setIsTopLayer(selector: (typeof topLayerSelectors)[number]) {
    try {
      isTopLayer = isTopLayer || floating.matches(selector);
    } catch (e) {}
  }

  topLayerSelectors.forEach((selector) => {
    setIsTopLayer(selector);
  });

  if (isTopLayer) {
    const containingBlock = getContainingBlock(floating);

    if (containingBlock) {
      const rect = containingBlock.getBoundingClientRect();
      x = rect.x;
      y = rect.y;

      if (!isFixed) {
        const winScroll = getNodeScroll(getWindow(floating));
        x += winScroll.scrollLeft;
        y += winScroll.scrollTop;
      }
    }
  }

  return [isTopLayer, x, y] as const;
}
