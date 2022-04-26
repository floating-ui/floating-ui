import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {FloatingNodeType, FloatingTreeType, ReferenceType} from './types';
import {useId} from './hooks/useId';
import {createPubSub} from './createPubSub';

const FloatingNodeContext = React.createContext<FloatingNodeType | null>(null);
const FloatingTreeContext = React.createContext<FloatingTreeType | null>(null);

export const useFloatingParentNodeId = (): string | null =>
  React.useContext(FloatingNodeContext)?.id ?? null;
export const useFloatingTree = <
  RT extends ReferenceType = ReferenceType
>(): FloatingTreeType<RT> | null =>
  React.useContext(FloatingTreeContext) as FloatingTreeType<RT> | null;

/**
 * Registers a node into the floating tree, returning its id.
 */
export const useFloatingNodeId = (): string => {
  const id = useId();
  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();

  useLayoutEffect(() => {
    const node = {id, parentId};
    tree?.addNode(node);
    return () => {
      tree?.removeNode(node);
    };
  }, [tree, id, parentId]);

  return id;
};

/**
 * Provides parent node context for nested floating elements.
 * @see https://floating-ui.com/docs/FloatingTree
 */
export const FloatingNode = ({
  children,
  id,
}: {
  children?: React.ReactNode;
  id: string;
}): JSX.Element => {
  const parentId = useFloatingParentNodeId();

  return (
    <FloatingNodeContext.Provider
      value={React.useMemo(() => ({id, parentId}), [id, parentId])}
    >
      {children}
    </FloatingNodeContext.Provider>
  );
};

/**
 * Provides context for nested floating elements when they are not children of
 * each other on the DOM (i.e. portalled to a common node, rather than their
 * respective parent).
 * @see https://floating-ui.com/docs/FloatingTree
 */
export const FloatingTree = ({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element => {
  const nodesRef = React.useRef<Array<FloatingNodeType>>([]);

  const addNode = React.useCallback((node: FloatingNodeType) => {
    nodesRef.current = [...nodesRef.current, node];
  }, []);

  const removeNode = React.useCallback((node: FloatingNodeType) => {
    nodesRef.current = nodesRef.current.filter((n) => n !== node);
  }, []);

  const events = React.useState(() => createPubSub())[0];

  return (
    <FloatingTreeContext.Provider
      value={React.useMemo(
        () => ({
          nodesRef,
          addNode,
          removeNode,
          events,
        }),
        [nodesRef, addNode, removeNode, events]
      )}
    >
      {children}
    </FloatingTreeContext.Provider>
  );
};
