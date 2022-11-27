import {getDocument} from './getDocument';
import {getUserAgent} from './getPlatform';

function getWindow(value: any) {
  return getDocument(value).defaultView ?? window;
}

export function isElement(value: any): value is HTMLElement {
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

// License: https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/utils/src/isVirtualEvent.ts#L42
export function isVirtualEvent(event: MouseEvent | PointerEvent): boolean {
  function isPointer(event: any): event is PointerEvent {
    return typeof event.width === 'number';
  }

  if (isPointer(event)) {
    return (
      (event.width === 0 && event.height === 0) ||
      (event.width <= 1 &&
        event.height <= 1 &&
        event.pressure === 0 &&
        event.detail === 0)
    );
  }

  if ((event as any).mozInputSource === 0 && event.isTrusted) {
    return true;
  }

  if (/Android/i.test(getUserAgent()) && (event as PointerEvent).pointerType) {
    return event.type === 'click' && event.buttons === 1;
  }

  return event.detail === 0 && !(event as PointerEvent).pointerType;
}
