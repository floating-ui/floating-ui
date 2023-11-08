import {isHTMLElement} from '@floating-ui/utils/dom';
import {MaybeAccessor} from '@solid-primitives/utils';
import {Accessor, mergeProps} from 'solid-js';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {isMouseLikePointerType, isTypeableElement} from '../utils';
import {destructure} from '../utils/destructure';

function isButtonTarget(event: KeyboardEvent) {
  return isHTMLElement(event.target) && event.target.tagName === 'BUTTON';
}

function isSpaceIgnored(element: Element | null) {
  return isTypeableElement(element);
}

export interface UseClickProps {
  enabled?: MaybeAccessor<boolean>;
  event?: MaybeAccessor<'click' | 'mousedown'>;
  toggle?: MaybeAccessor<boolean>;
  ignoreMouse?: MaybeAccessor<boolean>;
  keyboardHandlers?: MaybeAccessor<boolean>;
}
type PointerType = 'mouse' | 'pen' | 'touch';
/**
 * Opens or closes the floating element when clicking the reference element.
 * @see https://floating-ui.com/docs/useClick
 */
export function useClick<RT extends ReferenceType = ReferenceType>(
  context: Accessor<FloatingContext<RT>>,
  props: UseClickProps = {},
): Accessor<ElementProps> {
  const {open, onOpenChange, refs} = context();
  const mergedProps = mergeProps(
    {
      enabled: true,
      event: 'click',
      toggle: true,
      ignoreMouse: false,
      keyboardHandlers: true,
    },
    props,
  );
  const {
    enabled,
    toggle,
    ignoreMouse,
    keyboardHandlers,
    event: eventOption,
  } = destructure(mergedProps, {normalize: true});

  let pointerTypeRef: PointerType | undefined;
  let didKeyDownRef = false;

  return () =>
    !enabled()
      ? {}
      : {
          reference: {
            onPointerDown(event) {
              pointerTypeRef = event.pointerType as PointerType;
            },
            onMouseDown(event) {
              const {dataRef} = context();
              // Ignore all buttons except for the "main" button.
              // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
              if (event.button !== 0) {
                return;
              }

              if (
                isMouseLikePointerType(pointerTypeRef, true) &&
                ignoreMouse()
              ) {
                return;
              }

              if (eventOption() === 'click') {
                return;
              }

              if (
                open() &&
                toggle() &&
                (dataRef.openEvent
                  ? dataRef.openEvent.type === 'mousedown'
                  : true)
              ) {
                onOpenChange(false, event);
              } else {
                // Prevent stealing focus from the floating element
                event.preventDefault();
                onOpenChange(true, event);
              }
            },
            onClick(event) {
              if (eventOption() === 'mousedown' && pointerTypeRef) {
                pointerTypeRef = undefined;
                return;
              }

              if (
                isMouseLikePointerType(pointerTypeRef, true) &&
                ignoreMouse()
              ) {
                return;
              }
              const {dataRef} = context();
              if (
                open() &&
                toggle() &&
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

              if (
                event.key === ' ' &&
                !isSpaceIgnored(refs.reference() as Element)
              ) {
                // Prevent scrolling
                event.preventDefault();
                didKeyDownRef = true;
              }

              if (event.key === 'Enter') {
                if (open() && toggle()) {
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
                if (open() && toggle()) {
                  onOpenChange(false, event);
                } else {
                  onOpenChange(true, event);
                }
              }
            },
          },
        };
}
