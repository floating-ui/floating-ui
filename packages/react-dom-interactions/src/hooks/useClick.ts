import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {useRef} from 'react';

export interface Props {
  enabled?: boolean;
  pointerDown?: boolean;
}

/**
 * Adds click event listeners that change the open state (toggle behavior).
 * @see https://floating-ui.com/docs/useClick
 */
export const useClick = <RT extends ReferenceType = ReferenceType>(
  {open, onOpenChange, dataRef}: FloatingContext<RT>,
  {enabled = true, pointerDown = false}: Props = {}
): ElementProps => {
  const pointerTypeRef = useRef<'mouse' | 'pen' | 'touch'>();

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      ...(pointerDown && {
        onPointerDown(event) {
          pointerTypeRef.current = event.pointerType;

          if (open) {
            if (dataRef.current.openEvent?.type === 'pointerdown') {
              onOpenChange(false);
            }
          } else {
            onOpenChange(true);
          }

          dataRef.current.openEvent = event.nativeEvent;
        },
      }),
      onClick(event) {
        if (pointerDown && pointerTypeRef.current) {
          pointerTypeRef.current = undefined;
          return;
        }

        if (open) {
          if (dataRef.current.openEvent?.type === 'click') {
            onOpenChange(false);
          }
        } else {
          onOpenChange(true);
        }

        dataRef.current.openEvent = event.nativeEvent;
      },
    },
  };
};
