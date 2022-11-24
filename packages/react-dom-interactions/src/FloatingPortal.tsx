import * as React from 'react';
import {createPortal} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import {FocusGuard, HIDDEN_STYLES} from './utils/FocusGuard';

type ManagerRef = null | {
  handleBeforeOutside: () => void;
  handleAfterOutside: () => void;
};

const PortalContext = React.createContext<null | {
  preserveTabOrder: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  beforeInsideRef: React.RefObject<HTMLSpanElement>;
  afterInsideRef: React.RefObject<HTMLSpanElement>;
  beforeOutsideRef: React.RefObject<HTMLSpanElement>;
  afterOutsideRef: React.RefObject<HTMLSpanElement>;
  managerRef: React.MutableRefObject<ManagerRef>;
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

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const rootNode = document.getElementById(id);

    if (rootNode) {
      setPortalEl(rootNode);
    } else {
      const newPortalEl = document.createElement('div');
      newPortalEl.id = id;
      setPortalEl(newPortalEl);

      if (!document.body.contains(newPortalEl)) {
        document.body.appendChild(newPortalEl);
      }
    }
  }, [id, enabled]);

  return portalEl;
};

/**
 * Portals your floating element outside of the main app node.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export const FloatingPortal = ({
  children,
  id = DEFAULT_ID,
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
  const managerRef = React.useRef<ManagerRef>(null);

  const renderGuards =
    !!children && !!(root || portalNode) && preserveTabOrder && !modal;

  return (
    <PortalContext.Provider
      value={React.useMemo(
        () => ({
          preserveTabOrder,
          beforeOutsideRef,
          afterOutsideRef,
          beforeInsideRef,
          afterInsideRef,
          managerRef,
          setModal,
        }),
        [preserveTabOrder]
      )}
    >
      {renderGuards && (
        <FocusGuard
          ref={beforeOutsideRef}
          onFocus={() => {
            managerRef.current?.handleBeforeOutside();
          }}
        />
      )}
      {renderGuards && (
        <span aria-owns={portalNode?.id} style={HIDDEN_STYLES} />
      )}
      {root
        ? createPortal(children, root)
        : portalNode
        ? createPortal(children, portalNode)
        : null}
      {renderGuards && (
        <FocusGuard
          ref={afterOutsideRef}
          onFocus={() => {
            managerRef.current?.handleAfterOutside();
          }}
        />
      )}
    </PortalContext.Provider>
  );
};

export const usePortalContext = () => React.useContext(PortalContext);
