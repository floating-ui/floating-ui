import {getDocument} from './getDocument';
import {getPlatform, getUserAgent} from './getPlatform';

export function getWindow(value: any) {
  return getDocument(value).defaultView || window;
}

export function isElement(value: any): value is Element {
  return value ? value instanceof getWindow(value).Element : false;
}

export function isHTMLElement(value: any): value is HTMLElement {
  return value ? value instanceof getWindow(value).HTMLElement : false;
}

export function isShadowRoot(node: Node): node is ShadowRoot {
  // Browsers without `ShadowRoot` support
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
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
