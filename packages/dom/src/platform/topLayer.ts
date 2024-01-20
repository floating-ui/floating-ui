import {
  getContainingBlock,
  isContainingBlock,
  isElement,
} from '@floating-ui/utils/dom';

const ancestorQueryEventName = '__fui_aq__';
const topLayerSelectors = [':popover-open', ':modal'] as const;

export function topLayer(floating: HTMLElement) {
  let isTopLayer = false;
  let x = 0;
  let y = 0;

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
      if (el === floating || el.localName !== 'dialog') return;
      setTopLayer(':modal', el);
    });
    floating.removeEventListener(ancestorQueryEventName, handleEvent);
  }

  floating.addEventListener(ancestorQueryEventName, handleEvent);

  floating.dispatchEvent(
    new Event(ancestorQueryEventName, {composed: true, bubbles: true}),
  );

  const containingBlock = isContainingBlock(floating)
    ? floating
    : getContainingBlock(floating);

  if (isTopLayer && containingBlock) {
    const rect = containingBlock.getBoundingClientRect();
    x = rect.x;
    y = rect.y;
  }

  return {
    x,
    y,
    isTopLayer,
  };
}
