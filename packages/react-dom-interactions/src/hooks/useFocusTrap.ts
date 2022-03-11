import React, {MutableRefObject, useCallback, useEffect, useRef} from 'react';
import {useFloatingPortalId} from '../FloatingPortal';
import {useFloatingTree} from '../FloatingTree';
import type {ElementProps, FloatingContext} from '../types';
import {getDocument} from '../utils/getDocument';
import {isElement, isHTMLElement} from '../utils/is';
import {stopEvent} from '../utils/stopEvent';

const FOCUSABLE_ELEMENT_SELECTOR =
  'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),iframe,object,embed,*[tabindex],*[contenteditable]';

export interface Props {
  enabled?: boolean;
  modal?: boolean;
  order?: Array<'reference' | 'floating' | 'content'>;
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
  {open, onOpenChange, refs, nodeId}: FloatingContext,
  {
    enabled = true,
    initialContentFocus = 0,
    order = ['content'],
    modal = true,
    inert = false,
  }: Props = {}
): ElementProps => {
  const portalId = useFloatingPortalId();
  const tree = useFloatingTree();
  const indexRef = useRef(0);

  const getFocusableElements = useCallback(() => {
    return order
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
  }, [refs.floating, refs.reference, order]);

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
    } else if (modal && isHTMLElement(refs.reference.current)) {
      focus(refs.reference.current);
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

  useEffect(() => {
    if (!modal || !enabled) {
      return;
    }

    const doc = getDocument(refs.floating.current);

    if (!open) {
      doc.removeEventListener('keydown', onKeyDown);
      indexRef.current = 0;
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (
        tree?.nodesRef.current
          ?.filter(({parentId}) => parentId === nodeId)
          .some(({context}) => context?.open)
      ) {
        return;
      }

      if (event.key === 'Tab') {
        stopEvent(event);

        const focusableElements = getFocusableElements();

        if (inert) {
          return;
        }

        if (event.shiftKey) {
          indexRef.current =
            indexRef.current === 0
              ? focusableElements.length - 1
              : indexRef.current - 1;
        } else {
          indexRef.current =
            indexRef.current === focusableElements.length - 1
              ? 0
              : indexRef.current + 1;
        }

        focus(focusableElements[indexRef.current]);
      }
    }

    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [
    getFocusableElements,
    tree?.nodesRef,
    nodeId,
    open,
    modal,
    inert,
    enabled,
    refs.floating,
  ]);

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

  useEffect(() => {
    if (!open || !modal || !enabled) {
      return;
    }

    const doc = getDocument(refs.floating.current);
    const portal = doc.querySelector(`#${portalId}`);
    const nodes = doc.querySelectorAll(`body > *:not(#${portalId})`);

    const originalValues: Array<string | null> = [];
    nodes.forEach((node) => {
      const originalValue = node.getAttribute('aria-hidden');
      originalValues.push(originalValue);
      node.setAttribute('aria-hidden', 'hidden');
    });

    return () => {
      if (portal?.firstElementChild === refs.floating.current) {
        nodes.forEach((node, index) => {
          const originalValue = originalValues[index];
          if (originalValue === null) {
            node.removeAttribute('aria-hidden');
          } else {
            node.setAttribute('aria-hidden', originalValue);
          }
        });
      }
    };
  }, [open, modal, portalId, enabled, refs.floating]);

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
