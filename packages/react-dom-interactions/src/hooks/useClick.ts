import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import * as React from 'react';
import {isTypeableElement} from '../utils/isTypeableElement';
import {isHTMLElement} from '../utils/is';

function isButtonTarget(event: React.KeyboardEvent<Element>) {
  return isHTMLElement(event.target) && event.target.tagName === 'BUTTON';
}

export interface Props {
  enabled?: boolean;
  pointerDown?: boolean;
  toggle?: boolean;
  ignoreMouse?: boolean;
  keyboardHandlers?: boolean;
}

/**
 * Adds click event listeners that change the open state.
 * @see https://floating-ui.com/docs/useClick
 */
export const useClick = <RT extends ReferenceType = ReferenceType>(
  {open, onOpenChange, dataRef, refs}: FloatingContext<RT>,
  {
    enabled = true,
    pointerDown = false,
    toggle = true,
    ignoreMouse = false,
    keyboardHandlers = true,
  }: Props = {}
): ElementProps => {
  const pointerTypeRef = React.useRef<'mouse' | 'pen' | 'touch'>();

  function isSpaceIgnored() {
    return isTypeableElement(refs.domReference.current);
  }

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      onPointerDown(event) {
        pointerTypeRef.current = event.pointerType;
      },
      onMouseDown(event) {
        // Ignore all buttons except for the "main" button.
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        if (event.button !== 0) {
          return;
        }

        if (pointerTypeRef.current === 'mouse' && ignoreMouse) {
          return;
        }

        if (!pointerDown) {
          return;
        }

        if (open) {
          if (
            toggle &&
            (dataRef.current.openEvent
              ? dataRef.current.openEvent.type === 'mousedown'
              : true)
          ) {
            onOpenChange(false);
          }
        } else {
          onOpenChange(true);
        }

        dataRef.current.openEvent = event.nativeEvent;
      },
      onClick(event) {
        if (pointerDown && pointerTypeRef.current) {
          pointerTypeRef.current = undefined;
          return;
        }

        if (pointerTypeRef.current === 'mouse' && ignoreMouse) {
          return;
        }

        if (open) {
          if (
            toggle &&
            (dataRef.current.openEvent
              ? dataRef.current.openEvent.type === 'click'
              : true)
          ) {
            onOpenChange(false);
          }
        } else {
          onOpenChange(true);
        }

        dataRef.current.openEvent = event.nativeEvent;
      },
      onKeyDown(event) {
        pointerTypeRef.current = undefined;

        if (!keyboardHandlers) {
          return;
        }

        if (isButtonTarget(event)) {
          return;
        }

        if (event.key === ' ' && !isSpaceIgnored()) {
          // Prvent scrolling
          event.preventDefault();
        }

        if (event.key === 'Enter') {
          if (open) {
            if (toggle) {
              onOpenChange(false);
            }
          } else {
            onOpenChange(true);
          }
        }
      },
      onKeyUp(event) {
        if (!keyboardHandlers) {
          return;
        }

        if (isButtonTarget(event) || isSpaceIgnored()) {
          return;
        }

        if (event.key === ' ') {
          if (open) {
            if (toggle) {
              onOpenChange(false);
            }
          } else {
            onOpenChange(true);
          }
        }
      },
    },
  };
};
