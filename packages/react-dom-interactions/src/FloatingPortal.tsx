import React, {createContext, useContext, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

const DEFAULT_ID = 'floating-ui-root';

const FloatingPortalContext = createContext(DEFAULT_ID);

export const useFloatingPortalId = () => useContext(FloatingPortalContext);

/**
 * Portals your floating element outside of the main app node.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export const FloatingPortal: React.FC<{id?: string}> = ({
  children,
  id = DEFAULT_ID,
}) => {
  const [mounted, setMounted] = useState(false);
  const portalRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = document.getElementById(id) as HTMLDivElement | null;

    if (root) {
      portalRef.current = root;
    } else {
      portalRef.current = document.createElement('div');
      portalRef.current.id = id;
    }

    const el = portalRef.current;
    if (!document.body.contains(el)) {
      document.body.appendChild(el);
    }

    setMounted(true);
  }, [id]);

  if (mounted && portalRef.current) {
    return (
      <FloatingPortalContext.Provider value={id}>
        {createPortal(children, portalRef.current)}
      </FloatingPortalContext.Provider>
    );
  }

  return null;
};
