import {getWindow} from './getWindow';
import {getNodeName} from './node';
import {getPlatform, getUserAgent} from './userAgent';

export function isElement(value: any): value is Element {
  return value instanceof Element || value instanceof getWindow(value).Element;
}

export function isHTMLElement(value: any): value is HTMLElement {
  return (
    value instanceof HTMLElement ||
    value instanceof getWindow(value).HTMLElement
  );
}

export function isShadowRoot(value: any): value is ShadowRoot {
  // Browsers without `ShadowRoot` support.
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  return (
    value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot
  );
}

export function isOverflowElement(element: Element): boolean {
  const {overflow, overflowX, overflowY, display} = getComputedStyle(element);
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    !['inline', 'contents'].includes(display)
  );
}

export function isTableElement(element: Element): boolean {
  return ['table', 'td', 'th'].includes(getNodeName(element));
}

export function isContainingBlock(element: Element): boolean {
  const safari = isWebKit();
  const css = getComputedStyle(element);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  return (
    css.transform !== 'none' ||
    css.perspective !== 'none' ||
    (css.containerType ? css.containerType !== 'normal' : false) ||
    (!safari && (css.backdropFilter ? css.backdropFilter !== 'none' : false)) ||
    (!safari && (css.filter ? css.filter !== 'none' : false)) ||
    ['transform', 'perspective', 'filter'].some((value) =>
      (css.willChange || '').includes(value)
    ) ||
    ['paint', 'layout', 'strict', 'content'].some((value) =>
      (css.contain || '').includes(value)
    )
  );
}

export function isWebKit(): boolean {
  if (typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('-webkit-backdrop-filter', 'none');
}

export function isLastTraversableNode(node: Node): boolean {
  return ['html', 'body', '#document'].includes(getNodeName(node));
}

// License: https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/utils/src/isVirtualEvent.ts
export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  if ((event as any).mozInputSource === 0 && event.isTrusted) {
    return true;
  }

  const androidRe = /Android/i;
  if (
    (androidRe.test(getPlatform()) || androidRe.test(getUserAgent())) &&
    (event as PointerEvent).pointerType
  ) {
    return event.type === 'click' && event.buttons === 1;
  }

  return event.detail === 0 && !(event as PointerEvent).pointerType;
}

export function isVirtualPointerEvent(event: PointerEvent) {
  return (
    (event.width === 0 && event.height === 0) ||
    (event.width === 1 &&
      event.height === 1 &&
      event.pressure === 0 &&
      event.detail === 0 &&
      event.pointerType !== 'mouse') ||
    // iOS VoiceOver returns 0.333• for width/height.
    (event.width < 1 &&
      event.height < 1 &&
      event.pressure === 0 &&
      event.detail === 0)
  );
}

export function isSafari() {
  // Chrome DevTools does not complain about navigator.vendor
  return /apple/i.test(navigator.vendor);
}

export function isMac() {
  return (
    getPlatform().toLowerCase().startsWith('mac') && !navigator.maxTouchPoints
  );
}

export function isMouseLikePointerType(
  pointerType: string | undefined,
  strict?: boolean
) {
  // On some Linux machines with Chromium, mouse inputs return a `pointerType`
  // of "pen": https://github.com/floating-ui/floating-ui/issues/2015
  const values: Array<string | undefined> = ['mouse', 'pen'];
  if (!strict) {
    values.push('', undefined);
  }
  return values.includes(pointerType);
}

export function isReactEvent(event: any): event is React.SyntheticEvent {
  return 'nativeEvent' in event;
}

export function isRootElement(element: Element): boolean {
  return element.matches('html,body');
}
