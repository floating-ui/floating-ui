import {hideOthers} from 'aria-hidden';
import React, {useCallback, useEffect, forwardRef, cloneElement} from 'react';
import {ReferenceType} from '.';
import {useFloatingTree} from './FloatingTree';
import type {FloatingContext} from './types';
import {getChildren} from './utils/getChildren';
import {getDocument} from './utils/getDocument';
import {isElement, isHTMLElement} from './utils/is';
import {stopEvent} from './utils/stopEvent';
import {useLatestRef} from './utils/useLatestRef';

function focus(el: HTMLElement | undefined) {
  requestAnimationFrame(() => {
    el?.focus();
  });
}

const SELECTOR =
  "input:not([type='hidden']):not([disabled]),select:not([disabled])," +
  'textarea:not([disabled]),a[href],button:not([disabled]),[tabindex],' +
  'iframe,object,embed,area[href],audio[controls],video[controls],' +
  "[contenteditable]:not([contenteditable='false'])";

const FocusGuard = forwardRef<
  HTMLSpanElement,
  React.HTMLProps<HTMLSpanElement>
>(function FocusGuard(props, ref) {
  return (
    <span
      {...props}
      ref={ref}
      tabIndex={0}
      style={{
        position: 'fixed',
        opacity: '0',
        pointerEvents: 'none',
        outline: '0',
      }}
    />
  );
});

interface Props<RT extends ReferenceType = ReferenceType> {
  context: FloatingContext<RT>;
  children: JSX.Element;
  order?: Array<'reference' | 'floating' | 'content'>;
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>;
  preventTabbing?: boolean;
  endGuard?: boolean;
  returnFocus?: boolean;
  modal?: boolean;
}

/**
 * Provides focus management for the floating element.
 * @see https://floating-ui.com/docs/FloatingFocusManager
 */
export function FloatingFocusManager<RT extends ReferenceType = ReferenceType>({
  context: {refs, nodeId, onOpenChange},
  children,
  order = ['content'],
  endGuard = true,
  preventTabbing = false,
  initialFocus = 0,
  returnFocus = true,
  modal = true,
}: Props<RT>) {
  const orderRef = useLatestRef(order);
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const tree = useFloatingTree();

  const getTabbableElements = useCallback(() => {
    return orderRef.current
      .map((type) => {
        if (isHTMLElement(refs.reference.current) && type === 'reference') {
          return refs.reference.current;
        }

        if (refs.floating.current && type === 'floating') {
          return refs.floating.current;
        }

        if (type === 'content') {
          return Array.from(
            refs.floating.current?.querySelectorAll(SELECTOR) ?? []
          );
        }

        return null;
      })
      .flat()
      .filter((el) => {
        if (el === refs.floating.current || el === refs.reference.current) {
          return true;
        }

        if (isHTMLElement(el)) {
          const tabIndex = el.getAttribute('tabindex') ?? '0';
          return tabIndex[0].trim() !== '-';
        }
      }) as Array<HTMLElement>;
  }, [orderRef, refs.floating, refs.reference]);

  useEffect(() => {
    // If the floating element has no focusable elements inside it, fallback
    // to focusing the floating element and preventing tab navigation
    const noTabbableContentElements =
      getTabbableElements().filter(
        (el) =>
          el !== refs.floating.current &&
          // @ts-expect-error
          el !== refs.reference.current
      ).length === 0;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        if (preventTabbing || noTabbableContentElements) {
          stopEvent(event);
        }

        const els = getTabbableElements();

        if (
          orderRef.current[0] === 'reference' &&
          event.target === refs.reference.current
        ) {
          stopEvent(event);
          if (event.shiftKey) {
            focus(els[els.length - 1]);
          } else {
            focus(els[1]);
          }
        }

        if (
          orderRef.current[1] === 'floating' &&
          event.target === refs.floating.current &&
          event.shiftKey
        ) {
          stopEvent(event);
          focus(els[0]);
        }
      }
    }

    const doc = getDocument(refs.floating.current);
    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [
    preventTabbing,
    getTabbableElements,
    orderRef,
    refs.floating,
    refs.reference,
  ]);

  useEffect(() => {
    function onFloatingFocusOut(event: FocusEvent) {
      const target = event.relatedTarget as Element | null;
      if (
        !refs.floating.current?.contains(target) &&
        isElement(refs.reference.current) &&
        !refs.reference.current.contains(target) &&
        !(
          tree &&
          getChildren(tree, nodeId).some((child) =>
            child.context?.refs.floating.current?.contains(target)
          )
        )
      ) {
        onOpenChangeRef.current(false);
      }
    }

    const floating = refs.floating.current;
    const reference = refs.reference.current;

    if (floating && isHTMLElement(reference)) {
      !modal && floating.addEventListener('focusout', onFloatingFocusOut);
      const cleanup = modal ? hideOthers(floating) : null;

      return () => {
        !modal && floating.removeEventListener('focusout', onFloatingFocusOut);
        cleanup?.();
      };
    }
  }, [
    nodeId,
    tree,
    modal,
    onOpenChangeRef,
    getTabbableElements,
    initialFocus,
    refs.floating,
    refs.reference,
  ]);

  useEffect(() => {
    if (preventTabbing) {
      return;
    }

    const floating = refs.floating.current;

    const previouslyFocusedElement =
      getDocument(floating).activeElement ?? document.activeElement;

    if (typeof initialFocus === 'number') {
      focus(getTabbableElements()[initialFocus] ?? floating);
    } else if (isHTMLElement(initialFocus?.current)) {
      focus(initialFocus.current ?? floating);
    }

    return () => {
      if (returnFocus && isHTMLElement(previouslyFocusedElement)) {
        focus(previouslyFocusedElement);
      }
    };
  }, [
    preventTabbing,
    getTabbableElements,
    initialFocus,
    modal,
    returnFocus,
    refs.floating,
  ]);

  return (
    <>
      {modal && (
        <FocusGuard
          onFocus={(event) => {
            stopEvent(event);
            const els = getTabbableElements();
            if (order[0] === 'reference') {
              focus(els[0]);
            } else {
              focus(els[els.length - 1]);
            }
          }}
        />
      )}
      {cloneElement(children, order.includes('floating') ? {tabIndex: 0} : {})}
      {modal && endGuard && (
        <FocusGuard
          onFocus={(event) => {
            stopEvent(event);
            focus(getTabbableElements()[0]);
          }}
        />
      )}
    </>
  );
}
