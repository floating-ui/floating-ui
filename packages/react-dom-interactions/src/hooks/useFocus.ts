import * as React from 'react';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {getDocument} from '../utils/getDocument';
import {isHTMLElement} from '../utils/is';

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
  const pointerTypeRef = React.useRef('');
  const blockFocusRef = React.useRef(false);
  const timeoutRef = React.useRef<any>();

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const doc = getDocument(refs.floating.current);
    const win = doc.defaultView ?? window;

    function onBlur() {
      if (!open && isHTMLElement(refs.domReference.current)) {
        refs.domReference.current.blur();
      }
    }

    win.addEventListener('blur', onBlur);
    return () => {
      win.removeEventListener('blur', onBlur);
    };
  }, [refs, open, enabled]);

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

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      onPointerDown({pointerType}) {
        pointerTypeRef.current = pointerType;
        blockFocusRef.current = !!(pointerType && keyboardOnly);
      },
      onPointerLeave() {
        blockFocusRef.current = false;
      },
      onFocus(event) {
        if (blockFocusRef.current) {
          return;
        }

        // Dismiss with click should ignore the subsequent `focus` trigger, but
        // only if the click originated inside the reference element.
        if (
          event.type === 'focus' &&
          dataRef.current.openEvent?.type === 'mousedown' &&
          refs.domReference.current?.contains(
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
        // Wait for the window blur listener to fire.
        timeoutRef.current = setTimeout(() => {
          // When focusing the reference element (e.g. regular click), then
          // clicking into the floating element, prevent it from hiding.
          // Note: it must be focusable, e.g. `tabindex="-1"`.
          if (
            refs.floating.current?.contains(target) ||
            refs.domReference.current?.contains(target)
          ) {
            return;
          }

          blockFocusRef.current = false;
          onOpenChange(false);
        });
      },
    },
  };
};
