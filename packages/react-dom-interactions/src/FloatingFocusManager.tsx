import {hideOthers} from 'aria-hidden';
import * as React from 'react';
import {useFloatingTree} from './FloatingTree';
import type {FloatingContext, ReferenceType} from './types';
import {activeElement} from './utils/activeElement';
import {getAncestors} from './utils/getAncestors';
import {getChildren} from './utils/getChildren';
import {getDocument} from './utils/getDocument';
import {getTarget} from './utils/getTarget';
import {isElement, isHTMLElement} from './utils/is';
import {isTypeableElement, TYPEABLE_SELECTOR} from './utils/isTypeableElement';
import {stopEvent} from './utils/stopEvent';
import {useLatestRef} from './utils/useLatestRef';

function focus(el: HTMLElement | undefined, preventScroll = false) {
  // `pointerDown` clicks occur before `focus`, so the button will steal the
  // focus unless we wait a frame.
  requestAnimationFrame(() => {
    el?.focus({preventScroll});
  });
}

const SELECTOR =
  'select:not([disabled]),a[href],button:not([disabled]),[tabindex],' +
  'iframe,object,embed,area[href],audio[controls],video[controls],' +
  TYPEABLE_SELECTOR;

const FocusGuard = React.forwardRef<
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

export interface Props<RT extends ReferenceType = ReferenceType> {
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
  context: {refs, nodeId, onOpenChange, dataRef, events},
  children,
  order = ['content'],
  endGuard = true,
  preventTabbing = false,
  initialFocus = 0,
  returnFocus = true,
  modal = true,
}: Props<RT>): JSX.Element {
  const orderRef = useLatestRef(order);
  const tree = useFloatingTree();

  const root =
    tree?.nodesRef.current.find((node) => node.id === nodeId)?.parentId == null;

  const getTabbableElements = React.useCallback(() => {
    return orderRef.current
      .map((type) => {
        if (type === 'reference') {
          return refs.domReference.current;
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
        if (el === refs.floating.current || el === refs.domReference.current) {
          return true;
        }

        if (isHTMLElement(el)) {
          const tabIndex = el.getAttribute('tabindex') ?? '0';
          return tabIndex[0].trim() !== '-';
        }
      }) as Array<HTMLElement>;
  }, [orderRef, refs]);

  React.useEffect(() => {
    if (!modal) {
      return;
    }

    // If the floating element has no focusable elements inside it, fallback
    // to focusing the floating element and preventing tab navigation
    const noTabbableContentElements =
      getTabbableElements().filter(
        (el) => el !== refs.floating.current && el !== refs.domReference.current
      ).length === 0;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        if (preventTabbing || noTabbableContentElements) {
          stopEvent(event);
        }

        const els = getTabbableElements();
        const target = getTarget(event);

        if (
          orderRef.current[0] === 'reference' &&
          target === refs.domReference.current
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
          target === refs.floating.current &&
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
  }, [preventTabbing, modal, getTabbableElements, orderRef, refs]);

  React.useEffect(() => {
    function onFocusOut(event: FocusEvent) {
      const relatedTarget = event.relatedTarget as Element | null;

      const focusMovedOutsideFloating =
        !refs.floating.current?.contains(relatedTarget);

      const focusMovedOutsideReference =
        isElement(refs.domReference.current) &&
        !refs.domReference.current.contains(relatedTarget);

      const isChildOpen =
        tree && getChildren(tree.nodesRef.current, nodeId).length > 0;

      const isParentRelated =
        tree &&
        event.currentTarget === refs.domReference.current &&
        getAncestors(tree.nodesRef.current, nodeId)?.some((node) =>
          node.context?.refs.floating.current?.contains(relatedTarget)
        );

      if (
        focusMovedOutsideFloating &&
        focusMovedOutsideReference &&
        !isChildOpen &&
        !isParentRelated
      ) {
        onOpenChange(false);
      }
    }

    const floating = refs.floating.current;
    const reference = refs.domReference.current;

    if (floating && isHTMLElement(reference)) {
      !modal && floating.addEventListener('focusout', onFocusOut);
      !modal && reference.addEventListener('focusout', onFocusOut);

      let cleanup: () => void;
      if (modal) {
        if (orderRef.current.includes('reference')) {
          cleanup = hideOthers([reference, floating]);
        } else {
          cleanup = hideOthers(floating);
        }
      }

      return () => {
        !modal && floating.removeEventListener('focusout', onFocusOut);
        !modal && reference.removeEventListener('focusout', onFocusOut);
        cleanup?.();
      };
    }
  }, [
    nodeId,
    tree,
    modal,
    onOpenChange,
    orderRef,
    dataRef,
    getTabbableElements,
    refs,
  ]);

  React.useEffect(() => {
    // Retain `returnFocus` behavior for root nodes
    if (preventTabbing && !root) {
      return;
    }

    const floating = refs.floating.current;
    const doc = getDocument(floating);

    let returnFocusValue = returnFocus;
    let preventReturnFocusScroll = false;
    let previouslyFocusedElement = activeElement(doc);

    if (previouslyFocusedElement === doc.body && refs.domReference.current) {
      previouslyFocusedElement = refs.domReference.current;
    }

    if (!preventTabbing) {
      if (typeof initialFocus === 'number') {
        const el = getTabbableElements()[initialFocus] ?? floating;
        focus(el, el === floating);
      } else if (isHTMLElement(initialFocus.current)) {
        const el = initialFocus.current ?? floating;
        focus(el, el === floating);
      }
    }

    // Dismissing via outside `pointerdown` should always ignore `returnFocus`
    // to prevent unwanted scrolling.
    function onDismiss(
      allowReturnFocus: boolean | {preventScroll: boolean} = false
    ) {
      if (typeof allowReturnFocus === 'object') {
        returnFocusValue = true;
        preventReturnFocusScroll = allowReturnFocus.preventScroll;
      } else {
        returnFocusValue = allowReturnFocus;
      }
    }

    events.on('dismiss', onDismiss);

    return () => {
      events.off('dismiss', onDismiss);

      if (returnFocusValue && isHTMLElement(previouslyFocusedElement)) {
        focus(previouslyFocusedElement, preventReturnFocusScroll);
      }
    };
  }, [
    preventTabbing,
    getTabbableElements,
    initialFocus,
    returnFocus,
    refs,
    events,
    root,
  ]);

  const isTypeableCombobox = () =>
    refs.domReference.current?.getAttribute('role') === 'combobox' &&
    isTypeableElement(refs.domReference.current);

  return (
    <>
      {modal && (
        <FocusGuard
          onFocus={(event) => {
            if (isTypeableCombobox()) {
              return;
            }

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
      {React.cloneElement(
        children,
        order.includes('floating') ? {tabIndex: 0} : {}
      )}
      {modal && endGuard && (
        <FocusGuard
          onFocus={(event) => {
            if (isTypeableCombobox()) {
              return;
            }

            stopEvent(event);
            focus(getTabbableElements()[0]);
          }}
        />
      )}
    </>
  );
}
