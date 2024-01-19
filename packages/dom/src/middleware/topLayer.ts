import {
  getComputedStyle,
  getContainingBlock,
  isContainingBlock,
} from '@floating-ui/utils/dom';
import type {Middleware} from '../types';
import {unwrapElement} from '../utils/unwrapElement';
import {getTopLayerData} from '../utils/getTopLayerData';

/**
 * This DOM-only middleware ensures CSS :top-layer elements (e.g. native dialogs
 * and popovers) are positioned correctly, handling containing blocks.
 */
export const topLayer = (): Middleware => ({
  name: 'topLayer',
  async fn(state) {
    const {
      x,
      y,
      elements: {reference, floating},
    } = state;

    const referenceEl = unwrapElement(reference);

    const [isOnTopLayer, isWithinReference] = getTopLayerData({
      reference: referenceEl,
      floating,
    });

    let offsetX = 0;
    let offsetY = 0;

    if (referenceEl) {
      const root = isWithinReference ? referenceEl : floating;
      const containingBlock = isContainingBlock(root)
        ? root
        : getContainingBlock(root);

      if (isOnTopLayer && containingBlock) {
        const rect = containingBlock.getBoundingClientRect();
        // Margins are not included in the bounding client rect and need to be
        // handled separately.
        const {marginInlineStart = '0', marginBlockStart = '0'} =
          getComputedStyle(containingBlock);
        offsetX = rect.x + parseFloat(marginInlineStart);
        offsetY = rect.y + parseFloat(marginBlockStart);
      }
    }

    const nextX = x + (isOnTopLayer ? offsetX : -offsetX);
    const nextY = y + (isOnTopLayer ? offsetY : -offsetY);

    return {
      x: nextX,
      y: nextY,
    };
  },
});
