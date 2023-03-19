import {hideOthers} from 'aria-hidden';
import * as React from 'react';
import {FocusableElement, tabbable} from 'tabbable';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {DismissPayload} from '../hooks/useDismiss';
import {useLatestRef} from '../hooks/utils/useLatestRef';
import type {FloatingContext, ReferenceType} from '../types';
import {activeElement} from '../utils/activeElement';
import {contains} from '../utils/contains';
import {enqueueFocus} from '../utils/enqueueFocus';
import {getAncestors} from '../utils/getAncestors';
import {getChildren} from '../utils/getChildren';
import {getDocument} from '../utils/getDocument';
import {getTarget} from '../utils/getTarget';
import {isHTMLElement} from '../utils/is';
import {isTypeableElement} from '../utils/isTypeableElement';
import {stopEvent} from '../utils/stopEvent';
import {
  getNextTabbable,
  getPreviousTabbable,
  getTabbableOptions,
  isOutsideEvent,
} from '../utils/tabbable';
import {usePortalContext} from './FloatingPortal';
import {useFloatingTree} from './FloatingTree';
import {FocusGuard, HIDDEN_STYLES} from './FocusGuard';

const VisuallyHiddenDismiss = React.forwardRef(function VisuallyHiddenDismiss(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      type="button"
      ref={ref}
      tabIndex={-1}
      style={HIDDEN_STYLES}
    />
  );
});

export interface Props<RT extends ReferenceType = ReferenceType> {
  context: FloatingContext<RT>;
  children: JSX.Element;
  order?: Array<'reference' | 'floating' | 'content'>;
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>;
  guards?: boolean;
  returnFocus?: boolean;
  modal?: boolean;
  visuallyHiddenDismiss?: boolean | string;
  closeOnFocusOut?: boolean;
}

/**
 * Provides focus management for the floating element.
 * @see https://floating-ui.com/docs/FloatingFocusManager
 */
export function FloatingFocusManager<RT extends ReferenceType = ReferenceType>({
  context,
  children,
  order = ['content'],
  guards = true,
  initialFocus = 0,
  returnFocus = true,
  modal = true,
  visuallyHiddenDismiss = false,
  closeOnFocusOut = true,
}: Props<RT>): JSX.Element {
  const {
    open,
    refs,
    nodeId,
    onOpenChange,
    events,
    dataRef,
    elements: {domReference, floating},
  } = context;

  const orderRef = useLatestRef(order);
  const initialFocusRef = useLatestRef(initialFocus);
  const returnFocusRef = useLatestRef(returnFocus);

  const tree = useFloatingTree();
  const portalContext = usePortalContext();
  const [tabbableContentLength, setTabbableContentLength] = React.useState<
    number | null
  >(null);

  // Controlled by `useListNavigation`.
  const ignoreInitialFocus =
    typeof initialFocus === 'number' && initialFocus < 0;

  const startDismissButtonRef = React.useRef<HTMLButtonElement>(null);
  const endDismissButtonRef = React.useRef<HTMLButtonElement>(null);
  const preventReturnFocusRef = React.useRef(false);
  const previouslyFocusedElementRef = React.useRef<Element | null>(null);
  const isPointerDownRef = React.useRef(false);

  const isInsidePortal = portalContext != null;

  // If the reference is a combobox and is typeable (e.g. input/textarea),
  // there are different focus semantics. The guards should not be rendered, but
  // aria-hidden should be applied to all nodes still. Further, the visually
  // hidden dismiss button should only appear at the end of the list, not the
  // start.
  const isTypeableCombobox =
    domReference &&
    domReference.getAttribute('role') === 'combobox' &&
    isTypeableElement(domReference);

  const getTabbableContent = React.useCallback(
    (container: HTMLElement | null = floating) => {
      return container ? tabbable(container, getTabbableOptions()) : [];
    },
    [floating]
  );

  const getTabbableElements = React.useCallback(
    (container?: HTMLElement) => {
      const content = getTabbableContent(container);

      return orderRef.current
        .map((type) => {
          if (domReference && type === 'reference') {
            return domReference;
          }

          if (floating && type === 'floating') {
            return floating;
          }

          return content;
        })
        .filter(Boolean)
        .flat() as Array<FocusableElement>;
    },
    [domReference, floating, orderRef, getTabbableContent]
  );

  React.useEffect(() => {
    if (!modal) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        // The focus guards have nothing to focus, so we need to stop the event.
        if (getTabbableContent().length === 0 && !isTypeableCombobox) {
          stopEvent(event);
        }

        const els = getTabbableElements();
        const target = getTarget(event);

        if (orderRef.current[0] === 'reference' && target === domReference) {
          stopEvent(event);
          if (event.shiftKey) {
            enqueueFocus(els[els.length - 1]);
          } else {
            enqueueFocus(els[1]);
          }
        }

        if (
          orderRef.current[1] === 'floating' &&
          target === floating &&
          event.shiftKey
        ) {
          stopEvent(event);
          enqueueFocus(els[0]);
        }
      }
    }

    const doc = getDocument(floating);
    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [
    domReference,
    floating,
    modal,
    orderRef,
    refs,
    isTypeableCombobox,
    getTabbableContent,
    getTabbableElements,
  ]);

  React.useEffect(() => {
    if (!closeOnFocusOut) {
      return;
    }

    // In Safari, buttons lose focus when pressing them.
    function handlePointerDown() {
      isPointerDownRef.current = true;
      setTimeout(() => {
        isPointerDownRef.current = false;
      });
    }

    function handleFocusOutside(event: FocusEvent) {
      const relatedTarget = event.relatedTarget as Element | null;

      const movedToUnrelatedNode = !(
        contains(domReference, relatedTarget) ||
        contains(floating, relatedTarget) ||
        contains(relatedTarget, floating) ||
        contains(portalContext?.portalNode, relatedTarget) ||
        relatedTarget?.hasAttribute('data-floating-ui-focus-guard') ||
        (tree &&
          (getChildren(tree.nodesRef.current, nodeId).find(
            (node) =>
              contains(node.context?.elements.floating, relatedTarget) ||
              contains(node.context?.elements.domReference, relatedTarget)
          ) ||
            getAncestors(tree.nodesRef.current, nodeId).find(
              (node) =>
                node.context?.elements.floating === relatedTarget ||
                node.context?.elements.domReference === relatedTarget
            )))
      );

      // Focus did not move inside the floating tree, and there are no tabbable
      // portal guards to handle closing.
      if (
        relatedTarget &&
        movedToUnrelatedNode &&
        !isPointerDownRef.current &&
        // Fix React 18 Strict Mode returnFocus due to double rendering.
        relatedTarget !== previouslyFocusedElementRef.current
      ) {
        preventReturnFocusRef.current = true;
        onOpenChange(false);
      }
    }

    if (floating && isHTMLElement(domReference)) {
      domReference.addEventListener('focusout', handleFocusOutside);
      domReference.addEventListener('pointerdown', handlePointerDown);
      !modal && floating.addEventListener('focusout', handleFocusOutside);

      return () => {
        domReference.removeEventListener('focusout', handleFocusOutside);
        domReference.removeEventListener('pointerdown', handlePointerDown);
        !modal && floating.removeEventListener('focusout', handleFocusOutside);
      };
    }
  }, [
    domReference,
    floating,
    modal,
    nodeId,
    tree,
    portalContext,
    onOpenChange,
    closeOnFocusOut,
  ]);

  React.useEffect(() => {
    // Don't hide portals nested within the parent portal.
    const portalNodes = Array.from(
      portalContext?.portalNode?.querySelectorAll(
        '[data-floating-ui-portal]'
      ) || []
    );

    function getDismissButtons() {
      return [
        startDismissButtonRef.current,
        endDismissButtonRef.current,
      ].filter(Boolean) as Array<Element>;
    }

    if (floating && modal) {
      const insideNodes = [floating, ...portalNodes, ...getDismissButtons()];
      const cleanup = hideOthers(
        orderRef.current.includes('reference') || isTypeableCombobox
          ? insideNodes.concat(domReference || [])
          : insideNodes
      );

      return () => {
        cleanup();
      };
    }
  }, [
    domReference,
    floating,
    modal,
    orderRef,
    portalContext,
    isTypeableCombobox,
  ]);

  React.useEffect(() => {
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
  }, [floating, modal, guards, getTabbableElements]);

  useLayoutEffect(() => {
    if (!floating) return;

    const doc = getDocument(floating);

    let preventReturnFocusScroll = false;
    const previouslyFocusedElement = activeElement(doc);
    const contextData = dataRef.current;
    const initialFocusValue = initialFocusRef.current;

    previouslyFocusedElementRef.current = previouslyFocusedElement;

    const focusableElements = getTabbableElements(floating);
    const elToFocus =
      (typeof initialFocusValue === 'number'
        ? focusableElements[initialFocusValue]
        : initialFocusValue.current) || floating;

    // If the `useListNavigation` hook is active, always ignore `initialFocus`
    // because it has its own handling of the initial focus.
    !ignoreInitialFocus &&
      open &&
      enqueueFocus(elToFocus, {preventScroll: elToFocus === floating});

    // Dismissing via outside press should always ignore `returnFocus` to
    // prevent unwanted scrolling.
    function onDismiss(payload: DismissPayload) {
      if (payload.type === 'escapeKey' && refs.domReference.current) {
        previouslyFocusedElementRef.current = refs.domReference.current;
      }

      if (['referencePress', 'escapeKey'].includes(payload.type)) {
        return;
      }

      const returnFocus = payload.data.returnFocus;

      if (typeof returnFocus === 'object') {
        preventReturnFocusRef.current = false;
        preventReturnFocusScroll = returnFocus.preventScroll;
      } else {
        preventReturnFocusRef.current = !returnFocus;
      }
    }

    events.on('dismiss', onDismiss);

    return () => {
      events.off('dismiss', onDismiss);

      const activeEl = activeElement(doc);
      const shouldFocusReference =
        contains(floating, activeEl) ||
        (tree &&
          getChildren(tree.nodesRef.current, nodeId).some((node) =>
            contains(node.context?.elements.floating, activeEl)
          )) ||
        (contextData.openEvent &&
          ['click', 'mousedown'].includes(contextData.openEvent.type));

      if (shouldFocusReference && refs.domReference.current) {
        previouslyFocusedElementRef.current = refs.domReference.current;
      }

      if (
        // eslint-disable-next-line react-hooks/exhaustive-deps
        returnFocusRef.current &&
        isHTMLElement(previouslyFocusedElementRef.current) &&
        !preventReturnFocusRef.current
      ) {
        // `isPointerDownRef.current` to avoid the focus ring from appearing on
        // the reference element when click-toggling it.
        enqueueFocus(previouslyFocusedElementRef.current, {
          // When dismissing nested floating elements, by the time the rAF has
          // executed, the menus will all have been unmounted. When they try
          // to get focused, the calls get ignored — leaving the root
          // reference focused as desired.
          cancelPrevious: false,
          preventScroll: preventReturnFocusScroll,
        });
      }
    };
  }, [
    open,
    floating,
    getTabbableElements,
    returnFocusRef,
    initialFocusRef,
    dataRef,
    refs,
    events,
    ignoreInitialFocus,
    tree,
    nodeId,
  ]);

  // Synchronize the `context` & `modal` value to the FloatingPortal context.
  // It will decide whether or not it needs to render its own guards.
  useLayoutEffect(() => {
    if (!portalContext) return;
    portalContext.setFocusManagerState({
      ...context,
      modal,
      closeOnFocusOut,
      // Not concerned about the <RT> generic type.
    } as any);
    return () => {
      portalContext.setFocusManagerState(null);
    };
  }, [portalContext, modal, closeOnFocusOut, context]);

  useLayoutEffect(() => {
    if (ignoreInitialFocus || !floating) return;

    function setState() {
      if (activeElement(getDocument(floating)) !== refs.domReference.current) {
        setTabbableContentLength(getTabbableContent().length);
      }
    }

    setState();

    if (typeof MutationObserver === 'function') {
      const observer = new MutationObserver(setState);
      observer.observe(floating, {childList: true, subtree: true});
      return () => {
        observer.disconnect();
      };
    }
  }, [floating, getTabbableContent, ignoreInitialFocus, refs]);

  const shouldRenderGuards =
    guards && (isInsidePortal || modal) && !isTypeableCombobox;

  function renderDismissButton(location: 'start' | 'end') {
    return visuallyHiddenDismiss && modal ? (
      <VisuallyHiddenDismiss
        ref={location === 'start' ? startDismissButtonRef : endDismissButtonRef}
        onClick={() => onOpenChange(false)}
      >
        {typeof visuallyHiddenDismiss === 'string'
          ? visuallyHiddenDismiss
          : 'Dismiss'}
      </VisuallyHiddenDismiss>
    ) : null;
  }

  return (
    <>
      {shouldRenderGuards && (
        <FocusGuard
          data-type="inside"
          ref={portalContext?.beforeInsideRef}
          onFocus={(event) => {
            if (modal) {
              const els = getTabbableElements();
              enqueueFocus(
                order[0] === 'reference' ? els[0] : els[els.length - 1]
              );
            } else if (
              portalContext?.preserveTabOrder &&
              portalContext.portalNode
            ) {
              preventReturnFocusRef.current = false;
              if (isOutsideEvent(event, portalContext.portalNode)) {
                const nextTabbable = getNextTabbable() || domReference;
                nextTabbable?.focus();
              } else {
                portalContext.beforeOutsideRef.current?.focus();
              }
            }
          }}
        />
      )}
      {/*
        Ensure the first swipe is the list item. The end of the listbox popup
        will have a dismiss button.
      */}
      {isTypeableCombobox ? null : renderDismissButton('start')}
      {React.cloneElement(
        children,
        tabbableContentLength === 0 || order.includes('floating')
          ? {tabIndex: 0}
          : {}
      )}
      {renderDismissButton('end')}
      {shouldRenderGuards && (
        <FocusGuard
          data-type="inside"
          ref={portalContext?.afterInsideRef}
          onFocus={(event) => {
            if (modal) {
              enqueueFocus(getTabbableElements()[0]);
            } else if (
              portalContext?.preserveTabOrder &&
              portalContext.portalNode
            ) {
              if (closeOnFocusOut) {
                preventReturnFocusRef.current = true;
              }

              if (isOutsideEvent(event, portalContext.portalNode)) {
                const prevTabbable = getPreviousTabbable() || domReference;
                prevTabbable?.focus();
              } else {
                portalContext.afterOutsideRef.current?.focus();
              }
            }
          }}
        />
      )}
    </>
  );
}
