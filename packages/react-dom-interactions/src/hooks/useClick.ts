import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import * as React from 'react';
import {isHTMLElement} from '../utils/is';

export interface Props {
  enabled?: boolean;
  pointerDown?: boolean;
  toggle?: boolean;
  ignoreMouse?: boolean;
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
  }: Props = {}
): ElementProps => {
  const pointerTypeRef = React.useRef<'mouse' | 'pen' | 'touch'>();

  function isButton() {
    return (
      isHTMLElement(refs.reference.current) &&
      refs.reference.current.tagName === 'BUTTON'
    );
  }

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      onPointerDown(event) {
        pointerTypeRef.current = event.pointerType;

        if (pointerTypeRef.current === 'mouse' && ignoreMouse) {
          return;
        }

        if (!pointerDown) {
          return;
        }

        if (open) {
          if (toggle && dataRef.current.openEvent?.type === 'pointerdown') {
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
          if (toggle && dataRef.current.openEvent?.type === 'click') {
            onOpenChange(false);
          }
        } else {
          onOpenChange(true);
        }

        dataRef.current.openEvent = event.nativeEvent;
      },
      onKeyDown(event) {
        pointerTypeRef.current = undefined;

        if (isButton()) {
          return;
        }

        if (event.key === ' ') {
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
        if (isButton()) {
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
