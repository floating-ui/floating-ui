import {isHTMLElement} from '@floating-ui/utils/dom';
import {
  activeElement,
  contains,
  getDocument,
  getTarget,
  isTypeableElement,
  stopEvent,
} from '@floating-ui/utils/react';
import {destructure} from '@solid-primitives/destructure';
import {
  createEffect,
  createMemo,
  JSX,
  mergeProps,
  onCleanup,
  ParentComponent,
  Show,
} from 'solid-js';
import {FocusableElement, tabbable} from 'tabbable';

import type {DismissPayload} from '../hooks/useDismiss';
import type {FloatingContext, ReferenceType} from '../types';
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

const VisuallyHiddenDismiss: ParentComponent<
  JSX.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => {
  return (
    <button {...props} type="button" tabIndex={-1} style={HIDDEN_STYLES} />
  );
};

export interface FloatingFocusManagerProps<
  RT extends ReferenceType = ReferenceType
> {
  context: FloatingContext<RT>;
  children: JSX.Element;
  disabled?: boolean;
  order?: Array<'reference' | 'floating' | 'content'>;
  initialFocus?: number | HTMLElement | null;
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
export function FloatingFocusManager<RT extends ReferenceType = ReferenceType>(
  props: FloatingFocusManagerProps<RT>
): JSX.Element {
  const mergedProps = mergeProps(
    {
      disabled: false,
      order: ['content'],
      guards: true,
      initialFocus: 0,
      returnFocus: true,
      modal: true,
      visuallyHiddenDismiss: false,
      closeOnFocusOut: true,
    } as Required<FloatingFocusManagerProps>,
    props
  );
  const {
    context,
    disabled,
    order,
    guards: _guards,
    initialFocus,
    returnFocus,
    modal,
    visuallyHiddenDismiss,
    closeOnFocusOut,
  } = destructure(mergedProps);
  const {open, refs, nodeId, onOpenChange, events, dataRef} = destructure(
    context()
  );

  // Force the guards to be rendered if the `inert` attribute is not supported.
  const guards = () => (supportsInert() ? _guards() : true);

  const tree = useFloatingTree();
  const portalContext = usePortalContext();

  // Controlled by `useListNavigation`.
  const ignoreInitialFocus =
    typeof initialFocus === 'number' && initialFocus < 0;

  let startDismissButtonRef: HTMLButtonElement | null = null;
  let endDismissButtonRef: HTMLButtonElement | null = null;
  let preventreturnFocus = false;
  let previouslyFocusedElementRef: Element | null = null;
  let isPointerDownRef = false;

  const isInsidePortal = portalContext != null;

  // If the reference is a combobox and is typeable (e.g. input/textarea),
  // there are different focus semantics. The guards should not be rendered, but
  // aria-hidden should be applied to all nodes still. Further, the visually
  // hidden dismiss button should only appear at the end of the list, not the
  // start.
  const isTypeableCombobox = createMemo(() => {
    const domReference = refs().reference() as HTMLElement | null;
    return (
      domReference &&
      domReference.getAttribute('role') === 'combobox' &&
      isTypeableElement(domReference)
    );
  });

  const getTabbableContent = (
    container: HTMLElement | null = refs().floating()
  ) => {
    return container ? tabbable(container, getTabbableOptions()) : [];
  };

  const getTabbableElements = (container?: HTMLElement) => {
    const content = getTabbableContent(container);
    const domReference = refs().reference() as HTMLElement | null;
    const floating = refs().floating() as HTMLElement | null;
    return order()
      ?.map((type: string) => {
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
  };

  createEffect(() => {
    if (disabled() || !modal()) return;
    const domReference = refs().reference();
    const floating = refs().floating();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab') {
        // The focus guards have nothing to focus, so we need to stop the event.
        if (
          contains(floating, activeElement(getDocument(floating))) &&
          getTabbableContent().length === 0 &&
          !isTypeableCombobox
        ) {
          stopEvent(event);
        }

        const els = getTabbableElements();
        const target = getTarget(event);

        if (order()[0] === 'reference' && target === domReference) {
          stopEvent(event);
          if (event.shiftKey) {
            enqueueFocus(els[els.length - 1]);
          } else {
            enqueueFocus(els[1]);
          }
        }

        if (
          order()[1] === 'floating' &&
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
  });

  createEffect(() => {
    if (disabled() || !closeOnFocusOut()) return;
    const domReference = refs().reference();
    const floating = refs().floating();
    // In Safari, buttons lose focus when pressing them.
    function handlePointerDown() {
      isPointerDownRef = true;
      setTimeout(() => {
        isPointerDownRef = false;
      });
    }

    function handleFocusOutside(event: FocusEvent) {
      const relatedTarget = event.relatedTarget as Element | null;

      queueMicrotask(() => {
        const movedToUnrelatedNode = !(
          contains(domReference as Element, relatedTarget) ||
          contains(floating, relatedTarget) ||
          contains(relatedTarget, floating) ||
          contains(portalContext?.portalNode(), relatedTarget) ||
          relatedTarget?.hasAttribute(createAttribute('focus-guard')) ||
          (tree() &&
            (getChildren(tree().nodesRef, nodeId()).find(
              (node) =>
                contains(node.context?.refs.floating(), relatedTarget) ||
                contains(
                  node.context?.refs.reference() as Element,
                  relatedTarget
                )
            ) ||
              getAncestors(tree().nodesRef, nodeId()).find(
                (node) =>
                  node.context?.refs.floating() === relatedTarget ||
                  node.context?.refs.reference() === relatedTarget
              )))
        );

        // Focus did not move inside the floating tree, and there are no tabbable
        // portal guards to handle closing.
        if (
          relatedTarget &&
          movedToUnrelatedNode &&
          !isPointerDownRef &&
          // Fix React 18 Strict Mode returnFocus due to double rendering.
          relatedTarget !== previouslyFocusedElementRef
        ) {
          preventreturnFocus = true;
          onOpenChange()(false, event);
        }
      });
    }

    if (floating && isHTMLElement(domReference)) {
      domReference.addEventListener('focusout', handleFocusOutside);
      domReference.addEventListener('pointerdown', handlePointerDown);
      !modal && floating.addEventListener('focusout', handleFocusOutside);

      onCleanup(() => {
        domReference.removeEventListener('focusout', handleFocusOutside);
        domReference.removeEventListener('pointerdown', handlePointerDown);
        !modal() &&
          floating.removeEventListener('focusout', handleFocusOutside);
      });
    }
  });

  createEffect(() => {
    if (disabled()) return;
    const domReference = refs().reference();
    const floating = refs().floating();
    // Don't hide portals nested within the parent portal.
    const portalNodes = Array.from(
      portalContext
        ?.portalNode()
        ?.querySelectorAll(`[${createAttribute('portal')}]`) || []
    );
    onCleanup(() => {
      if (floating) {
        const insideElements = [
          floating,
          ...portalNodes,
          startDismissButtonRef,
          endDismissButtonRef,
          order().includes('reference') || isTypeableCombobox()
            ? domReference
            : null,
        ].filter((x): x is Element => x != null);

        const cleanup = modal()
          ? markOthers(insideElements, guards(), !guards())
          : markOthers(insideElements);
        cleanup();
      }
    });
  });

  createEffect(() => {
    const floating = refs().floating();
    if (disabled() || !floating) return;

    const doc = getDocument(floating);
    const previouslyFocusedElement = activeElement(doc);

    // Wait for any layout effect state setters to execute to set `tabIndex`.
    queueMicrotask(() => {
      const focusableElements = getTabbableElements(floating);
      const initialFocusValue = initialFocus();

      const elToFocus =
        (typeof initialFocusValue === 'number'
          ? focusableElements[initialFocusValue]
          : initialFocusValue) || floating;
      const focusAlreadyInsideFloatingEl = contains(
        floating,
        previouslyFocusedElement
      );

      if (!ignoreInitialFocus && !focusAlreadyInsideFloatingEl && open()) {
        enqueueFocus(elToFocus, {preventScroll: elToFocus === floating});
      }
    });
  });

  createEffect(() => {
    const floating = refs().floating();
    if (disabled() || !floating) return;

    let preventReturnFocusScroll = false;

    const doc = getDocument(floating);
    const previouslyFocusedElement = activeElement(doc);
    const contextData = dataRef;

    previouslyFocusedElementRef = previouslyFocusedElement;

    // Dismissing via outside press should always ignore `returnFocus` to
    // prevent unwanted scrolling.
    function onDismiss(payload: DismissPayload) {
      if (payload.type === 'escapeKey' && refs().reference()) {
        previouslyFocusedElementRef = refs().reference() as Element | null;
      }

      if (['referencePress', 'escapeKey'].includes(payload.type)) {
        return;
      }

      const returnFocus = payload.data.returnFocus;

      if (typeof returnFocus === 'object') {
        preventreturnFocus = false;
        preventReturnFocusScroll = returnFocus.preventScroll;
      } else {
        preventreturnFocus = !returnFocus;
      }
    }

    events().on('dismiss', onDismiss);

    onCleanup(() => {
      events().off('dismiss', onDismiss);

      const activeEl = activeElement(doc);
      const openEvent = contextData().openEvent;
      const shouldFocusReference =
        contains(floating, activeEl) ||
        (tree &&
          getChildren(tree().nodesRef, nodeId()).some((node) =>
            contains(node.context?.refs.floating(), activeEl)
          )) ||
        (openEvent && ['click', 'mousedown'].includes(openEvent.type));

      if (shouldFocusReference && refs().reference()) {
        previouslyFocusedElementRef = refs().reference() as Element | null;
      }

      if (
        returnFocus() &&
        isHTMLElement(previouslyFocusedElementRef) &&
        !preventreturnFocus
      ) {
        enqueueFocus(previouslyFocusedElementRef, {
          // When dismissing nested floating elements, by the time the rAF has
          // executed, the menus will all have been unmounted. When they try
          // to get focused, the calls get ignored — leaving the root
          // reference focused as desired.
          cancelPrevious: false,
          preventScroll: preventReturnFocusScroll,
        });
      }
    });
  });

  // Synchronize the `context` & `modal` value to the FloatingPortal context.
  // It will decide whether or not it needs to render its own guards.
  createEffect(() => {
    if (disabled() || !portalContext) return;

    portalContext.setFocusManagerState({
      modal: modal(),
      closeOnFocusOut: closeOnFocusOut(),
      open: context().open(),
      onOpenChange,
      refs: refs(),
    });
  });
  onCleanup(() => {
    portalContext?.setFocusManagerState(null);
  });

  createEffect(() => {
    if (disabled()) return;
    const floating = refs().floating();

    if (floating && typeof MutationObserver === 'function') {
      const handleMutation = () => {
        const tabIndex = floating.getAttribute('tabindex');
        if (
          order().includes('floating') ||
          (activeElement(getDocument(floating)) !==
            (refs().reference() as Element) &&
            getTabbableContent().length === 0)
        ) {
          if (tabIndex !== '0') {
            floating.setAttribute('tabindex', '0');
          }
        } else if (tabIndex !== '-1') {
          floating.setAttribute('tabindex', '-1');
        }
      };

      handleMutation();
      const observer = new MutationObserver(handleMutation);

      observer.observe(floating, {
        childList: true,
        subtree: true,
        attributes: true,
      });

      onCleanup(() => {
        observer.disconnect();
      });
    }
  });

  function RenderDismissButton(props: {location: 'start' | 'end'}) {
    if (disabled() || !visuallyHiddenDismiss() || !modal()) {
      return null;
    }

    return (
      <VisuallyHiddenDismiss
        ref={(el) =>
          props.location === 'start'
            ? (startDismissButtonRef = el)
            : (endDismissButtonRef = el)
        }
        onClick={(event) => onOpenChange()(false, event)}
      >
        {typeof visuallyHiddenDismiss === 'string'
          ? visuallyHiddenDismiss
          : 'Dismiss'}
      </VisuallyHiddenDismiss>
    );
  }

  const shouldRenderGuards = createMemo(
    () =>
      !disabled() &&
      guards() &&
      !isTypeableCombobox &&
      (isInsidePortal || modal())
  );

  return (
    <>
      <Show when={shouldRenderGuards()}>
        <FocusGuard
          data-type="inside"
          ref={(el) => portalContext?.setRefs('beforeInsideRef', el)}
          onFocus={(event) => {
            if (modal()) {
              const els = getTabbableElements();
              enqueueFocus(
                order()[0] === 'reference' ? els[0] : els[els.length - 1]
              );
            } else if (
              portalContext?.preserveTabOrder &&
              portalContext.portalNode
            ) {
              preventreturnFocus = false;
              if (
                isOutsideEvent(
                  event,
                  portalContext.portalNode() as HTMLElement | undefined
                )
              ) {
                const nextTabbable = getNextTabbable() || refs().reference();
                nextTabbable?.focus();
              } else {
                portalContext.refs.beforeOutsideRef?.focus();
              }
            }
          }}
        />
      </Show>
      {/*
        Ensure the first swipe is the list item. The end of the listbox popup
        will have a dismiss button.
      */}
      <Show when={!isTypeableCombobox()}>
        <RenderDismissButton location="start" />
      </Show>

      {props.children}
      {<RenderDismissButton location="end" />}
      <Show when={shouldRenderGuards}>
        <FocusGuard
          data-type="inside"
          ref={(el) => portalContext?.setRefs('afterInsideRef', el)}
          onFocus={(event) => {
            if (modal()) {
              enqueueFocus(getTabbableElements()[0]);
            } else if (
              portalContext?.preserveTabOrder &&
              portalContext.portalNode()
            ) {
              if (closeOnFocusOut()) {
                preventreturnFocus = true;
              }

              if (
                isOutsideEvent(
                  event,
                  portalContext.portalNode() as Element | undefined
                )
              ) {
                const prevTabbable =
                  getPreviousTabbable() || refs().reference();
                prevTabbable?.focus();
              } else {
                portalContext.refs.afterOutsideRef?.focus();
              }
            }
          }}
        />
      </Show>
    </>
  );
}
