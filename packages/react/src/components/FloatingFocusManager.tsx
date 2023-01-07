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
  return <button {...props} ref={ref} tabIndex={-1} style={HIDDEN_STYLES} />;
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
    refs,
    nodeId,
    onOpenChange,
    events,
    _: {domReference},
  } = context;

  const orderRef = useLatestRef(order);
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
  const isInsidePortal = portalContext != null;

  // If the reference is a combobox and is typeable (e.g. input/textarea),
  // there are different focus semantics. The guards should not be rendered, but
  // aria-hidden should be applied to all nodes still. Further, the visually
  // hidden dismiss button should only appear at the end of the list, not the
  // start.
  const typeableCombobox =
    domReference &&
    domReference.getAttribute('role') === 'combobox' &&
    isTypeableElement(domReference);

  const getTabbableContent = React.useCallback(
    (container: HTMLElement | null = refs.floating.current) => {
      return container ? tabbable(container, getTabbableOptions()) : [];
    },
    [refs]
  );

  const getTabbableElements = React.useCallback(
    (container?: HTMLElement) => {
      const content = getTabbableContent(container);

      return orderRef.current
        .map((type) => {
          if (refs.domReference.current && type === 'reference') {
            return refs.domReference.current;
          }

          if (refs.floating.current && type === 'floating') {
            return refs.floating.current;
          }

          return content;
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
        // The focus guards have nothing to focus, so we need to stop the event.
        if (getTabbableContent().length === 0 && !typeableCombobox) {
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
            enqueueFocus(els[els.length - 1]);
          } else {
            enqueueFocus(els[1]);
          }
        }

        if (
          orderRef.current[1] === 'floating' &&
          target === refs.floating.current &&
          event.shiftKey
        ) {
          stopEvent(event);
          enqueueFocus(els[0]);
        }
      }
    }

    const doc = getDocument(refs.floating.current);
    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [
    modal,
    orderRef,
    refs,
    typeableCombobox,
    getTabbableContent,
    getTabbableElements,
  ]);

  React.useEffect(() => {
    if (!closeOnFocusOut) {
      return;
    }
    const floating = refs.floating.current;
    const reference = refs.domReference.current;

    let isPointerDown = false;

    // In Safari, buttons lose focus when pressing them.
    function handlePointerDown() {
      isPointerDown = true;
      setTimeout(() => {
        isPointerDown = false;
      });
    }

    function handleFocusOutside(event: FocusEvent) {
      const relatedTarget = event.relatedTarget as Element | null;

      const movedToUnrelatedNode = !(
        contains(reference, relatedTarget) ||
        contains(floating, relatedTarget) ||
        contains(relatedTarget, floating) ||
        contains(portalContext?.portalNode, relatedTarget) ||
        relatedTarget?.hasAttribute('data-floating-ui-focus-guard') ||
        (tree &&
          (getChildren(tree.nodesRef.current, nodeId).find(
            (node) =>
              contains(node.context?.refs.floating.current, relatedTarget) ||
              contains(node.context?.refs.domReference.current, relatedTarget)
          ) ||
            getAncestors(tree.nodesRef.current, nodeId).find(
              (node) =>
                node.context?.refs.floating.current === relatedTarget ||
                node.context?.refs.domReference.current === relatedTarget
            )))
      );

      // Focus did not move inside the floating tree, and there are no tabbable
      // portal guards to handle closing.
      if (
        relatedTarget &&
        movedToUnrelatedNode &&
        !isPointerDown &&
        // Fix React 18 Strict Mode returnFocus due to double rendering.
        relatedTarget !== previouslyFocusedElementRef.current
      ) {
        preventReturnFocusRef.current = true;
        // On iOS VoiceOver, dismissing the nested submenu will cause the
        // first item of the list to receive focus. Delaying it appears to fix
        // the issue.
        setTimeout(() => onOpenChange(false));
      }
    }

    if (floating && isHTMLElement(reference)) {
      reference.addEventListener('focusout', handleFocusOutside);
      reference.addEventListener('pointerdown', handlePointerDown);
      !modal && floating.addEventListener('focusout', handleFocusOutside);

      return () => {
        reference.removeEventListener('focusout', handleFocusOutside);
        reference.removeEventListener('pointerdown', handlePointerDown);
        !modal && floating.removeEventListener('focusout', handleFocusOutside);
      };
    }
  }, [modal, nodeId, tree, refs, portalContext, onOpenChange, closeOnFocusOut]);

  React.useEffect(() => {
    const floating = refs.floating.current;
    const reference = refs.domReference.current;
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

    if (floating && isHTMLElement(reference) && modal) {
      const insideNodes = [floating, ...portalNodes, ...getDismissButtons()];
      const cleanup = hideOthers(
        orderRef.current.includes('reference') || typeableCombobox
          ? insideNodes.concat(reference)
          : insideNodes
      );

      return () => {
        cleanup();
      };
    }
  }, [modal, orderRef, portalContext, refs, typeableCombobox]);

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
  }, [modal, guards, refs, getTabbableElements]);

  useLayoutEffect(() => {
    const floating = refs.floating.current;
    if (!floating) return;

    const doc = getDocument(floating);

    let returnFocusValue = returnFocus;
    let preventReturnFocusScroll = false;
    const previouslyFocusedElement = activeElement(doc);

    previouslyFocusedElementRef.current = previouslyFocusedElement;

    const focusableElements = getTabbableElements(floating);
    const elToFocus =
      (typeof initialFocus === 'number'
        ? focusableElements[initialFocus]
        : initialFocus.current) || floating;

    // If the `useListNavigation` hook is active, always ignore `initialFocus`
    // because it has its own handling of the initial focus.
    !ignoreInitialFocus &&
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
        returnFocusValue = true;
        preventReturnFocusScroll = returnFocus.preventScroll;
      } else {
        returnFocusValue = returnFocus;
      }
    }

    events.on('dismiss', onDismiss);

    return () => {
      events.off('dismiss', onDismiss);

      if (contains(floating, activeElement(doc)) && refs.domReference.current) {
        previouslyFocusedElementRef.current = refs.domReference.current;
      }

      if (
        returnFocusValue &&
        isHTMLElement(previouslyFocusedElementRef.current) &&
        !preventReturnFocusRef.current
      ) {
        if (!refs.domReference.current) {
          enqueueFocus(previouslyFocusedElementRef.current, {
            // When dismissing nested floating elements, by the time the rAF has
            // executed, the menus will all have been unmounted. When they try
            // to get focused, the calls get ignored — leaving the root
            // reference focused as desired.
            cancelPrevious: false,
            preventScroll: preventReturnFocusScroll,
          });
        } else {
          // In Safari, `useListNavigation` moves focus sync, so making this
          // sync ensures the initial item remains focused despite this being
          // invoked in Strict Mode due to double-invoked useEffects. This also
          // has the positive side effect of closing a modally focus-managed
          // <Menu> on `Tab` keydown to move naturally to the next focusable
          // element.
          previouslyFocusedElementRef.current?.focus({
            preventScroll: preventReturnFocusScroll,
          });
        }
      }
    };
  }, [
    getTabbableElements,
    initialFocus,
    returnFocus,
    refs,
    events,
    ignoreInitialFocus,
  ]);

  // Synchronize the `context` & `modal` value to the FloatingPortal context.
  // It will decide whether or not it needs to render its own guards.
  useLayoutEffect(() => {
    if (!portalContext) return;
    portalContext.setFocusManagerState({
      ...context,
      modal,
      // Not concerned about the <RT> generic type.
    } as any);
    return () => {
      portalContext.setFocusManagerState(null);
    };
  }, [portalContext, modal, context]);

  useLayoutEffect(() => {
    const floating = refs.floating.current;

    if (ignoreInitialFocus || !floating) return;

    function setState() {
      setTabbableContentLength(getTabbableContent().length);
    }

    setState();

    if (typeof MutationObserver === 'function') {
      const observer = new MutationObserver(setState);
      observer.observe(floating, {childList: true, subtree: true});
      return () => {
        observer.disconnect();
      };
    }
  }, [getTabbableContent, ignoreInitialFocus, refs]);

  const shouldRenderGuards =
    guards && (isInsidePortal || modal) && !typeableCombobox;

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
      {typeableCombobox ? null : renderDismissButton('start')}
      {React.cloneElement(
        children,
        tabbableContentLength === 0 || order.includes('floating')
          ? {tabIndex: 0}
          : {}
      )}
      {renderDismissButton('end')}
      {shouldRenderGuards && (
        <FocusGuard
          ref={portalContext?.afterInsideRef}
          onFocus={(event) => {
            if (modal) {
              enqueueFocus(getTabbableElements()[0]);
            } else if (
              portalContext?.preserveTabOrder &&
              portalContext.portalNode
            ) {
              preventReturnFocusRef.current = true;
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
