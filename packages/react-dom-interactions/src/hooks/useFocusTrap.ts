import React, {MutableRefObject, useCallback, useEffect, useRef} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {ElementProps, FloatingContext} from '../types';
import {getDocument} from '../utils/getDocument';
import {isElement, isHTMLElement} from '../utils/is';
import {stopEvent} from '../utils/stopEvent';

const FOCUSABLE_ELEMENT_SELECTOR =
  'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,*[tabindex],*[contenteditable]';

type Order = Array<'reference' | 'floating' | 'content'>;

const DEFAULT_ORDER: Order = ['content'];

export interface Props {
  enabled?: boolean;
  modal?: boolean;
  order?: Order;
  initialContentFocus?: number | MutableRefObject<HTMLElement | null>;
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
 * Traps focus in a loop of focusable elements while the floating element is
 * open.
 * @see https://floating-ui.com/docs/useFocusTrap
 */
export const useFocusTrap = (
  {open, onOpenChange, refs}: FloatingContext,
  {
    enabled = true,
    initialContentFocus = 0,
    order = DEFAULT_ORDER,
    modal = true,
    inert = false,
  }: Props = {}
): ElementProps => {
  const initializedRef = useRef(false);
  const beforeRef = useRef<HTMLElement | null>(null);
  const afterRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef(modal);
  const orderRef = useRef(order);
  useLayoutEffect(() => {
    modalRef.current = modal;
    orderRef.current = order;
  });

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

  const getFocusableElements = useCallback(() => {
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
  useEffect(() => {
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
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const focusableElements = getFocusableElements();

    if (inert) {
      if (open) {
        const first = focusableElements[0];
        if (
          first === refs.floating.current &&
          !first.contains(first.ownerDocument.activeElement)
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
  useEffect(() => {
    if (!enabled) {
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
  }, [open, enabled, refs.reference]);

  // Hide all outside nodes from screen readers
  useEffect(() => {
    if (!open || !modal || !enabled) {
      return;
    }

    const doc = getDocument(refs.floating.current);
    const nodes = doc.querySelectorAll(
      'body > *:not([data-floating-ui-portal]'
    );

    const originalValues: Array<string | null> = [];
    nodes.forEach((node) => {
      const originalValue = node.getAttribute('aria-hidden');
      originalValues.push(originalValue);
      node.setAttribute('aria-hidden', 'true');
    });

    return () => {
      nodes.forEach((node, index) => {
        const originalValue = originalValues[index];
        if (originalValue === null) {
          node.removeAttribute('aria-hidden');
        } else {
          node.setAttribute('aria-hidden', originalValue);
        }
      });
    };
  }, [open, modal, enabled, refs.floating]);

  useEffect(() => {
    initializedRef.current = true;
    return () => {
      initializedRef.current = false;
    };
  }, []);

  function onBlur(event: React.FocusEvent) {
    const target = event.relatedTarget as Element | null;
    if (
      !refs.floating.current?.contains(target) &&
      isElement(refs.reference.current) &&
      !refs.reference.current.contains(target)
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
