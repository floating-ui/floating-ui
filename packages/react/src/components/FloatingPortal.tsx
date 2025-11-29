import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {isNode} from '@floating-ui/utils/dom';
import {
  useModernLayoutEffect,
  enableFocusInside,
  disableFocusInside,
  getPreviousTabbable,
  getNextTabbable,
  isOutsideEvent,
} from '@floating-ui/react/utils';

import {useId} from '../hooks/useId';
import type {OpenChangeReason} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {FocusGuard} from './FocusGuard';

// Special visually hidden styles for the aria-owns owner element
// to ensure owned element accessibility in iOS/Safari/VoiceControl.
// The owner element is an empty span, so most of the common visually hidden styles are not needed.
// See https://github.com/floating-ui/floating-ui/issues/3403
const HIDDEN_OWNER_STYLES: React.CSSProperties = {
  clipPath: 'inset(50%)',
  position: 'fixed',
  top: 0,
  left: 0,
};

type FocusManagerState = {
  modal: boolean;
  open: boolean;
  onOpenChange(open: boolean, event?: Event, reason?: OpenChangeReason): void;
  domReference: Element | null;
  closeOnFocusOut: boolean;
} | null;

const PortalContext = React.createContext<null | {
  preserveTabOrder: boolean;
  portalNode: HTMLElement | null;
  setFocusManagerState: React.Dispatch<React.SetStateAction<FocusManagerState>>;
  beforeInsideRef: React.RefObject<HTMLSpanElement>;
  afterInsideRef: React.RefObject<HTMLSpanElement>;
  beforeOutsideRef: React.RefObject<HTMLSpanElement>;
  afterOutsideRef: React.RefObject<HTMLSpanElement>;
}>(null);

const attr = createAttribute('portal');

export interface UseFloatingPortalNodeProps {
  id?: string;
  root?:
    | HTMLElement
    | ShadowRoot
    | null
    | React.MutableRefObject<HTMLElement | ShadowRoot | null>;
}

/**
 * @see https://floating-ui.com/docs/FloatingPortal#usefloatingportalnode
 */
export function useFloatingPortalNode(props: UseFloatingPortalNodeProps = {}) {
  const {id, root} = props;

  const uniqueId = useId();
  const portalContext = usePortalContext();

  const [portalNode, setPortalNode] = React.useState<HTMLElement | null>(null);

  const portalNodeRef = React.useRef<HTMLDivElement | null>(null);

  useModernLayoutEffect(() => {
    return () => {
      portalNode?.remove();
      // Allow the subsequent layout effects to create a new node on updates.
      // The portal node will still be cleaned up on unmount.
      // https://github.com/floating-ui/floating-ui/issues/2454
      queueMicrotask(() => {
        portalNodeRef.current = null;
      });
    };
  }, [portalNode]);

  useModernLayoutEffect(() => {
    // Wait for the uniqueId to be generated before creating the portal node in
    // React <18 (using `useFloatingId` instead of the native `useId`).
    // https://github.com/floating-ui/floating-ui/issues/2778
    if (!uniqueId) return;
    if (portalNodeRef.current) return;
    const existingIdRoot = id ? document.getElementById(id) : null;
    if (!existingIdRoot) return;

    const subRoot = document.createElement('div');
    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, '');
    existingIdRoot.appendChild(subRoot);
    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, uniqueId]);

  useModernLayoutEffect(() => {
    // Wait for the root to exist before creating the portal node. The root must
    // be stored in state, not a ref, for this to work reactively.
    if (root === null) return;
    if (!uniqueId) return;
    if (portalNodeRef.current) return;

    let container = root || portalContext?.portalNode;
    if (container && !isNode(container)) container = container.current;
    container = container || document.body;

    let idWrapper: HTMLDivElement | null = null;
    if (id) {
      idWrapper = document.createElement('div');
      idWrapper.id = id;
      container.appendChild(idWrapper);
    }

    const subRoot = document.createElement('div');

    subRoot.id = uniqueId;
    subRoot.setAttribute(attr, '');

    container = idWrapper || container;
    container.appendChild(subRoot);

    portalNodeRef.current = subRoot;
    setPortalNode(subRoot);
  }, [id, root, uniqueId, portalContext]);

  return portalNode;
}

export interface FloatingPortalProps {
  children?: React.ReactNode;
  /**
   * Optionally selects the node with the id if it exists, or create it and
   * append it to the specified `root` (by default `document.body`).
   */
  id?: string;
  /**
   * Specifies the root node the portal container will be appended to.
   */
  root?:
    | HTMLElement
    | ShadowRoot
    | null
    | React.MutableRefObject<HTMLElement | ShadowRoot | null>;
  /**
   * When using non-modal focus management using `FloatingFocusManager`, this
   * will preserve the tab order context based on the React tree instead of the
   * DOM tree.
   */
  preserveTabOrder?: boolean;
}

/**
 * Portals the floating element into a given container element — by default,
 * outside of the app root and into the body.
 * This is necessary to ensure the floating element can appear outside any
 * potential parent containers that cause clipping (such as `overflow: hidden`),
 * while retaining its location in the React tree.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export function FloatingPortal(props: FloatingPortalProps): React.JSX.Element {
  const {children, id, root, preserveTabOrder = true} = props;

  const portalNode = useFloatingPortalNode({id, root});
  const [focusManagerState, setFocusManagerState] =
    React.useState<FocusManagerState>(null);

  const beforeOutsideRef = React.useRef<HTMLSpanElement>(null);
  const afterOutsideRef = React.useRef<HTMLSpanElement>(null);
  const beforeInsideRef = React.useRef<HTMLSpanElement>(null);
  const afterInsideRef = React.useRef<HTMLSpanElement>(null);

  const modal = focusManagerState?.modal;
  const open = focusManagerState?.open;

  const shouldRenderGuards =
    // The FocusManager and therefore floating element are currently open/
    // rendered.
    !!focusManagerState &&
    // Guards are only for non-modal focus management.
    !focusManagerState.modal &&
    // Don't render if unmount is transitioning.
    focusManagerState.open &&
    preserveTabOrder &&
    !!(root || portalNode);

  // https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/TabbablePortal.tsx
  React.useEffect(() => {
    if (!portalNode || !preserveTabOrder || modal) {
      return;
    }

    // Make sure elements inside the portal element are tabbable only when the
    // portal has already been focused, either by tabbing into a focus trap
    // element outside or using the mouse.
    function onFocus(event: FocusEvent) {
      if (portalNode && isOutsideEvent(event)) {
        const focusing = event.type === 'focusin';
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    // Listen to the event on the capture phase so they run before the focus
    // trap elements onFocus prop is called.
    portalNode.addEventListener('focusin', onFocus, true);
    portalNode.addEventListener('focusout', onFocus, true);
    return () => {
      portalNode.removeEventListener('focusin', onFocus, true);
      portalNode.removeEventListener('focusout', onFocus, true);
    };
  }, [portalNode, preserveTabOrder, modal]);

  React.useEffect(() => {
    if (!portalNode) return;
    if (open) return;
    enableFocusInside(portalNode);
  }, [open, portalNode]);

  return (
    <PortalContext.Provider
      value={React.useMemo(
        () => ({
          preserveTabOrder,
          beforeOutsideRef,
          afterOutsideRef,
          beforeInsideRef,
          afterInsideRef,
          portalNode,
          setFocusManagerState,
        }),
        [preserveTabOrder, portalNode],
      )}
    >
      {shouldRenderGuards && portalNode && (
        <FocusGuard
          data-type="outside"
          ref={beforeOutsideRef}
          onFocus={(event) => {
            if (isOutsideEvent(event, portalNode)) {
              beforeInsideRef.current?.focus();
            } else {
              const domReference = focusManagerState
                ? focusManagerState.domReference
                : null;
              const prevTabbable = getPreviousTabbable(domReference);
              prevTabbable?.focus();
            }
          }}
        />
      )}
      {shouldRenderGuards && portalNode && (
        <span aria-owns={portalNode.id} style={HIDDEN_OWNER_STYLES} />
      )}
      {portalNode && ReactDOM.createPortal(children, portalNode)}
      {shouldRenderGuards && portalNode && (
        <FocusGuard
          data-type="outside"
          ref={afterOutsideRef}
          onFocus={(event) => {
            if (isOutsideEvent(event, portalNode)) {
              afterInsideRef.current?.focus();
            } else {
              const domReference = focusManagerState
                ? focusManagerState.domReference
                : null;
              const nextTabbable = getNextTabbable(domReference);
              nextTabbable?.focus();

              focusManagerState?.closeOnFocusOut &&
                focusManagerState?.onOpenChange(
                  false,
                  event.nativeEvent,
                  'focus-out',
                );
            }
          }}
        />
      )}
    </PortalContext.Provider>
  );
}

export const usePortalContext = () => React.useContext(PortalContext);
