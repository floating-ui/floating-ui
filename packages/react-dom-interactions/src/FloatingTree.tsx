import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {FloatingNodeType, FloatingTreeType, ReferenceType} from './types';
import {useId} from './hooks/useId';
import {createPubSub} from './createPubSub';

const FloatingNodeContext = createContext<FloatingNodeType | null>(null);
const FloatingTreeContext = createContext<FloatingTreeType | null>(null);

export const useFloatingParentNodeId = (): string | null =>
  useContext(FloatingNodeContext)?.id ?? null;
export const useFloatingTree = <
  RT extends ReferenceType = ReferenceType
>(): FloatingTreeType<RT> | null =>
  useContext(FloatingTreeContext) as FloatingTreeType<RT> | null;

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
}) => {
  const parentId = useFloatingParentNodeId();

  return (
    <FloatingNodeContext.Provider
      value={useMemo(() => ({id, parentId}), [id, parentId])}
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
export const FloatingTree = ({children}: {children?: React.ReactNode}) => {
  const nodesRef = useRef<Array<FloatingNodeType>>([]);

  const addNode = useCallback((node: FloatingNodeType) => {
    nodesRef.current = [...nodesRef.current, node];
  }, []);

  const removeNode = useCallback((node: FloatingNodeType) => {
    nodesRef.current = nodesRef.current.filter((n) => n !== node);
  }, []);

  const events = useState(() => createPubSub())[0];

  return (
    <FloatingTreeContext.Provider
      value={useMemo(
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
