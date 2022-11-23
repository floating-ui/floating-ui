import {hideOthers} from 'aria-hidden';
import {FocusableElement, tabbable} from 'tabbable';
import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import {usePortalContext} from './FloatingPortal';
import {useFloatingTree} from './FloatingTree';
import type {FloatingContext, ReferenceType} from './types';
import {activeElement} from './utils/activeElement';
import {FocusGuard} from './utils/FocusGuard';
import {getAncestors} from './utils/getAncestors';
import {getChildren} from './utils/getChildren';
import {getDocument} from './utils/getDocument';
import {getTarget} from './utils/getTarget';
import {isElement, isHTMLElement} from './utils/is';
import {isTypeableElement} from './utils/isTypeableElement';
import {stopEvent} from './utils/stopEvent';
import {useLatestRef} from './utils/useLatestRef';

const getTabbableOptions = () =>
  ({
    getShadowRoot: true,
    displayCheck:
      // JSDOM does not support the `tabbable` library. To solve this we can
      // check if `ResizeObserver` is a real function (not polyfilled), which
      // determines if the current environment is JSDOM-like.
      typeof ResizeObserver === 'function' &&
      ResizeObserver.toString().includes('[native code]')
        ? 'full'
        : 'none',
  } as const);

function focus(el?: FocusableElement | null, preventScroll = false) {
  // Queue the focus to right before paint. Runs after microtasks to wait for
  // the floating element's position to be ready, and prevent focusable buttons
  // from stealing focus as `mousedown` clicks occur before `focus`.
  requestAnimationFrame(() => {
    el?.focus({preventScroll});
  });
}

export interface Props<RT extends ReferenceType = ReferenceType> {
  context: FloatingContext<RT>;
  children: JSX.Element;
  order?: Array<'reference' | 'floating' | 'content'>;
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>;
  guards?: boolean;
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
  guards = true,
  initialFocus = 0,
  returnFocus = true,
  modal = true,
}: Props<RT>): JSX.Element {
  const orderRef = useLatestRef(order);
  const tree = useFloatingTree();
  const portalContext = usePortalContext();

  const didFocusOutRef = React.useRef(false);

  const insidePortal = portalContext != null;

  const getTabbableContent = React.useCallback(
    (container: HTMLElement | null = refs.floating.current) => {
      if (!container) {
        return [];
      }
      return tabbable(container, getTabbableOptions());
    },
    [refs]
  );

  const getTabbableElements = React.useCallback(
    (container: HTMLElement | null = null) => {
      const tabbableContent = getTabbableContent(container);

      let orderArr = orderRef.current;

      // Make the floating element focusable if it has no tabbable content
      // elements. This allows non-modal + portal focus management to work
      // when shift+tabbing to/from the reference element.
      if (tabbableContent.length === 0 && !orderArr.includes('floating')) {
        if (orderArr[0] === 'reference') {
          orderArr = ['reference', 'floating', ...orderArr.slice(1)];
        } else if (orderArr[0] === 'content') {
          orderArr = ['floating', 'content', ...orderArr.slice(1)];
        }
      }

      return orderArr
        .map((type) => {
          if (refs.domReference.current && type === 'reference') {
            return refs.domReference.current;
          }

          if (refs.floating.current && type === 'floating') {
            return refs.floating.current;
          }

          if (tabbableContent) {
            return tabbableContent;
          }
        })
        .filter(Boolean)
        .flat() as Array<FocusableElement>;
    },
    [orderRef, refs, getTabbableContent]
  );

  React.useEffect(() => {
    if (!modal) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        // If the floating element has no focusable elements inside it, fallback
        // to focusing the floating element and preventing tab navigation
        if (getTabbableContent().length === 0) {
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
  }, [modal, orderRef, refs, getTabbableContent]);

  React.useEffect(() => {
    let isPointerDown = false;

    function onFocusOut(event: FocusEvent) {
      didFocusOutRef.current = false;
      const relatedTarget = event.relatedTarget as Element | null;

      if (
        relatedTarget == null ||
        relatedTarget === portalContext?.beforeOutsideRef.current ||
        relatedTarget === portalContext?.afterOutsideRef.current
      ) {
        return;
      }

      if (
        relatedTarget === portalContext?.beforeInsideRef.current ||
        relatedTarget === portalContext?.afterInsideRef.current
      ) {
        didFocusOutRef.current = true;
        return;
      }

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
        !isParentRelated &&
        !isPointerDown
      ) {
        didFocusOutRef.current = true;
        onOpenChange(false);
      }
    }

    function onPointerDown() {
      // In Safari, buttons *lose* focus when pressing them. This causes the
      // reference `focusout` to fire, which closes the floating element.
      isPointerDown = true;
      setTimeout(() => {
        isPointerDown = false;
      });
    }

    const floating = refs.floating.current;
    const reference = refs.domReference.current;

    if (floating && isHTMLElement(reference)) {
      if (!modal) {
        floating.addEventListener('focusout', onFocusOut);
        reference.addEventListener('focusout', onFocusOut);
        reference.addEventListener('pointerdown', onPointerDown);
      }

      let cleanup: () => void;
      if (modal) {
        if (orderRef.current.includes('reference')) {
          cleanup = hideOthers([reference, floating]);
        } else {
          cleanup = hideOthers(floating);
        }
      }

      return () => {
        if (!modal) {
          floating.removeEventListener('focusout', onFocusOut);
          reference.removeEventListener('focusout', onFocusOut);
          reference.removeEventListener('pointerdown', onPointerDown);
        }

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
    portalContext,
  ]);

  React.useEffect(() => {
    const floating = refs.floating.current;
    const doc = getDocument(floating);

    let returnFocusValue = returnFocus;
    let preventReturnFocusScroll = false;
    let previouslyFocusedElement = activeElement(doc);

    if (previouslyFocusedElement === doc.body && refs.domReference.current) {
      previouslyFocusedElement = refs.domReference.current;
    }

    if (typeof initialFocus === 'number') {
      if (initialFocus !== -1) {
        const el = getTabbableElements()[initialFocus] ?? floating;
        focus(el, el === floating);
      }
    } else if (isHTMLElement(initialFocus.current)) {
      const el = initialFocus.current ?? floating;
      focus(el, el === floating);
    }

    // Dismissing via outside press should always ignore `returnFocus` to
    // prevent unwanted scrolling.
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

      if (
        returnFocusValue &&
        isHTMLElement(previouslyFocusedElement) &&
        !didFocusOutRef.current
      ) {
        focus(previouslyFocusedElement, preventReturnFocusScroll);
      }
    };
  }, [getTabbableElements, initialFocus, returnFocus, refs, events]);

  React.useEffect(() => {
    const floating = refs.floating.current;

    if (modal && !guards && floating) {
      const tabIndexValues: Array<string | null> = [];
      const options = getTabbableOptions();
      const allTabbable = tabbable(getDocument(floating).body, options);
      const floatingTabbable = getTabbableElements();

      // Exclude all tabbable elements that are part of the order
      const elements = allTabbable.filter(
        (el) => !floatingTabbable.includes(el)
      );

      elements.forEach((el, i) => {
        tabIndexValues[i] = el.getAttribute('tabindex');
        el.setAttribute('tabindex', '-1');
      });

      return () => {
        elements.forEach((el, i) => {
          const value = tabIndexValues[i];
          if (value == null) {
            el.removeAttribute('tabindex');
          } else {
            el.setAttribute('tabindex', value);
          }
        });
      };
    }
  }, [modal, guards, refs]);

  // Synchronize the `modal` value to the FloatingPortal context. It will
  // decide whether or not it needs to render its own guards.
  useLayoutEffect(() => {
    portalContext?.setModal(modal);
  }, [portalContext, modal]);

  React.useImperativeHandle(portalContext?.managerRef, () => ({
    handleBeforeOutside() {
      const els = getTabbableElements().filter(
        (el) => el !== refs.domReference.current
      );
      focus(els[0]);
    },
    handleAfterOutside() {
      const els = getTabbableElements().filter(
        (el) => el !== refs.domReference.current
      );
      focus(els[els.length - 1]);
    },
  }));

  const isTypeableCombobox = () =>
    refs.domReference.current?.getAttribute('role') === 'combobox' &&
    isTypeableElement(refs.domReference.current);

  const renderGuards = guards && (insidePortal || modal);

  return (
    <>
      {renderGuards && (
        <FocusGuard
          ref={portalContext?.beforeInsideRef}
          onFocus={(event) => {
            if (isTypeableCombobox()) {
              return;
            }

            stopEvent(event);

            if (modal) {
              const els = getTabbableElements();
              if (order[0] === 'reference') {
                focus(els[0]);
              } else {
                focus(els[els.length - 1]);
              }
            } else if (portalContext?.preserveTabOrder) {
              const els = getTabbableElements(
                getDocument(refs.floating.current).body
              );
              if (portalContext.beforeOutsideRef.current) {
                const index = els.indexOf(
                  portalContext.beforeOutsideRef.current
                );
                const prevTabbable = els[index - 1];
                focus(prevTabbable);
                if (prevTabbable !== refs.domReference.current) {
                  onOpenChange(false);
                }
              }
            }
          }}
        />
      )}
      {React.cloneElement(
        children,
        order.includes('floating') ? {tabIndex: 0} : {}
      )}
      {renderGuards && (
        <FocusGuard
          ref={portalContext?.afterInsideRef}
          onFocus={(event) => {
            if (isTypeableCombobox()) {
              return;
            }

            stopEvent(event);

            if (modal) {
              focus(getTabbableElements()[0]);
            } else if (portalContext?.preserveTabOrder) {
              const els = getTabbableElements(
                getDocument(refs.floating.current).body
              );
              if (portalContext.afterOutsideRef.current) {
                const index = els.indexOf(
                  portalContext.afterOutsideRef.current
                );
                const nextTabbable = els[index + 1];
                focus(nextTabbable);
                if (nextTabbable !== refs.domReference.current) {
                  onOpenChange(false);
                }
              }
            }
          }}
        />
      )}
    </>
  );
}
