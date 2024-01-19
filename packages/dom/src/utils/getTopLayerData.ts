import {isElement} from '@floating-ui/utils/dom';

const ancestorQueryEventName = '__fui_aq__';
const topLayerSelectors = [':popover-open', ':modal'] as const;

export function getTopLayerData({
  reference,
  floating,
}: {
  reference?: Element;
  floating: HTMLElement;
}): [boolean, boolean] {
  let isWithinReference = false;
  let isOnTopLayer = false;

  function setTopLayer(
    selector: (typeof topLayerSelectors)[number],
    element: Element = floating,
  ) {
    try {
      isOnTopLayer = isOnTopLayer || element.matches(selector);
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

  return [isOnTopLayer, isWithinReference];
}
