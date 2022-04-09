import React, {useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

const DEFAULT_ID = 'floating-ui-root';

/**
 * Portals your floating element outside of the main app node.
 * @see https://floating-ui.com/docs/FloatingPortal
 */
export const FloatingPortal = ({
  children,
  id = DEFAULT_ID,
}: {
  children?: React.ReactNode;
  id?: string;
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
    return createPortal(children, portalRef.current);
  }

  return null;
};
