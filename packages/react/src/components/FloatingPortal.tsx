import * as React from 'react';
import {createPortal} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {useId} from '../hooks/useId';
import {FloatingContext} from '../types';
import {
  disableFocusInside,
  enableFocusInside,
  getNextTabbable,
  getPreviousTabbable,
  isOutsideEvent,
} from '../utils/tabbable';
import {FocusGuard, HIDDEN_STYLES} from './FocusGuard';

const FloatingPortalRootNodeContext = React.createContext<
  HTMLElement | null | string
>(null);

const useFloatingPortalRootNodeContext = () =>
  React.useContext(FloatingPortalRootNodeContext);

export const FloatingPortalRoot = ({
  root,
  children,
}: {
  root: HTMLElement | null | string;
  children: React.ReactNode;
}) => {
  return (
    <FloatingPortalRootNodeContext.Provider value={root}>
      {children}
    </FloatingPortalRootNodeContext.Provider>
  );
};

const resolveRootContainer = (id: HTMLElement | null | string) => {
  if (typeof id === 'string') {
    const node = document.getElementById(id);
    if (node) {
      return node;
    }
    const newNode = document.createElement('div');
    newNode.id = id;
    document.body.appendChild(newNode);
    return newNode;
  }
  return id || document.body;
};

type FocusManagerState =
  | (FloatingContext & {modal: boolean; closeOnFocusOut: boolean})
  | null;

const PortalContext = React.createContext<null | {
  preserveTabOrder: boolean;
  portalNode: HTMLElement | null;
  setFocusManagerState: React.Dispatch<React.SetStateAction<FocusManagerState>>;
  beforeInsideRef: React.RefObject<HTMLSpanElement>;
  afterInsideRef: React.RefObject<HTMLSpanElement>;
  beforeOutsideRef: React.RefObject<HTMLSpanElement>;
  afterOutsideRef: React.RefObject<HTMLSpanElement>;
}>(null);

export const useFloatingPortalNode = ({
  id,
  root,
  enabled = true,
}: {
  id?: string;
  root?: HTMLElement | null | string;
  enabled?: boolean;
} = {}) => {
  const [portalEl, setPortalEl] = React.useState<HTMLElement | null>(null);
  const uniqueId = useId();
  const portalContext = usePortalContext();
  const floatingPortalRootNodeContext = useFloatingPortalRootNodeContext();
  const portalRootNode = root || floatingPortalRootNodeContext;

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const rootNode = id ? document.getElementById(id) : null;

    if (rootNode) {
      rootNode.setAttribute('data-floating-ui-portal', '');
      setPortalEl(rootNode);
    } else {
      const newPortalEl = document.createElement('div');
      if (id !== '') {
        newPortalEl.id = id || uniqueId;
      }
      newPortalEl.setAttribute('data-floating-ui-portal', '');
      setPortalEl(newPortalEl);

      const container =
        portalContext?.portalNode || resolveRootContainer(portalRootNode);

      container.appendChild(newPortalEl);
      return () => {
        container.removeChild(newPortalEl);
      };
    }
  }, [id, portalContext, portalRootNode, uniqueId, enabled]);

  return portalEl;
};

/**
 * Portals the floating element into a given container element — by default,
 * outside of the app root and into the body.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export const FloatingPortal = ({
  children,
  id,
  root = null,
  preserveTabOrder = true,
}: {
  children?: React.ReactNode;
  /**
   * @deprecated use `FloatingPortalRoot` instead.
   */
  id?: string;
  root?: HTMLElement | null | string;
  preserveTabOrder?: boolean;
}) => {
  const portalNode = useFloatingPortalNode({id, root});
  const [focusManagerState, setFocusManagerState] =
    React.useState<FocusManagerState>(null);

  const beforeOutsideRef = React.useRef<HTMLSpanElement>(null);
  const afterOutsideRef = React.useRef<HTMLSpanElement>(null);
  const beforeInsideRef = React.useRef<HTMLSpanElement>(null);
  const afterInsideRef = React.useRef<HTMLSpanElement>(null);

  const shouldRenderGuards =
    // The FocusManager and therefore floating element are currently open/
    // rendered.
    !!focusManagerState &&
    // Guards are only for non-modal focus management.
    !focusManagerState.modal &&
    !!portalNode &&
    preserveTabOrder;

  // https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/TabbablePortal.tsx
  React.useEffect(() => {
    if (!portalNode || !preserveTabOrder || focusManagerState?.modal) {
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
  }, [portalNode, preserveTabOrder, focusManagerState?.modal]);

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
        [preserveTabOrder, portalNode]
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
              const prevTabbable =
                getPreviousTabbable() ||
                focusManagerState?.refs.domReference.current;
              prevTabbable?.focus();
            }
          }}
        />
      )}
      {shouldRenderGuards && portalNode && (
        <span aria-owns={portalNode.id} style={HIDDEN_STYLES} />
      )}
      {portalNode ? createPortal(children, portalNode) : null}
      {shouldRenderGuards && portalNode && (
        <FocusGuard
          data-type="outside"
          ref={afterOutsideRef}
          onFocus={(event) => {
            if (isOutsideEvent(event, portalNode)) {
              afterInsideRef.current?.focus();
            } else {
              const nextTabbable =
                getNextTabbable() ||
                focusManagerState?.refs.domReference.current;
              nextTabbable?.focus();
              focusManagerState?.closeOnFocusOut &&
                focusManagerState?.onOpenChange(false);
            }
          }}
        />
      )}
    </PortalContext.Provider>
  );
};

export const usePortalContext = () => React.useContext(PortalContext);
