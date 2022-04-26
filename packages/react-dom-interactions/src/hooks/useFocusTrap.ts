import * as React from 'react';
import {hideOthers} from 'aria-hidden';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {getDocument} from '../utils/getDocument';
import {isElement, isHTMLElement} from '../utils/is';
import {stopEvent} from '../utils/stopEvent';
import {useLatestRef} from '../utils/useLatestRef';
import {useFloatingTree} from '../FloatingTree';
import {getChildren} from '../utils/getChildren';
import {activeElement} from '../utils/activeElement';

const FOCUSABLE_ELEMENT_SELECTOR =
  'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,*[tabindex],*[contenteditable]';

type Order = Array<'reference' | 'floating' | 'content'>;

const DEFAULT_ORDER: Order = ['content'];

export interface Props {
  enabled?: boolean;
  modal?: boolean;
  order?: Order;
  initialContentFocus?: number | React.MutableRefObject<HTMLElement | null>;
  inert?: boolean;
}

// When working with nested elements, we need to let the rendering occur before
// attempting focus. This fixes unwanted scrolling to the bottom of the document
function focus(el: HTMLElement | undefined) {
  requestAnimationFrame(() => {
    el?.focus();
  });
}

/**
 * @deprecated Use `<FloatingFocusManager />` instead.
 */
export const useFocusTrap = <RT extends ReferenceType = ReferenceType>(
  {open, onOpenChange, refs, nodeId}: FloatingContext<RT>,
  {
    enabled = true,
    initialContentFocus = 0,
    order = DEFAULT_ORDER,
    modal = true,
    inert = false,
  }: Props = {}
): ElementProps => {
  const initializedRef = React.useRef(false);
  const beforeRef = React.useRef<HTMLElement | null>(null);
  const afterRef = React.useRef<HTMLElement | null>(null);
  const modalRef = useLatestRef(modal);
  const orderRef = useLatestRef(order);

  if (__DEV__) {
    if (modal && order.includes('reference')) {
      console.warn(
        [
          'Floating UI: useFocusTrap() `order` array cannot contain',
          '"reference" while in `modal` mode.',
        ].join(' ')
      );
    }
  }

  const getFocusableElements = React.useCallback(() => {
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
            refs.floating.current?.querySelectorAll(
              FOCUSABLE_ELEMENT_SELECTOR
            ) ?? []
          );
        }

        return null;
      })
      .filter(Boolean)
      .flat() as Array<HTMLElement>;
    // Ignore `order` dep; only respond to changes on `open`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs.floating, refs.reference]);

  // Focus guard elements
  // https://github.com/w3c/aria-practices/issues/545
  useLayoutEffect(() => {
    const floating = refs.floating.current;

    if (!enabled || !open || !floating || !modal) {
      return;
    }

    function createFocusGuardElement() {
      const doc = getDocument(floating);
      const el = doc.createElement('div');
      el.tabIndex = 0;
      Object.assign(el.style, {
        position: 'fixed',
        outline: '0',
        pointerEvents: 'none',
      });
      el.setAttribute('aria-hidden', 'true');
      return el;
    }

    if (!beforeRef.current) {
      beforeRef.current = createFocusGuardElement();
    }

    if (!afterRef.current) {
      afterRef.current = createFocusGuardElement();
    }

    const before = beforeRef.current;
    const after = afterRef.current;

    floating.insertAdjacentElement('beforebegin', before);
    floating.insertAdjacentElement('afterend', after);

    function onFocus(event: FocusEvent) {
      stopEvent(event);
      const focusableElements = getFocusableElements();
      focusableElements[
        event.target === after ? 0 : focusableElements.length - 1
      ]?.focus();
    }

    before.addEventListener('focus', onFocus);
    after.addEventListener('focus', onFocus);

    return () => {
      before.removeEventListener('focus', onFocus);
      after.removeEventListener('focus', onFocus);

      if (before.parentNode?.contains(before)) {
        before.parentNode.removeChild(before);
      }

      if (after.parentNode?.contains(after)) {
        after.parentNode.removeChild(after);
      }
    };
  }, [enabled, open, modal, inert, getFocusableElements, refs.floating]);

  // Inert
  React.useEffect(() => {
    if (!enabled || !open || !inert) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        stopEvent(event);
      }
    }

    const doc = getDocument(refs.floating.current);
    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled, open, inert, refs.floating]);

  // Initial focus
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const focusableElements = getFocusableElements();

    if (inert) {
      if (open) {
        const first = focusableElements[0];
        if (
          first === refs.floating.current &&
          !first.contains(activeElement(first.ownerDocument))
        ) {
          focus(first);
        }
      }

      return;
    }

    if (open) {
      if (typeof initialContentFocus === 'number') {
        focus(focusableElements[initialContentFocus]);
      } else if (initialContentFocus.current) {
        focus(
          focusableElements.find(
            (element) => element === initialContentFocus.current
          )
        );
      }
    }
  }, [
    getFocusableElements,
    open,
    inert,
    modal,
    initialContentFocus,
    enabled,
    refs.reference,
    refs.floating,
  ]);

  // Return focus to reference
  React.useEffect(() => {
    if (!enabled || inert) {
      return;
    }

    if (
      !open &&
      modalRef.current &&
      initializedRef.current &&
      isHTMLElement(refs.reference.current)
    ) {
      focus(refs.reference.current);
    }
  }, [open, enabled, inert, modalRef, refs.reference]);

  // Hide all outside nodes from screen readers
  React.useEffect(() => {
    if (!open || !modal || !enabled || !refs.floating.current) {
      return;
    }

    return hideOthers(refs.floating.current);
  }, [open, modal, enabled, refs.floating]);

  React.useEffect(() => {
    initializedRef.current = true;
    return () => {
      initializedRef.current = false;
    };
  }, []);

  const tree = useFloatingTree();

  function onBlur(event: React.FocusEvent) {
    const target = event.relatedTarget as Element | null;
    if (
      !refs.floating.current?.contains(target) &&
      isElement(refs.reference.current) &&
      !refs.reference.current.contains(target) &&
      !(
        tree &&
        getChildren(tree, nodeId).some((child) =>
          child.context?.refs.floating?.current?.contains(target)
        )
      )
    ) {
      onOpenChange(false);
    }
  }

  if (!enabled) {
    return {};
  }

  if (modal) {
    return {
      floating: {
        'aria-modal': 'true',
      },
    };
  }

  return {
    reference: {onBlur},
    floating: {onBlur},
  };
};
