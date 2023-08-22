import {isElement, isHTMLElement} from '@floating-ui/utils/dom';
import {
  activeElement,
  contains,
  getDocument,
  isEventTargetWithin,
} from '@floating-ui/utils/react';
import {createEffect, onCleanup} from 'solid-js';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {createAttribute} from '../utils/createAttribute';
import type {DismissPayload} from './useDismiss';

export interface UseFocusProps {
  enabled?: boolean;
  keyboardOnly?: boolean;
}

/**
 * Opens the floating element while the reference element has focus, like CSS
 * `:focus`.
 * @see https://floating-ui.com/docs/useFocus
 */
export function useFocus<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseFocusProps = {}
): ElementProps {
  const {open, onOpenChange, dataRef, events, refs} = context;
  const {enabled = true, keyboardOnly = true} = props;

  // let pointerTypeRef = '';
  let blockFocusRef = false;
  let timeoutRef: any;

  createEffect(() => {
    if (!enabled) {
      return;
    }

    const doc = getDocument(refs.floating());
    const win = doc.defaultView || window;

    // If the reference was focused and the user left the tab/window, and the
    // floating element was not open, the focus should be blocked when they
    // return to the tab/window.
    function onBlur() {
      const domReference = refs.reference();
      if (
        !open() &&
        isHTMLElement(domReference) &&
        domReference === activeElement(getDocument(domReference))
      ) {
        blockFocusRef = true;
      }
    }

    win.addEventListener('blur', onBlur);
    return () => {
      win.removeEventListener('blur', onBlur);
    };
  });

  createEffect(() => {
    if (!enabled) {
      return;
    }

    function onDismiss(payload: DismissPayload) {
      if (payload.type === 'referencePress' || payload.type === 'escapeKey') {
        blockFocusRef = true;
      }
    }

    events.on('dismiss', onDismiss);
    return () => {
      events.off('dismiss', onDismiss);
    };
  });

  onCleanup(() => {
    return () => {
      clearTimeout(timeoutRef);
    };
  });

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      onPointerDown({pointerType}) {
        // pointerTypeRef = pointerType;
        blockFocusRef = !!(pointerType && keyboardOnly);
      },
      onMouseLeave() {
        blockFocusRef = false;
      },
      onFocus(event) {
        if (blockFocusRef) {
          return;
        }

        // Dismiss with click should ignore the subsequent `focus` trigger,
        // but only if the click originated inside the reference element.
        if (
          event.type === 'focus' &&
          dataRef.openEvent?.type === 'mousedown' &&
          isEventTargetWithin(
            dataRef.openEvent,
            refs.reference() as Node | null
          )
        ) {
          return;
        }

        onOpenChange(true, event);
      },
      onBlur(event) {
        blockFocusRef = false;
        const relatedTarget = event.relatedTarget as HTMLElement | null;

        // Hit the non-modal focus management portal guard. Focus will be
        // moved into the floating element immediately after.
        const movedToFocusGuard =
          isElement(relatedTarget) &&
          relatedTarget.hasAttribute(createAttribute('focus-guard')) &&
          relatedTarget.getAttribute('data-type') === 'outside';

        // Wait for the window blur listener to fire.
        timeoutRef = setTimeout(() => {
          // When focusing the reference element (e.g. regular click), then
          // clicking into the floating element, prevent it from hiding.
          // Note: it must be focusable, e.g. `tabindex="-1"`.
          if (
            contains(refs.floating(), relatedTarget) ||
            contains(refs.reference() as HTMLElement | null, relatedTarget) ||
            movedToFocusGuard
          ) {
            return;
          }

          onOpenChange(false, event);
        });
      },
    },
  };
}
