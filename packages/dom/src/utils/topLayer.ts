import {getContainingBlock} from '@floating-ui/utils/dom';

const topLayerSelectors = [':popover-open', ':modal'] as const;

export function topLayer(floating: HTMLElement) {
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

  const containingBlock = getContainingBlock(floating);

  if (isTopLayer && containingBlock) {
    const rect = containingBlock.getBoundingClientRect();
    x = rect.x;
    y = rect.y;
  }

  return [isTopLayer, x, y] as const;
}
