import {
  getContainingBlock,
  isContainingBlock,
  isElement,
} from '@floating-ui/utils/dom';
import type {ReferenceElement, FloatingElement} from '../types';
import {unwrapElement} from '../utils/unwrapElement';

const ancestorQueryEventName = '__fui_aq__';
const topLayerSelectors = [':popover-open', ':modal'] as const;

export function topLayer({
  reference,
  floating,
}: {
  reference?: ReferenceElement;
  floating: FloatingElement;
}) {
  const referenceEl = reference && unwrapElement(reference);

  let isWithinReference = false;
  let isTopLayer = false;

  function setTopLayer(
    selector: (typeof topLayerSelectors)[number],
    element: Element = floating,
  ) {
    try {
      isTopLayer = isTopLayer || element.matches(selector);
    } catch (e) {}
  }

  topLayerSelectors.forEach((selector) => {
    setTopLayer(selector);
  });

  function handleEvent(event: Event) {
    event.composedPath().forEach((el) => {
      if (!isElement(el)) return;
      isWithinReference = isWithinReference || el === reference;
      if (el === floating || el.localName !== 'dialog') return;
      setTopLayer(':modal', el);
    });
    floating.removeEventListener(ancestorQueryEventName, handleEvent);
  }

  floating.addEventListener(ancestorQueryEventName, handleEvent);

  floating.dispatchEvent(
    new Event(ancestorQueryEventName, {composed: true, bubbles: true}),
  );

  let offsetX = 0;
  let offsetY = 0;

  if (referenceEl) {
    const root = isWithinReference ? referenceEl : floating;
    const containingBlock = isContainingBlock(root)
      ? root
      : getContainingBlock(root);

    if (isTopLayer && containingBlock) {
      const rect = containingBlock.getBoundingClientRect();
      // Margins are not included in the bounding client rect and need to be
      // handled separately.
      const {marginInlineStart = '0', marginBlockStart = '0'} =
        getComputedStyle(containingBlock);
      offsetX = rect.x + parseFloat(marginInlineStart);
      offsetY = rect.y + parseFloat(marginBlockStart);
    }
  }

  const addX = isTopLayer ? offsetX : -offsetX;
  const addY = isTopLayer ? offsetY : -offsetY;

  return {
    x: addX,
    y: addY,
    isTopLayer,
  };
}
