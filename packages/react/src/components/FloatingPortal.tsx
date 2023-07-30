import {isElement} from '@floating-ui/utils/dom';
import * as React from 'react';
import {createPortal} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {useId} from '../hooks/useId';
import type {ExtendedRefs} from '../types';
import {createAttribute} from '../utils/createAttribute';
import {
  disableFocusInside,
  enableFocusInside,
  getNextTabbable,
  getPreviousTabbable,
  isOutsideEvent,
} from '../utils/tabbable';
import {FocusGuard, HIDDEN_STYLES} from './FocusGuard';

type FocusManagerState = {
  modal: boolean;
  open: boolean;
  onOpenChange: (open: boolean, event: Event) => void;
  refs: ExtendedRefs<any>;
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

export function useFloatingPortalNode({
  id,
  root,
}: {
  id?: string;
  root?: HTMLElement | null | React.MutableRefObject<HTMLElement | null>;
} = {}) {
  const [portalNode, setPortalNode] = React.useState<HTMLElement | null>(null);

  const uniqueId = useId();
  const portalContext = usePortalContext();

  const data = React.useMemo(
    () => ({id, root, portalContext, uniqueId}),
    [id, root, portalContext, uniqueId]
  );

  const dataRef = React.useRef<typeof data>();

  useLayoutEffect(() => {
    return () => {
      portalNode?.remove();
    };
  }, [portalNode, data]);

  useLayoutEffect(() => {
    if (dataRef.current === data) return;

    dataRef.current = data;

    const {id, root, portalContext, uniqueId} = data;

    const existingIdRoot = id ? document.getElementById(id) : null;
    const attr = createAttribute('portal');

    if (existingIdRoot) {
      const subRoot = document.createElement('div');
      subRoot.id = uniqueId;
      subRoot.setAttribute(attr, '');
      existingIdRoot.appendChild(subRoot);
      setPortalNode(subRoot);
    } else {
      let container = root || portalContext?.portalNode;
      if (container && !isElement(container)) container = container.current;
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

      setPortalNode(subRoot);
    }
  }, [data]);

  return portalNode;
}

interface FloatingPortalProps {
  children?: React.ReactNode;
  id?: string;
  root?: HTMLElement | null | React.MutableRefObject<HTMLElement | null>;
  preserveTabOrder?: boolean;
}

/**
 * Portals the floating element into a given container element — by default,
 * outside of the app root and into the body.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export function FloatingPortal({
  children,
  id,
  root = null,
  preserveTabOrder = true,
}: FloatingPortalProps): JSX.Element {
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
    // Don't render if unmount is transitioning.
    focusManagerState.open &&
    preserveTabOrder &&
    !!(root || portalNode);

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
      {portalNode && createPortal(children, portalNode)}
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
                focusManagerState?.onOpenChange(false, event.nativeEvent);
            }
          }}
        />
      )}
    </PortalContext.Provider>
  );
}

export const usePortalContext = () => React.useContext(PortalContext);
