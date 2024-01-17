import {
  getContainingBlock,
  isContainingBlock,
  isElement,
} from '@floating-ui/utils/dom';
import type {Middleware} from '../types';

/**
 * This DOM-only middleware ensures CSS :top-layer elements (e.g. native dialogs
 * and popovers) are positioned correctly, handling containing blocks.
 */
export const topLayer = (): Middleware => ({
  name: 'topLayer',
  async fn(middlewareArguments) {
    const {
      x,
      y,
      elements: {reference, floating},
    } = middlewareArguments;
    let onTopLayer = false;
    let topLayerIsFloating = false;
    let withinReference = false;
    const diffCoords = {x: 0, y: 0};
    try {
      onTopLayer = onTopLayer || floating.matches(':popover-open');
    } catch (error) {}
    try {
      onTopLayer = onTopLayer || floating.matches(':open');
    } catch (error) {}
    try {
      onTopLayer = onTopLayer || floating.matches(':modal');
    } catch (error) {}
    topLayerIsFloating = onTopLayer;
    const dialogAncestorQueryEvent = new Event('__floating-ui__', {
      composed: true,
      bubbles: true,
    });
    floating.addEventListener(
      '__floating-ui__',
      (event: Event) => {
        (event.composedPath() as unknown as Element[]).forEach((el) => {
          withinReference = withinReference || el === reference;
          if (el === floating || el.localName !== 'dialog') return;
          try {
            onTopLayer = onTopLayer || el.matches(':modal');
          } catch (error) {}
        });
      },
      {once: true},
    );
    floating.dispatchEvent(dialogAncestorQueryEvent);

    if (isElement(reference)) {
      const root = withinReference ? reference : floating;
      const containingBlock = isContainingBlock(root)
        ? root
        : getContainingBlock(root);
      const css: CSSStyleDeclaration | Record<string, string> = {};

      if (onTopLayer && containingBlock) {
        const rect = containingBlock.getBoundingClientRect();
        // Margins are not included in the bounding client rect and need to be
        // handled separately.
        const {marginInlineStart = '0', marginBlockStart = '0'} = css;
        diffCoords.x = rect.x + parseFloat(marginInlineStart);
        diffCoords.y = rect.y + parseFloat(marginBlockStart);
      }
    }

    if (onTopLayer && topLayerIsFloating) {
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords,
      };
    }

    if (onTopLayer) {
      return {
        x,
        y,
        data: diffCoords,
      };
    }

    return {
      x: x - diffCoords.x,
      y: y - diffCoords.y,
      data: diffCoords,
    };
  },
});
