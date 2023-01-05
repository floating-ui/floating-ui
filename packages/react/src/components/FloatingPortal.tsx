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

const PortalContext = React.createContext<null | {
  preserveTabOrder: boolean;
  portalNode: HTMLElement | null;
  setFocusManagerState: React.Dispatch<
    React.SetStateAction<(FloatingContext & {modal: boolean}) | null>
  >;
  beforeInsideRef: React.RefObject<HTMLSpanElement>;
  afterInsideRef: React.RefObject<HTMLSpanElement>;
  beforeOutsideRef: React.RefObject<HTMLSpanElement>;
  afterOutsideRef: React.RefObject<HTMLSpanElement>;
  shouldRenderGuards: boolean;
}>(null);

const DEFAULT_ID = 'floating-ui-root';

export const useFloatingPortalNode = ({
  id = DEFAULT_ID,
  enabled = true,
}: {
  id?: string;
  enabled?: boolean;
} = {}) => {
  const [portalEl, setPortalEl] = React.useState<HTMLElement | null>(null);
  const uniqueId = useId();
  const portalContext = usePortalContext();

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    let rootNode = id ? document.getElementById(id) : null;

    if (!rootNode) {
      const newPortalEl = document.createElement('div');
      newPortalEl.id = id;

      const container = portalContext?.portalNode || document.body;
      // TODO: this should be cleaned up as well?
      container.appendChild(newPortalEl);

      rootNode = newPortalEl;
    }

    // TODO: In case of a Tooltip that does not have any focus handling, the floating element subroot is unnnecessary.
    // this condition is not correct, would likely have to be a new prop on FloatingPortal passed in here.

    // if (portalContext?.shouldRenderGuards) {
    const newPortalEl = document.createElement('div');
    newPortalEl.id = uniqueId;
    newPortalEl.setAttribute('data-floating-ui-portal', '');
    setPortalEl(newPortalEl);

    // TODO: not sure about this logic - I think it should actually prefer the custom root node, if that is specified?
    // In case of a Drawer that is opened from a portaled Popover, for example - it should still append the drawer to the custom root.
    const container = portalContext?.portalNode || rootNode;
    container.appendChild(newPortalEl);

    return () => {
      container.removeChild(newPortalEl);
    };
    // } else {
    //   setPortalEl(rootNode);
    // }
  }, [id, portalContext, uniqueId, enabled]);

  return portalEl;
};

/**
 * Portals your floating element outside of the main app node.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export const FloatingPortal = ({
  children,
  id,
  root = null,
  preserveTabOrder = true,
}: {
  children?: React.ReactNode;
  id?: string;
  root?: HTMLElement | null;
  preserveTabOrder?: boolean;
}) => {
  const portalNode = useFloatingPortalNode({id, enabled: !root});
  const [focusManagerState, setFocusManagerState] = React.useState<
    (FloatingContext & {modal: boolean}) | null
  >(null);

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
    !!(root || portalNode) &&
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
          shouldRenderGuards,
          setFocusManagerState,
        }),
        [preserveTabOrder, portalNode, shouldRenderGuards]
      )}
    >
      {shouldRenderGuards && portalNode && (
        <FocusGuard
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
      {root
        ? createPortal(children, root)
        : portalNode
        ? createPortal(children, portalNode)
        : null}
      {shouldRenderGuards && portalNode && (
        <FocusGuard
          ref={afterOutsideRef}
          onFocus={(event) => {
            if (isOutsideEvent(event, portalNode)) {
              afterInsideRef.current?.focus();
            } else {
              const nextTabbable =
                getNextTabbable() ||
                focusManagerState?.refs.domReference.current;
              nextTabbable?.focus();
              focusManagerState?.onOpenChange(false);
            }
          }}
        />
      )}
    </PortalContext.Provider>
  );
};

export const usePortalContext = () => React.useContext(PortalContext);
