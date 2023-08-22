import {isHTMLElement} from '@floating-ui/utils/dom';
import {
  isMouseLikePointerType,
  isTypeableElement,
} from '@floating-ui/utils/react';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';

function isButtonTarget(event: KeyboardEvent) {
  return isHTMLElement(event.target) && event.target.tagName === 'BUTTON';
}

function isSpaceIgnored(element: Element | null) {
  return isTypeableElement(element);
}

export interface UseClickProps {
  enabled?: boolean;
  event?: 'click' | 'mousedown';
  toggle?: boolean;
  ignoreMouse?: boolean;
  keyboardHandlers?: boolean;
}
type PointerType = 'mouse' | 'pen' | 'touch';
/**
 * Opens or closes the floating element when clicking the reference element.
 * @see https://floating-ui.com/docs/useClick
 */
export function useClick<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseClickProps = {}
): ElementProps {
  const {open, onOpenChange, dataRef, refs} = context;
  const {
    enabled = true,
    event: eventOption = 'click',
    toggle = true,
    ignoreMouse = false,
    keyboardHandlers = true,
  } = props;

  let pointerTypeRef: PointerType | undefined;
  let didKeyDownRef = false;

  if (!enabled) return {};

  return {
    reference: {
      onPointerDown(event) {
        pointerTypeRef = event.pointerType as PointerType;
      },
      onMouseDown(event) {
        // Ignore all buttons except for the "main" button.
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        if (event.button !== 0) {
          return;
        }

        if (isMouseLikePointerType(pointerTypeRef, true) && ignoreMouse) {
          return;
        }

        if (eventOption === 'click') {
          return;
        }

        if (
          open() &&
          toggle &&
          (dataRef.openEvent ? dataRef.openEvent.type === 'mousedown' : true)
        ) {
          onOpenChange(false, event);
        } else {
          // Prevent stealing focus from the floating element
          event.preventDefault();
          onOpenChange(true, event);
        }
      },
      onClick(event) {
        if (eventOption === 'mousedown' && pointerTypeRef) {
          pointerTypeRef = undefined;
          return;
        }

        if (isMouseLikePointerType(pointerTypeRef, true) && ignoreMouse) {
          return;
        }

        if (
          open() &&
          toggle &&
          (dataRef.openEvent ? dataRef.openEvent.type === 'click' : true)
        ) {
          onOpenChange(false, event);
        } else {
          onOpenChange(true, event);
        }
      },
      onKeyDown(event) {
        pointerTypeRef = undefined;

        if (
          event.defaultPrevented ||
          !keyboardHandlers ||
          isButtonTarget(event)
        ) {
          return;
        }

        if (event.key === ' ' && !isSpaceIgnored(refs.reference() as Element)) {
          // Prevent scrolling
          event.preventDefault();
          didKeyDownRef = true;
        }

        if (event.key === 'Enter') {
          if (open() && toggle) {
            onOpenChange(false, event);
          } else {
            onOpenChange(true, event);
          }
        }
      },
      onKeyUp(event) {
        if (
          event.defaultPrevented ||
          !keyboardHandlers ||
          isButtonTarget(event) ||
          isSpaceIgnored(refs.reference() as Element)
        ) {
          return;
        }

        if (event.key === ' ' && didKeyDownRef) {
          didKeyDownRef = false;
          if (open() && toggle) {
            onOpenChange(false, event);
          } else {
            onOpenChange(true, event);
          }
        }
      },
    },
  };
}
