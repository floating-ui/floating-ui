import * as React from 'react';
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
  root = null,
}: {
  children?: React.ReactNode;
  id?: string;
  root?: HTMLElement | null;
}): React.ReactPortal | null => {
  const [mounted, setMounted] = React.useState(false);
  const portalRef = React.useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (root) {
      return;
    }

    const rootNode = document.getElementById(id);

    if (rootNode) {
      portalRef.current = rootNode;
    } else {
      portalRef.current = document.createElement('div');
      portalRef.current.id = id;
    }

    if (!document.body.contains(portalRef.current)) {
      document.body.appendChild(portalRef.current);
    }

    setMounted(true);
  }, [id, root]);

  if (root) {
    return createPortal(children, root);
  }

  if (mounted && portalRef.current) {
    return createPortal(children, portalRef.current);
  }

  return null;
};
