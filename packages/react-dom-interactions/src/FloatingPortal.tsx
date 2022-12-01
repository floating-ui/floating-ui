import * as React from 'react';
import {createPortal} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import {useId} from './hooks/useId';
import {FloatingContext} from './types';
import {FocusGuard, HIDDEN_STYLES} from './utils/FocusGuard';
import {
  disableFocusInside,
  enableFocusInside,
  getNextTabbable,
  getPreviousTabbable,
  isOutsideEvent,
} from './utils/tabbable';

const PortalContext = React.createContext<null | {
  preserveTabOrder: boolean;
  portalNode: HTMLElement | null;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  beforeInsideRef: React.RefObject<HTMLSpanElement>;
  afterInsideRef: React.RefObject<HTMLSpanElement>;
  beforeOutsideRef: React.RefObject<HTMLSpanElement>;
  afterOutsideRef: React.RefObject<HTMLSpanElement>;
  contextRef?: React.RefObject<FloatingContext>;
}>(null);

export const useFloatingPortalNode = ({
  id,
  enabled = true,
}: {
  id?: string;
  enabled?: boolean;
} = {}) => {
  const [portalEl, setPortalEl] = React.useState<HTMLElement | null>(null);
  const uniqueId = useId();

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const rootNode = id ? document.getElementById(id) : null;

    if (rootNode) {
      setPortalEl(rootNode);
    } else {
      const newPortalEl = document.createElement('div');
      newPortalEl.id = id ?? uniqueId;
      newPortalEl.setAttribute('data-floating-ui-portal', '');
      setPortalEl(newPortalEl);
      document.body.appendChild(newPortalEl);
      return () => {
        document.body.removeChild(newPortalEl);
      };
    }
  }, [id, uniqueId, enabled]);

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
  const [modal, setModal] = React.useState(true);

  const beforeOutsideRef = React.useRef<HTMLSpanElement>(null);
  const afterOutsideRef = React.useRef<HTMLSpanElement>(null);
  const beforeInsideRef = React.useRef<HTMLSpanElement>(null);
  const afterInsideRef = React.useRef<HTMLSpanElement>(null);
  const contextRef = React.useRef<FloatingContext>(null);

  const shouldRenderGuards =
    !!children && !!(root || portalNode) && preserveTabOrder && !modal;

  // https://codesandbox.io/s/tabbable-portal-f4tng?file=/src/TabbablePortal.tsx
  React.useEffect(() => {
    if (!portalNode) {
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
  }, [portalNode]);

  return (
    <PortalContext.Provider
      value={React.useMemo(
        () => ({
          preserveTabOrder,
          beforeOutsideRef,
          afterOutsideRef,
          beforeInsideRef,
          afterInsideRef,
          setModal,
          portalNode,
          contextRef,
        }),
        [preserveTabOrder, portalNode]
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
                contextRef.current?.refs.domReference.current;
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
                contextRef.current?.refs.domReference.current;
              nextTabbable?.focus();
              contextRef.current?.onOpenChange(false);
            }
          }}
        />
      )}
    </PortalContext.Provider>
  );
};

export const usePortalContext = () => React.useContext(PortalContext);
