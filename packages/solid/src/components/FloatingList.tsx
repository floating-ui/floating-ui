import {ReactiveMap} from '@solid-primitives/map';
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  onCleanup,
  ParentProps,
  useContext,
} from 'solid-js';

function sortByDocumentPosition(a: Node, b: Node) {
  const position = a.compareDocumentPosition(b);

  if (
    position & Node.DOCUMENT_POSITION_FOLLOWING ||
    position & Node.DOCUMENT_POSITION_CONTAINED_BY
  ) {
    return -1;
  }

  if (
    position & Node.DOCUMENT_POSITION_PRECEDING ||
    position & Node.DOCUMENT_POSITION_CONTAINS
  ) {
    return 1;
  }

  return 0;
}

type TFloatingListContext = {
  register: (node: HTMLElement | null | undefined, label?: string) => void;
  unregister: (node: HTMLElement | null | undefined) => void;
  items: Accessor<Array<HTMLElement>>;
  labelsRef: Accessor<Array<string>>;
  getItemIndex: (node: HTMLElement | null | undefined) => number;
  parent: TFloatingListContext | null;
};

export const FloatingListContext = createContext<TFloatingListContext | null>(
  null,
);

export function createFloatingListContext(): TFloatingListContext {
  const itemsMap = new ReactiveMap<HTMLElement, string>();
  const parent = useUnsafeListItem();
  const register: TFloatingListContext['register'] = (node, label) => {
    if (!node || itemsMap.has(node)) return;
    itemsMap.set(node, label ?? node.textContent ?? '');
  };

  const unregister: TFloatingListContext['unregister'] = (node) => {
    if (!node) return;
    itemsMap.delete(node);
  };

  const items = createMemo(() =>
    Array.from(itemsMap.keys()).sort(sortByDocumentPosition),
  );

  const labelsRef = createMemo(() =>
    items().map((item) => itemsMap.get(item) ?? ''),
  );
  const getItemIndex: TFloatingListContext['getItemIndex'] = (node) => {
    if (!node) return -1;
    return items().indexOf(node);
  };

  return {
    items,
    register,
    unregister,
    labelsRef,
    getItemIndex,
    parent,
  };
}

/**
 *
 * @param ref Optional: provide Accessor of Element to automatically register and unregister
 * @param registerCondition Optional: provide condition. If true will register if false will unregister. Default register onMount unregister onCleanup (unmount)
 * @returns FloatingListContext
 */
export function useListItem(
  ref?: Accessor<HTMLElement | null>,
  options?: {
    registerCondition?: Accessor<boolean>;
    label: string;
  },
) {
  const context = useContext(FloatingListContext);
  if (!context)
    throw new Error(
      'useFloatingListContext must be used within a FloatingListContext',
    );

  const {register, unregister} = context;
  createEffect(() => {
    const node = ref?.();
    if (!node) return;
    const condition = options?.registerCondition ?? (() => true);
    if (condition()) return register(node, options?.label);
    unregister(node);
  });
  onCleanup(() => {
    const node = ref?.();
    node && context.unregister(node);
  });
  return context;
}
export const useUnsafeListItem = () => useContext(FloatingListContext);
export function FloatingList(
  props: ParentProps<{context: TFloatingListContext}>,
) {
  return (
    // eslint-disable-next-line solid/reactivity
    <FloatingListContext.Provider value={props.context}>
      {props.children}
    </FloatingListContext.Provider>
  );
}
