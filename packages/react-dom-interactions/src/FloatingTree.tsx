import React, {createContext, useCallback, useContext, useRef} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {FloatingNodeType, FloatingTreeType} from './types';
import {useId} from './hooks/useId';
import {createPubSub} from './createPubSub';

const FloatingNodeContext = createContext<FloatingNodeType | null>(null);
const FloatingTreeContext = createContext<FloatingTreeType | null>(null);

export const useFloatingParentNodeId = () =>
  useContext(FloatingNodeContext)?.id ?? null;
export const useFloatingTree = () => useContext(FloatingTreeContext);

/**
 * Registers a node into the floating tree, returning its id.
 */
export const useFloatingNodeId = () => {
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
export const FloatingNode: React.FC<{id: string}> = ({children, id}) => {
  const parentId = useFloatingParentNodeId();
  return (
    <FloatingNodeContext.Provider value={{id, parentId}}>
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
export const FloatingTree: React.FC = ({children}) => {
  const nodesRef = useRef<Array<FloatingNodeType>>([]);

  const addNode = useCallback((node: FloatingNodeType) => {
    nodesRef.current = [...nodesRef.current, node];
  }, []);

  const removeNode = useCallback((node: FloatingNodeType) => {
    nodesRef.current = nodesRef.current.filter((n) => n !== node);
  }, []);

  return (
    <FloatingTreeContext.Provider
      value={{
        nodesRef,
        addNode,
        removeNode,
        events: createPubSub(),
      }}
    >
      {children}
    </FloatingTreeContext.Provider>
  );
};
