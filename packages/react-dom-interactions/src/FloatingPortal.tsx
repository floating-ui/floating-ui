import * as React from 'react';
import {createPortal} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

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
}: {
  children?: React.ReactNode;
  id?: string;
  root?: HTMLElement | null;
}): React.ReactPortal | null => {
  const [mounted, setMounted] = React.useState(false);
  const portalNode = useFloatingPortalNode({id, enabled: !root});

  useLayoutEffect(() => {
    if (root) {
      return;
    }
    setMounted(true);
  }, [root]);

  if (root) {
    return createPortal(children, root);
  }

  if (mounted && portalNode) {
    return createPortal(children, portalNode);
  }

  return null;
};
