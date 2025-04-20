import {isAndroid, isJSDOM} from './platform';

export function stopEvent(event: Event | React.SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export function isReactEvent(event: any): event is React.SyntheticEvent {
  return 'nativeEvent' in event;
}

// License: https://github.com/adobe/react-spectrum/blob/b35d5c02fe900badccd0cf1a8f23bb593419f238/packages/@react-aria/utils/src/isVirtualEvent.ts
export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  // FIXME: Firefox is now emitting a deprecation warning for `mozInputSource`.
  // Try to find a workaround for this. `react-aria` source still has the check.
  if ((event as any).mozInputSource === 0 && event.isTrusted) {
    return true;
  }

  if (isAndroid() && (event as PointerEvent).pointerType) {
    return event.type === 'click' && event.buttons === 1;
  }

  return event.detail === 0 && !(event as PointerEvent).pointerType;
}

export function isVirtualPointerEvent(event: PointerEvent) {
  if (isJSDOM()) return false;
  return (
    (!isAndroid() && event.width === 0 && event.height === 0) ||
    (isAndroid() &&
      event.width === 1 &&
      event.height === 1 &&
      event.pressure === 0 &&
      event.detail === 0 &&
      event.pointerType === 'mouse') ||
    // iOS VoiceOver returns 0.333• for width/height.
    (event.width < 1 &&
      event.height < 1 &&
      event.pressure === 0 &&
      event.detail === 0 &&
      event.pointerType === 'touch')
  );
}

export function isMouseLikePointerType(
  pointerType: string | undefined,
  strict?: boolean,
) {
  // On some Linux machines with Chromium, mouse inputs return a `pointerType`
  // of "pen": https://github.com/floating-ui/floating-ui/issues/2015
  const values: Array<string | undefined> = ['mouse', 'pen'];
  if (!strict) {
    values.push('', undefined);
  }
  return values.includes(pointerType);
}
