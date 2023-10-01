import {
  activeElement,
  contains,
  getDocument,
  getTarget,
  isSafari,
  isTypeableElement,
} from '@floating-ui/react/utils';
import {getWindow, isElement, isHTMLElement} from '@floating-ui/utils/dom';
import * as React from 'react';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {createAttribute} from '../utils/createAttribute';
import type {DismissPayload} from './useDismiss';

export interface UseFocusProps {
  enabled?: boolean;
  visibleOnly?: boolean;
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
  const {
    open,
    onOpenChange,
    events,
    refs,
    elements: {floating, domReference},
  } = context;
  const {enabled = true, visibleOnly = true} = props;

  const blockFocusRef = React.useRef(false);
  const timeoutRef = React.useRef<number>();
  const keyboardModalityRef = React.useRef(false);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const win = getWindow(domReference);

    // If the reference was focused and the user left the tab/window, and the
    // floating element was not open, the focus should be blocked when they
    // return to the tab/window.
    function onBlur() {
      if (
        !open &&
        isHTMLElement(domReference) &&
        domReference === activeElement(getDocument(domReference))
      ) {
        blockFocusRef.current = true;
      }
    }

    function onKeyDown() {
      keyboardModalityRef.current = true;
    }

    win.addEventListener('blur', onBlur);
    win.addEventListener('keydown', onKeyDown, true);
    return () => {
      win.removeEventListener('blur', onBlur);
      win.removeEventListener('keydown', onKeyDown, true);
    };
  }, [floating, domReference, open, enabled]);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    function onDismiss(payload: DismissPayload) {
      if (payload.type === 'referencePress' || payload.type === 'escapeKey') {
        blockFocusRef.current = true;
      }
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

  return React.useMemo(() => {
    if (!enabled) {
      return {};
    }

    return {
      reference: {
        onPointerDown() {
          keyboardModalityRef.current = false;
        },
        onMouseLeave() {
          blockFocusRef.current = false;
        },
        onFocus(event) {
          if (blockFocusRef.current) return;

          const target = getTarget(event.nativeEvent);

          if (visibleOnly && isElement(target)) {
            try {
              // Safari unreliably matches `:focus-visible` on the reference
              // if focus was outside the page initially - use the fallback
              // instead.
              if (isSafari()) throw Error();
              if (!target.matches(':focus-visible')) return;
            } catch (e) {
              // Old browsers will throw an error when using `:focus-visible`.
              if (!keyboardModalityRef.current && !isTypeableElement(target)) {
                return;
              }
            }
          }

          onOpenChange(true, event.nativeEvent);
        },
        onBlur(event) {
          blockFocusRef.current = false;
          const relatedTarget = event.relatedTarget;

          // Hit the non-modal focus management portal guard. Focus will be
          // moved into the floating element immediately after.
          const movedToFocusGuard =
            isElement(relatedTarget) &&
            relatedTarget.hasAttribute(createAttribute('focus-guard')) &&
            relatedTarget.getAttribute('data-type') === 'outside';

          // Wait for the window blur listener to fire.
          timeoutRef.current = window.setTimeout(() => {
            const activeEl = activeElement(
              domReference ? domReference.ownerDocument : document
            );

            // Focus left the page, keep it open.
            if (!relatedTarget && activeEl === domReference) return;

            // When focusing the reference element (e.g. regular click), then
            // clicking into the floating element, prevent it from hiding.
            // Note: it must be focusable, e.g. `tabindex="-1"`.
            if (
              contains(refs.floating.current, relatedTarget) ||
              contains(domReference, relatedTarget) ||
              movedToFocusGuard
            ) {
              return;
            }

            onOpenChange(false, event.nativeEvent);
          });
        },
      },
    };
  }, [enabled, visibleOnly, domReference, refs, onOpenChange]);
}
