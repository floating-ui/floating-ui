import {
  Accessor,
  createContext,
  createMemo,
  createUniqueId,
  JSX,
  onCleanup,
  onMount,
  ParentProps,
  useContext,
} from 'solid-js';

import type {FloatingNodeType, FloatingTreeType, ReferenceType} from '../types';
import {createPubSub} from '../utils/createPubSub';

const FloatingNodeContext = createContext<Accessor<FloatingNodeType> | null>(
  null
);

const FloatingTreeContext = createContext<Accessor<FloatingTreeType> | null>(
  null
);
export const useFloatingNodeContext = () => {
  const context = useContext(FloatingNodeContext);
  if (!context) {
    throw new Error(
      'useFloatingNodeContext must be used within a FloatingNodeContext.Provider'
    );
  }
  return context;
};

export const useFloatingTree = <R extends ReferenceType = ReferenceType>() => {
  const context = useContext(FloatingTreeContext) as Accessor<
    FloatingTreeType<R>
  > | null;
  if (!context) {
    throw new Error(
      'useFloatingTreeContext must be used within a FloatingTreeContext.Provider'
    );
  }
  return context;
};

export const useFloatingParentNodeId = (): string | null => {
  const context = useContext(FloatingNodeContext);
  if (!context) return null;
  return context().id;
};

/**
 * Registers a node into the floating tree, returning its id.
 */
export function useFloatingNodeId(customParentId?: string): string {
  const id = createUniqueId();
  const tree = useFloatingTree();
  const reactParentId = useFloatingParentNodeId();

  const node = createMemo(() => {
    return {id, parentId: customParentId || reactParentId};
  });
  onMount(() => tree()?.addNode(node()));
  onCleanup(() => tree()?.removeNode(node()));
  return id;
}

/**
 * Provides parent node context for nested floating elements.
 * @see https://floating-ui.com/docs/FloatingTree
 */
export function FloatingNode(props: ParentProps & {id: string}): JSX.Element {
  const parentId = useFloatingParentNodeId();
  const value = createMemo(() => {
    return {id: props.id, parentId};
  });
  return (
    <FloatingNodeContext.Provider value={value}>
      {props.children}
    </FloatingNodeContext.Provider>
  );
}

/**
 * Provides context for nested floating elements when they are not children of
 * each other on the DOM (i.e. portalled to a common node, rather than their
 * respective parent).
 * @see https://floating-ui.com/docs/FloatingTree
 */
export function FloatingTree(props: ParentProps): JSX.Element {
  let nodesRef: Array<FloatingNodeType> = [];

  const addNode = (node: FloatingNodeType) => {
    nodesRef = [...nodesRef, node];
  };

  const removeNode = (node: FloatingNodeType) => {
    nodesRef = [...nodesRef.filter((n) => n !== node)];
  };

  const events = createPubSub();

  return (
    <FloatingTreeContext.Provider
      value={() => ({
        nodesRef,
        addNode,
        removeNode,
        events,
      })}
    >
      {props.children}
    </FloatingTreeContext.Provider>
  );
}
