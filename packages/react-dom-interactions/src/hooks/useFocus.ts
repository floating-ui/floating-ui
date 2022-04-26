import * as React from 'react';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {getDocument} from '../utils/getDocument';
import {isElement} from '../utils/is';

export interface Props {
  enabled?: boolean;
  keyboardOnly?: boolean;
}

/**
 * Adds focus event listeners that change the open state, like CSS :focus.
 * @see https://floating-ui.com/docs/useFocus
 */
export const useFocus = <RT extends ReferenceType = ReferenceType>(
  {open, onOpenChange, dataRef, refs, events}: FloatingContext<RT>,
  {enabled = true, keyboardOnly = true}: Props = {}
): ElementProps => {
  const blockFocusRef = React.useRef(false);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const doc = getDocument(refs.floating.current);
    const win = doc.defaultView ?? window;

    function onBlur() {
      blockFocusRef.current = !open;
    }

    function onFocus() {
      setTimeout(() => {
        blockFocusRef.current = false;
      });
    }

    win.addEventListener('focus', onFocus);
    win.addEventListener('blur', onBlur);
    return () => {
      win.removeEventListener('focus', onFocus);
      win.removeEventListener('blur', onBlur);
    };
  }, [refs.floating, open, enabled]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    function onDismiss() {
      blockFocusRef.current = true;
    }

    events.on('dismiss', onDismiss);
    return () => {
      events.off('dismiss', onDismiss);
    };
  }, [events, enabled]);

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      onPointerDown({pointerType}) {
        blockFocusRef.current = !!(pointerType && keyboardOnly);
      },
      onFocus(event) {
        // Note: due to the `window` focus/blur listeners, switching between
        // DevTools touch/normal mode may cause this to fail on the first
        // focus of the window/touch of the element as it gets set to `false`.
        if (blockFocusRef.current) {
          return;
        }

        // Dismiss with click should ignore the subsequent `focus` trigger, but
        // only if the click originated inside the reference element.
        if (
          event.type === 'focus' &&
          dataRef.current.openEvent?.type === 'mousedown' &&
          isElement(refs.reference.current) &&
          refs.reference.current?.contains(
            dataRef.current.openEvent?.target as Element | null
          )
        ) {
          return;
        }

        dataRef.current.openEvent = event.nativeEvent;
        onOpenChange(true);
      },
      onBlur(event) {
        const target = event.relatedTarget as Element | null;
        // When focusing the reference element (e.g. regular click), then
        // clicking into the floating element, prevent it from hiding.
        // Note: it must be focusable, e.g. `tabindex="-1"`.
        if (
          refs.floating.current?.contains(target) ||
          (isElement(refs.reference.current) &&
            refs.reference.current.contains(target))
        ) {
          return;
        }

        blockFocusRef.current = false;
        onOpenChange(false);
      },
    },
  };
};
