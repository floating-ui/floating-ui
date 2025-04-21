import * as React from 'react';
import {getWindow, isElement, isHTMLElement} from '@floating-ui/utils/dom';
import {
  activeElement,
  contains,
  getDocument,
  getTarget,
  isMac,
  isSafari,
  isTypeableElement,
  matchesFocusVisible,
} from '@floating-ui/react/utils';

import type {
  ElementProps,
  FloatingRootContext,
  OpenChangeReason,
} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {clearTimeoutIfSet} from '../utils/clearTimeoutIfSet';

function isMacSafari() {
  return isMac() && isSafari();
}

export interface UseFocusProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether the open state only changes if the focus event is considered
   * visible (`:focus-visible` CSS selector).
   * @default true
   */
  visibleOnly?: boolean;
}

/**
 * Opens the floating element while the reference element has focus, like CSS
 * `:focus`.
 * @see https://floating-ui.com/docs/useFocus
 */
export function useFocus(
  context: FloatingRootContext,
  props: UseFocusProps = {},
): ElementProps {
  const {open, onOpenChange, events, dataRef, elements} = context;
  const {enabled = true, visibleOnly = true} = props;

  const blockFocusRef = React.useRef(false);
  const timeoutRef = React.useRef(-1);
  const keyboardModalityRef = React.useRef(true);

  React.useEffect(() => {
    if (!enabled) return;

    const win = getWindow(elements.domReference);

    // If the reference was focused and the user left the tab/window, and the
    // floating element was not open, the focus should be blocked when they
    // return to the tab/window.
    function onBlur() {
      if (
        !open &&
        isHTMLElement(elements.domReference) &&
        elements.domReference ===
          activeElement(getDocument(elements.domReference))
      ) {
        blockFocusRef.current = true;
      }
    }

    function onKeyDown() {
      keyboardModalityRef.current = true;
    }

    function onPointerDown() {
      keyboardModalityRef.current = false;
    }

    win.addEventListener('blur', onBlur);

    if (isMacSafari()) {
      win.addEventListener('keydown', onKeyDown, true);
      win.addEventListener('pointerdown', onPointerDown, true);
    }

    return () => {
      win.removeEventListener('blur', onBlur);

      if (isMacSafari()) {
        win.removeEventListener('keydown', onKeyDown, true);
        win.removeEventListener('pointerdown', onPointerDown, true);
      }
    };
  }, [elements.domReference, open, enabled]);

  React.useEffect(() => {
    if (!enabled) return;

    function onOpenChange({reason}: {reason: OpenChangeReason}) {
      if (reason === 'reference-press' || reason === 'escape-key') {
        blockFocusRef.current = true;
      }
    }

    events.on('openchange', onOpenChange);
    return () => {
      events.off('openchange', onOpenChange);
    };
  }, [events, enabled]);

  React.useEffect(() => {
    return () => {
      clearTimeoutIfSet(timeoutRef);
    };
  }, []);

  const reference: ElementProps['reference'] = React.useMemo(
    () => ({
      onMouseLeave() {
        blockFocusRef.current = false;
      },
      onFocus(event) {
        if (blockFocusRef.current) return;

        const target = getTarget(event.nativeEvent);

        if (visibleOnly && isElement(target)) {
          // Safari fails to match `:focus-visible` if focus was initially
          // outside the document.
          if (isMacSafari() && !event.relatedTarget) {
            if (!keyboardModalityRef.current && !isTypeableElement(target)) {
              return;
            }
          } else if (!matchesFocusVisible(target)) {
            return;
          }
        }

        onOpenChange(true, event.nativeEvent, 'focus');
      },
      onBlur(event) {
        blockFocusRef.current = false;
        const relatedTarget = event.relatedTarget;
        const nativeEvent = event.nativeEvent;

        // Hit the non-modal focus management portal guard. Focus will be
        // moved into the floating element immediately after.
        const movedToFocusGuard =
          isElement(relatedTarget) &&
          relatedTarget.hasAttribute(createAttribute('focus-guard')) &&
          relatedTarget.getAttribute('data-type') === 'outside';

        // Wait for the window blur listener to fire.
        timeoutRef.current = window.setTimeout(() => {
          const activeEl = activeElement(
            elements.domReference
              ? elements.domReference.ownerDocument
              : document,
          );

          // Focus left the page, keep it open.
          if (!relatedTarget && activeEl === elements.domReference) return;

          // When focusing the reference element (e.g. regular click), then
          // clicking into the floating element, prevent it from hiding.
          // Note: it must be focusable, e.g. `tabindex="-1"`.
          // We can not rely on relatedTarget to point to the correct element
          // as it will only point to the shadow host of the newly focused element
          // and not the element that actually has received focus if it is located
          // inside a shadow root.
          if (
            contains(
              dataRef.current.floatingContext?.refs.floating.current,
              activeEl,
            ) ||
            contains(elements.domReference, activeEl) ||
            movedToFocusGuard
          ) {
            return;
          }

          onOpenChange(false, nativeEvent, 'focus');
        });
      },
    }),
    [dataRef, elements.domReference, onOpenChange, visibleOnly],
  );

  return React.useMemo(
    () => (enabled ? {reference} : {}),
    [enabled, reference],
  );
}
