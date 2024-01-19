import {
  getComputedStyle,
  getContainingBlock,
  isContainingBlock,
  isElement,
} from '@floating-ui/utils/dom';
import type {Middleware} from '../types';
import {unwrapElement} from '../utils/unwrapElement';

const ancestorQueryEventName = '__fluiaq__';
const topLayerSelectors = [':popover-open', ':open', ':modal'] as const;

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

    let onTopLayer = false;
    let withinReference = false;
    let offsetX = 0;
    let offsetY = 0;
    const referenceEl = unwrapElement(reference);

    function setTopLayer(
      selector: (typeof topLayerSelectors)[number],
      element: Element = floating,
    ) {
      try {
        onTopLayer = onTopLayer || element.matches(selector);
      } catch (e) {}
    }

    topLayerSelectors.forEach((selector) => {
      setTopLayer(selector);
    });

    floating.addEventListener(
      ancestorQueryEventName,
      (event) => {
        event.composedPath().forEach((el) => {
          if (!isElement(el)) return;
          withinReference = withinReference || el === reference;
          if (el === floating || el.localName !== 'dialog') return;
          setTopLayer(':modal', el);
        });
      },
      {once: true},
    );

    floating.dispatchEvent(
      new Event(ancestorQueryEventName, {composed: true, bubbles: true}),
    );

    if (referenceEl) {
      const root = withinReference ? referenceEl : floating;
      const containingBlock = isContainingBlock(root)
        ? root
        : getContainingBlock(root);

      if (onTopLayer && containingBlock) {
        const rect = containingBlock.getBoundingClientRect();
        // Margins are not included in the bounding client rect and need to be
        // handled separately.
        const {marginInlineStart = '0', marginBlockStart = '0'} =
          getComputedStyle(containingBlock);
        offsetX = rect.x + parseFloat(marginInlineStart);
        offsetY = rect.y + parseFloat(marginBlockStart);
      }
    }

    const nextX = x + (onTopLayer ? offsetX : -offsetX);
    const nextY = y + (onTopLayer ? offsetY : -offsetY);

    return {
      x: nextX,
      y: nextY,
    };
  },
});
