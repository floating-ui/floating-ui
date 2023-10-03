import {
  Accessor,
  createContext,
  createMemo,
  createSignal,
  JSX,
  onCleanup,
  onMount,
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

function areMapsEqual(
  map1: Map<Node, number | null>,
  map2: Map<Node, number | null>
) {
  if (map1.size !== map2.size) {
    return false;
  }
  for (const [key, value] of map1.entries()) {
    if (value !== map2.get(key)) {
      return false;
    }
  }
  return true;
}

export const FloatingListContext = createContext<{
  register: (node: HTMLElement) => void;
  unregister: (node: HTMLElement) => void;
  map: Accessor<Array<HTMLElement | null>>;
  elementsRef: Accessor<Array<HTMLElement | null>>;
  labelsRef?: Array<string | null>;
  // map: Accessor<Map<Node, number | null>>;
  // map: Map<Node, number | null>;
}>({
  register: () => {},
  unregister: () => {},
  map: () => [],
  elementsRef: () => [],
});

interface FloatingListProps {
  elementsRef: Array<HTMLElement>;
  labelsRef?: Array<string>;
}

/**
 * Provides context for a list of items within the floating element.
 * @see https://floating-ui.com/docs/FloatingList
 */
export function FloatingList(
  // 	{
  //   children,
  //   elementsRef,
  //   labelsRef,
  // }
  props: ParentProps //<FloatingListProps>
): JSX.Element {
  // const [map, setMap] = createSignal(new Map<Node, number | null>());
  // const map = new ReactiveMap<HTMLElement, number | null>();
  // const register = (node: HTMLElement) => {
  //   map.set(node, null);
  // };

  // const unregister = (node: HTMLElement) => {
  //   map.delete(node);
  // };
  const [map, setMap] = createSignal<Array<HTMLElement>>([]);
  const register = (node: HTMLElement) => {
    setMap((prev) => [...prev, node].sort(sortByDocumentPosition));
  };

  const unregister = (node: HTMLElement) => {
    setMap((prev) => [...prev.filter((o) => o !== node)]);
  };

  // createEffect(() => {
  //   const newMap = new Map(map);
  //   const nodes = Array.from(newMap.keys()).sort(sortByDocumentPosition);

  //   nodes.forEach((node, index) => {
  //     newMap.set(node, index);
  //   });

  //   if (!areMapsEqual(map, newMap)) {
  //     map(newMap);
  //   }
  // });
  // const elementsRef = createMemo(() => Array.from(map.keys()));
  return (
    <FloatingListContext.Provider
      value={{
        register,
        unregister,
        map,
        elementsRef: map,
        // labelsRef: props.labelsRef,
      }}
    >
      {props.children}
    </FloatingListContext.Provider>
  );
}
export default FloatingList;

export interface UseListItemProps {
  label?: string | null;
}

// export function useListItem({label}: UseListItemProps = {}): Accessor<{
//   ref: Accessor<HTMLElement>;
//   index: number;
// }> {
//   const [index, setIndex] = createSignal<number | null>(null);
//   // const [item, setItem] = createSignal<Node|null>(null);
//   // const [list, setList] = createSignal<Array<Node>>([]);
//   // const addToList = (item:Node) => {
//   // 		if (!list().includes(item)) setList(prev =>[...prev, item]);
//   // }
//   // const removeFromList = (item:Node) => {
//   // 		if (list().includes(item)) setList(prev => [...prev.filter(i => i !== item)]);
//   // }
//   let componentRef: Node | null = null;
//   const context = useContext(FloatingListContext);
//   const {
//     register,
//     unregister,
//     // map, elementsRef, labelsRef
//   } = context;

//   const ref = (node: HTMLElement | null) => {
//     console.log('####################################    REF');

//     componentRef = node;
//     // node && addToList(node);
//     const indexRef = index();
//     if (indexRef !== null) {
//       context.elementsRef[indexRef] = node;
//       console.log('useListItem: context.elementsRef', {
//         elementsRef: context.elementsRef,
//         indexRef,
//       });
//       if (context.labelsRef) {
//         const isLabelDefined = label !== undefined;
//         context.labelsRef[indexRef] = isLabelDefined
//           ? label
//           : node?.textContent ?? null;
//       }
//     }
//   };
//   // onCleanup(()=> removeFromList(componentRef))
//   createEffect(() => {
//     const node = componentRef;
//     console.log('useListItem: componentRef', {
//       componentRef,
//       node,
//       // id: node?.ATTRIBUTE_NODE.,
//     });
//     if (node) {
//       register(node);
//     }
//     onCleanup(() => {
//       node && unregister(node);
//     });
//   });

//   createEffect(() => {
//     const index = componentRef ? context.map.get(componentRef) : null;
//     if (index != null) {
//       setIndex(index);
//     }
//   });

//   return () => ({
//     ref,
//     index: index() == null ? -1 : (index() as number),
//   });
// }

export function useListItem(ref: Accessor<HTMLElement | null>) {
  const listItemContext = useContext(FloatingListContext);
  onMount(() => {
    const itemRef = ref();
    itemRef && listItemContext.register(itemRef);
  });
  onCleanup(() => {
    const itemRef = ref();
    itemRef && listItemContext.unregister(itemRef);
  });
  const idx = createMemo(() => {
    const itemRef = ref();
    const index = itemRef ? listItemContext.map().indexOf(itemRef) : null;
    itemRef &&
      console.log({
        ref: ref(),
        idx: listItemContext.map().indexOf(itemRef),
        map: listItemContext.map,
      });
    return index ?? null;
  });

  return idx;
}

export function useFloatingList() {
  return useContext(FloatingListContext);
}

export function useList() {
  const [items, setItems] = createSignal<Array<HTMLElement>>([]);
  const register = (node: HTMLElement) => {
    setItems((prev) => [...prev, node].sort(sortByDocumentPosition));
  };

  const unregister = (node: HTMLElement) => {
    setItems((prev) => [...prev.filter((o) => o !== node)]);
  };

  return {
    items,
    register,
    unregister,
  };
}
