import {ReactiveMap} from '@solid-primitives/map';
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  mergeProps,
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

interface IFloatingListContext {
  register: (node: HTMLElement | null | undefined, label?: string) => void;
  unregister: (node: HTMLElement | null | undefined) => void;
  items: Accessor<Array<HTMLElement>>;
  labelsRef: Accessor<Array<string>>;
  getItemIndex: (node: HTMLElement | null | undefined) => number;
  parent: IFloatingListContext | null;
}
type GenericContext<T> = T & IFloatingListContext;
export const FloatingListContext =
  createContext<GenericContext<IFloatingListContext> | null>(null);
/**
 *
 * @param props optional: pass custom functions to access through useListItem() in children of FloatingList
 * @returns FloatingListContext extended by props which has to be passed to FloatingList as prop `context`
 */
export function createFloatingListContext<T>(props?: T) {
  const itemsMap = new ReactiveMap<HTMLElement, string>();
  const parent = useUnsafeListItem<T>();
  const register: IFloatingListContext['register'] = (node, label) => {
    if (!node || itemsMap.has(node)) return;
    itemsMap.set(node, label ?? node.textContent ?? '');
  };

  const unregister: IFloatingListContext['unregister'] = (node) => {
    if (!node) return;
    itemsMap.delete(node);
  };

  const items = createMemo(() =>
    Array.from(itemsMap.keys()).sort(sortByDocumentPosition),
  );

  const labelsRef = createMemo(() =>
    items().map((item) => itemsMap.get(item) ?? ''),
  );
  const getItemIndex: IFloatingListContext['getItemIndex'] = (node) => {
    if (!node) return -1;
    return items().indexOf(node);
  };

  // eslint-disable-next-line solid/reactivity
  return mergeProps(props, {
    items,
    register,
    unregister,
    labelsRef,
    getItemIndex,
    parent,
  } as IFloatingListContext);
}

/**
 *
 * @param ref Optional: provide Accessor of Element to automatically register and unregister
 * @param registerCondition Optional: provide condition. If true will register if false will unregister. Default register onMount unregister onCleanup (unmount)
 * @returns FloatingListContext extended by props which has to be passed to FloatingList as prop `context`
 * @example
 * const listContext = useListItem<{activeIndex:Accessor<number>}>(ref, {registerCondition: () => !isLoggedIn()}
 */
export function useListItem<T>(
  ref?: Accessor<HTMLElement | null>,
  options?: {
    registerCondition?: Accessor<boolean>;
    label?: string;
  },
) {
  const context = useFloatingListContext<T>();
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
export function useUnsafeListItem<T>() {
  return useContext(
    //@ts-ignore - because it won't allow
    FloatingListContext as unknown,
  ) as GenericContext<T>;
}

function useFloatingListContext<T>() {
  const context = useContext<GenericContext<T>>(
    //@ts-ignore - because it won't allow unknown
    FloatingListContext as unknown,
  ) as GenericContext<T>;
  if (!context)
    throw new Error(
      'useFloatingListContext must be used within a FloatingListContext',
    );
  return context;
}

type GenericFloatingList<T> = {context: GenericContext<T>};
/**
 *
 * @param props.context FloatingListContext actions created with createFloatingListContext
 *
 * @returns children wrapped in FloatingListContext.Provider
 */
export function FloatingList<T extends IFloatingListContext>(
  props: ParentProps<GenericFloatingList<T>>,
) {
  return (
    // eslint-disable-next-line solid/reactivity
    <FloatingListContext.Provider value={props.context}>
      {props.children}
    </FloatingListContext.Provider>
  );
}
