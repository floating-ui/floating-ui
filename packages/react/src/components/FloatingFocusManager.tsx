import {
  activeElement,
  contains,
  getDocument,
  getTarget,
  isTypeableCombobox,
  isVirtualClick,
  isVirtualPointerEvent,
  stopEvent,
} from '@floating-ui/react/utils';
import {getNodeName, isHTMLElement} from '@floating-ui/utils/dom';
import * as React from 'react';
import type {FocusableElement} from 'tabbable';
import {tabbable, isTabbable} from 'tabbable';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

import {useLatestRef} from '../hooks/utils/useLatestRef';
import type {FloatingContext, OpenChangeReason} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {enqueueFocus} from '../utils/enqueueFocus';
import {getAncestors} from '../utils/getAncestors';
import {getChildren} from '../utils/getChildren';
import {markOthers, supportsInert} from '../utils/markOthers';
import {
  getNextTabbable,
  getPreviousTabbable,
  getTabbableOptions,
  isOutsideEvent,
} from '../utils/tabbable';
import {usePortalContext} from './FloatingPortal';
import {useFloatingTree} from './FloatingTree';
import {FocusGuard, HIDDEN_STYLES} from './FocusGuard';
import {useEffectEvent} from '../hooks/utils/useEffectEvent';
import {getFloatingFocusElement} from '../utils/getFloatingFocusElement';

const LIST_LIMIT = 20;
let previouslyFocusedElements: Element[] = [];

function addPreviouslyFocusedElement(element: Element | null) {
  previouslyFocusedElements = previouslyFocusedElements.filter(
    (el) => el.isConnected,
  );
  let tabbableEl = element;
  if (!tabbableEl || getNodeName(tabbableEl) === 'body') return;
  if (!isTabbable(tabbableEl, getTabbableOptions())) {
    const tabbableChild = tabbable(tabbableEl, getTabbableOptions())[0];
    if (tabbableChild) {
      tabbableEl = tabbableChild;
    }
  }
  previouslyFocusedElements.push(tabbableEl);
  if (previouslyFocusedElements.length > LIST_LIMIT) {
    previouslyFocusedElements = previouslyFocusedElements.slice(-LIST_LIMIT);
  }
}

function getPreviouslyFocusedElement() {
  return previouslyFocusedElements
    .slice()
    .reverse()
    .find((el) => el.isConnected);
}

const VisuallyHiddenDismiss = React.forwardRef(function VisuallyHiddenDismiss(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
  ref: React.ForwardedRef<HTMLButtonElement>,
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

export interface FloatingFocusManagerProps {
  children: React.JSX.Element;
  /**
   * The floating context returned from `useFloating`.
   */
  context: FloatingContext;
  /**
   * Whether or not the focus manager should be disabled. Useful to delay focus
   * management until after a transition completes or some other conditional
   * state.
   * @default false
   */
  disabled?: boolean;
  /**
   * The order in which focus cycles.
   * @default ['content']
   */
  order?: Array<'reference' | 'floating' | 'content'>;
  /**
   * Which element to initially focus. Can be either a number (tabbable index as
   * specified by the `order`) or a ref.
   * @default 0
   */
  initialFocus?: number | React.MutableRefObject<HTMLElement | null>;
  /**
   * Determines if the focus guards are rendered. If not, focus can escape into
   * the address bar/console/browser UI, like in native dialogs.
   * @default true
   */
  guards?: boolean;
  /**
   * Determines if focus should be returned to the reference element once the
   * floating element closes/unmounts (or if that is not available, the
   * previously focused element). This prop is ignored if the floating element
   * lost focus.
   * It can be also set to a ref to explicitly control the element to return focus to.
   * @default true
   */
  returnFocus?: boolean | React.MutableRefObject<HTMLElement | null>;
  /**
   * Determines if focus should be restored to the nearest tabbable element if
   * focus inside the floating element is lost (such as due to the removal of
   * the currently focused element from the DOM).
   * @default false
   */
  restoreFocus?: boolean;
  /**
   * Determines if focus is “modal”, meaning focus is fully trapped inside the
   * floating element and outside content cannot be accessed. This includes
   * screen reader virtual cursors.
   * @default true
   */
  modal?: boolean;
  /**
   * If your focus management is modal and there is no explicit close button
   * available, you can use this prop to render a visually-hidden dismiss
   * button at the start and end of the floating element. This allows
   * touch-based screen readers to escape the floating element due to lack of
   * an `esc` key.
   * @default undefined
   */
  visuallyHiddenDismiss?: boolean | string;
  /**
   * Determines whether `focusout` event listeners that control whether the
   * floating element should be closed if the focus moves outside of it are
   * attached to the reference and floating elements. This affects non-modal
   * focus management.
   * @default true
   */
  closeOnFocusOut?: boolean;
}

/**
 * Provides focus management for the floating element.
 * @see https://floating-ui.com/docs/FloatingFocusManager
 */
export function FloatingFocusManager(
  props: FloatingFocusManagerProps,
): React.JSX.Element {
  const {
    context,
    children,
    disabled = false,
    order = ['content'],
    guards: _guards = true,
    initialFocus = 0,
    returnFocus = true,
    restoreFocus = false,
    modal = true,
    visuallyHiddenDismiss = false,
    closeOnFocusOut = true,
  } = props;
  const {
    open,
    refs,
    nodeId,
    onOpenChange,
    events,
    dataRef,
    floatingId,
    elements: {domReference, floating},
  } = context;

  const ignoreInitialFocus =
    typeof initialFocus === 'number' && initialFocus < 0;
  // If the reference is a combobox and is typeable (e.g. input/textarea),
  // there are different focus semantics. The guards should not be rendered, but
  // aria-hidden should be applied to all nodes still. Further, the visually
  // hidden dismiss button should only appear at the end of the list, not the
  // start.
  const isUntrappedTypeableCombobox =
    isTypeableCombobox(domReference) && ignoreInitialFocus;

  // Force the guards to be rendered if the `inert` attribute is not supported.
  const guards = supportsInert() ? _guards : true;

  const orderRef = useLatestRef(order);
  const initialFocusRef = useLatestRef(initialFocus);
  const returnFocusRef = useLatestRef(returnFocus);

  const tree = useFloatingTree();
  const portalContext = usePortalContext();

  const startDismissButtonRef = React.useRef<HTMLButtonElement>(null);
  const endDismissButtonRef = React.useRef<HTMLButtonElement>(null);
  const preventReturnFocusRef = React.useRef(false);
  const isPointerDownRef = React.useRef(false);
  const tabbableIndexRef = React.useRef(-1);

  const isInsidePortal = portalContext != null;
  const floatingFocusElement = getFloatingFocusElement(floating);

  const getTabbableContent = useEffectEvent(
    (container: Element | null = floatingFocusElement) => {
      return container ? tabbable(container, getTabbableOptions()) : [];
    },
  );

  const getTabbableElements = useEffectEvent((container?: Element) => {
    const content = getTabbableContent(container);

    return orderRef.current
      .map((type) => {
        if (domReference && type === 'reference') {
          return domReference;
        }

        if (floatingFocusElement && type === 'floating') {
          return floatingFocusElement;
        }

        return content;
      })
      .filter(Boolean)
      .flat() as Array<FocusableElement>;
  });

  React.useEffect(() => {
    preventReturnFocusRef.current = false;
  }, [disabled]);

  React.useEffect(() => {
    if (disabled) return;
    if (!modal) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        // The focus guards have nothing to focus, so we need to stop the event.
        if (
          contains(
            floatingFocusElement,
            activeElement(getDocument(floatingFocusElement)),
          ) &&
          getTabbableContent().length === 0 &&
          !isUntrappedTypeableCombobox
        ) {
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
          target === floatingFocusElement &&
          event.shiftKey
        ) {
          stopEvent(event);
          enqueueFocus(els[0]);
        }
      }
    }

    const doc = getDocument(floatingFocusElement);
    doc.addEventListener('keydown', onKeyDown);
    return () => {
      doc.removeEventListener('keydown', onKeyDown);
    };
  }, [
    disabled,
    domReference,
    floatingFocusElement,
    modal,
    orderRef,
    isUntrappedTypeableCombobox,
    getTabbableContent,
    getTabbableElements,
  ]);

  React.useEffect(() => {
    if (disabled) return;
    if (!floating) return;

    function handleFocusIn(event: FocusEvent) {
      const target = getTarget(event) as Element | null;
      const tabbableContent = getTabbableContent() as Array<Element | null>;
      const tabbableIndex = tabbableContent.indexOf(target);
      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }
    }

    floating.addEventListener('focusin', handleFocusIn);

    return () => {
      floating.removeEventListener('focusin', handleFocusIn);
    };
  }, [disabled, floating, getTabbableContent]);

  React.useEffect(() => {
    if (disabled) return;
    if (!closeOnFocusOut) return;

    // In Safari, buttons lose focus when pressing them.
    function handlePointerDown() {
      isPointerDownRef.current = true;
      setTimeout(() => {
        isPointerDownRef.current = false;
      });
    }

    function handleFocusOutside(event: FocusEvent) {
      const relatedTarget = event.relatedTarget as Element | null;

      queueMicrotask(() => {
        const movedToUnrelatedNode = !(
          contains(domReference, relatedTarget) ||
          contains(floating, relatedTarget) ||
          contains(relatedTarget, floating) ||
          contains(portalContext?.portalNode, relatedTarget) ||
          relatedTarget?.hasAttribute(createAttribute('focus-guard')) ||
          (tree &&
            (getChildren(tree.nodesRef.current, nodeId).find(
              (node) =>
                contains(node.context?.elements.floating, relatedTarget) ||
                contains(node.context?.elements.domReference, relatedTarget),
            ) ||
              getAncestors(tree.nodesRef.current, nodeId).find(
                (node) =>
                  node.context?.elements.floating === relatedTarget ||
                  node.context?.elements.domReference === relatedTarget,
              )))
        );

        // Restore focus to the previous tabbable element index to prevent
        // focus from being lost outside the floating tree.
        if (
          restoreFocus &&
          movedToUnrelatedNode &&
          activeElement(getDocument(floatingFocusElement)) ===
            getDocument(floatingFocusElement).body
        ) {
          // Let `FloatingPortal` effect knows that focus is still inside the
          // floating tree.
          if (isHTMLElement(floatingFocusElement)) {
            floatingFocusElement.focus();
          }

          const prevTabbableIndex = tabbableIndexRef.current;
          const tabbableContent = getTabbableContent() as Array<Element | null>;
          const nodeToFocus =
            tabbableContent[prevTabbableIndex] ||
            tabbableContent[tabbableContent.length - 1] ||
            floatingFocusElement;

          if (isHTMLElement(nodeToFocus)) {
            nodeToFocus.focus();
          }
        }

        // Focus did not move inside the floating tree, and there are no tabbable
        // portal guards to handle closing.
        if (
          (isUntrappedTypeableCombobox ? true : !modal) &&
          relatedTarget &&
          movedToUnrelatedNode &&
          !isPointerDownRef.current &&
          // Fix React 18 Strict Mode returnFocus due to double rendering.
          relatedTarget !== getPreviouslyFocusedElement()
        ) {
          preventReturnFocusRef.current = true;
          onOpenChange(false, event, 'focus-out');
        }
      });
    }

    if (floating && isHTMLElement(domReference)) {
      domReference.addEventListener('focusout', handleFocusOutside);
      domReference.addEventListener('pointerdown', handlePointerDown);
      floating.addEventListener('focusout', handleFocusOutside);

      return () => {
        domReference.removeEventListener('focusout', handleFocusOutside);
        domReference.removeEventListener('pointerdown', handlePointerDown);
        floating.removeEventListener('focusout', handleFocusOutside);
      };
    }
  }, [
    disabled,
    domReference,
    floating,
    floatingFocusElement,
    modal,
    nodeId,
    tree,
    portalContext,
    onOpenChange,
    closeOnFocusOut,
    restoreFocus,
    getTabbableContent,
    isUntrappedTypeableCombobox,
  ]);

  React.useEffect(() => {
    if (disabled) return;

    // Don't hide portals nested within the parent portal.
    const portalNodes = Array.from(
      portalContext?.portalNode?.querySelectorAll(
        `[${createAttribute('portal')}]`,
      ) || [],
    );

    if (floating) {
      const insideElements = [
        floating,
        ...portalNodes,
        startDismissButtonRef.current,
        endDismissButtonRef.current,
        orderRef.current.includes('reference') || isUntrappedTypeableCombobox
          ? domReference
          : null,
      ].filter((x): x is Element => x != null);

      const cleanup =
        modal || isUntrappedTypeableCombobox
          ? markOthers(insideElements, guards, !guards)
          : markOthers(insideElements);

      return () => {
        cleanup();
      };
    }
  }, [
    disabled,
    domReference,
    floating,
    modal,
    orderRef,
    portalContext,
    isUntrappedTypeableCombobox,
    guards,
  ]);

  useModernLayoutEffect(() => {
    if (disabled || !isHTMLElement(floatingFocusElement)) return;

    const doc = getDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);

    // Wait for any layout effect state setters to execute to set `tabIndex`.
    queueMicrotask(() => {
      const focusableElements = getTabbableElements(floatingFocusElement);
      const initialFocusValue = initialFocusRef.current;
      const elToFocus =
        (typeof initialFocusValue === 'number'
          ? focusableElements[initialFocusValue]
          : initialFocusValue.current) || floatingFocusElement;
      const focusAlreadyInsideFloatingEl = contains(
        floatingFocusElement,
        previouslyFocusedElement,
      );

      if (!ignoreInitialFocus && !focusAlreadyInsideFloatingEl && open) {
        enqueueFocus(elToFocus, {
          preventScroll: elToFocus === floatingFocusElement,
        });
      }
    });
  }, [
    disabled,
    open,
    floatingFocusElement,
    ignoreInitialFocus,
    getTabbableElements,
    initialFocusRef,
  ]);

  useModernLayoutEffect(() => {
    if (disabled || !floatingFocusElement) return;

    let preventReturnFocusScroll = false;

    const doc = getDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);
    const contextData = dataRef.current;
    let openEvent = contextData.openEvent;

    addPreviouslyFocusedElement(previouslyFocusedElement);

    // Dismissing via outside press should always ignore `returnFocus` to
    // prevent unwanted scrolling.
    function onOpenChange({
      open,
      reason,
      event,
      nested,
    }: {
      open: boolean;
      reason: OpenChangeReason;
      event: Event;
      nested: boolean;
    }) {
      if (open) {
        openEvent = event;
      }

      if (reason === 'escape-key' && refs.domReference.current) {
        addPreviouslyFocusedElement(refs.domReference.current);
      }

      if (reason === 'hover' && event.type === 'mouseleave') {
        preventReturnFocusRef.current = true;
      }

      if (reason !== 'outside-press') return;

      if (nested) {
        preventReturnFocusRef.current = false;
        preventReturnFocusScroll = true;
      } else {
        preventReturnFocusRef.current = !(
          isVirtualClick(event as MouseEvent) ||
          isVirtualPointerEvent(event as PointerEvent)
        );
      }
    }

    events.on('openchange', onOpenChange);

    const fallbackEl = doc.createElement('span');
    fallbackEl.setAttribute('tabindex', '-1');
    fallbackEl.setAttribute('aria-hidden', 'true');
    Object.assign(fallbackEl.style, HIDDEN_STYLES);

    if (isInsidePortal && domReference) {
      domReference.insertAdjacentElement('afterend', fallbackEl);
    }

    function getReturnElement() {
      if (typeof returnFocusRef.current === 'boolean') {
        return getPreviouslyFocusedElement() || fallbackEl;
      }

      return returnFocusRef.current.current || fallbackEl;
    }

    return () => {
      events.off('openchange', onOpenChange);

      const activeEl = activeElement(doc);
      const isFocusInsideFloatingTree =
        contains(floating, activeEl) ||
        (tree &&
          getChildren(tree.nodesRef.current, nodeId).some((node) =>
            contains(node.context?.elements.floating, activeEl),
          ));
      const shouldFocusReference =
        isFocusInsideFloatingTree ||
        (openEvent && ['click', 'mousedown'].includes(openEvent.type));

      if (shouldFocusReference && refs.domReference.current) {
        addPreviouslyFocusedElement(refs.domReference.current);
      }

      const returnElement = getReturnElement();

      queueMicrotask(() => {
        if (
          // eslint-disable-next-line react-hooks/exhaustive-deps
          returnFocusRef.current &&
          !preventReturnFocusRef.current &&
          isHTMLElement(returnElement) &&
          // If the focus moved somewhere else after mount, avoid returning focus
          // since it likely entered a different element which should be
          // respected: https://github.com/floating-ui/floating-ui/issues/2607
          (returnElement !== activeEl && activeEl !== doc.body
            ? isFocusInsideFloatingTree
            : true)
        ) {
          returnElement.focus({preventScroll: preventReturnFocusScroll});
        }

        fallbackEl.remove();
      });
    };
  }, [
    disabled,
    floating,
    floatingFocusElement,
    returnFocusRef,
    dataRef,
    refs,
    events,
    tree,
    nodeId,
    isInsidePortal,
    domReference,
  ]);

  // Synchronize the `context` & `modal` value to the FloatingPortal context.
  // It will decide whether or not it needs to render its own guards.
  useModernLayoutEffect(() => {
    if (disabled) return;
    if (!portalContext) return;

    portalContext.setFocusManagerState({
      modal,
      closeOnFocusOut,
      open,
      onOpenChange,
      refs,
    });

    return () => {
      portalContext.setFocusManagerState(null);
    };
  }, [
    disabled,
    portalContext,
    modal,
    open,
    onOpenChange,
    refs,
    closeOnFocusOut,
  ]);

  useModernLayoutEffect(() => {
    if (disabled) return;
    if (!floatingFocusElement) return;
    if (typeof MutationObserver !== 'function') return;
    if (ignoreInitialFocus) return;

    const handleMutation = () => {
      const tabIndex = floatingFocusElement.getAttribute('tabindex');
      const tabbableContent = getTabbableContent() as Array<Element | null>;
      const activeEl = activeElement(getDocument(floating));
      const tabbableIndex = tabbableContent.indexOf(activeEl);

      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }

      if (
        orderRef.current.includes('floating') ||
        (activeEl !== refs.domReference.current && tabbableContent.length === 0)
      ) {
        if (tabIndex !== '0') {
          floatingFocusElement.setAttribute('tabindex', '0');
        }
      } else if (tabIndex !== '-1') {
        floatingFocusElement.setAttribute('tabindex', '-1');
      }
    };

    handleMutation();
    const observer = new MutationObserver(handleMutation);

    observer.observe(floatingFocusElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [
    disabled,
    floating,
    floatingFocusElement,
    refs,
    orderRef,
    getTabbableContent,
    ignoreInitialFocus,
  ]);

  function renderDismissButton(location: 'start' | 'end') {
    if (disabled || !visuallyHiddenDismiss || !modal) {
      return null;
    }

    return (
      <VisuallyHiddenDismiss
        ref={location === 'start' ? startDismissButtonRef : endDismissButtonRef}
        onClick={(event) => onOpenChange(false, event.nativeEvent)}
      >
        {typeof visuallyHiddenDismiss === 'string'
          ? visuallyHiddenDismiss
          : 'Dismiss'}
      </VisuallyHiddenDismiss>
    );
  }

  const shouldRenderGuards =
    !disabled &&
    guards &&
    (modal ? !isUntrappedTypeableCombobox : true) &&
    (isInsidePortal || modal);

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
                order[0] === 'reference' ? els[0] : els[els.length - 1],
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
      {!isUntrappedTypeableCombobox && renderDismissButton('start')}
      {children}
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
