import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

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

export const FloatingListContext = React.createContext<{
  register: (node: Node) => void;
  unregister: (node: Node) => void;
  map: Map<Node, number | null>;
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>;
  labelsRef?: React.MutableRefObject<Array<string | null>>;
}>({
  register: () => {},
  unregister: () => {},
  map: new Map(),
  elementsRef: {current: []},
});

interface FloatingListProps {
  children: React.ReactNode;
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>;
  labelsRef?: React.MutableRefObject<Array<string | null>>;
}

/**
 * Provides context for a list of items within the floating element.
 * @see https://floating-ui.com/docs/FloatingList
 */
export function FloatingList({
  children,
  elementsRef,
  labelsRef,
}: FloatingListProps): JSX.Element {
  const [map, setMap] = React.useState(() => new Map<Node, number | null>());

  const register = React.useCallback((node: Node) => {
    setMap((prevMap) => new Map(prevMap).set(node, null));
  }, []);

  const unregister = React.useCallback((node: Node) => {
    setMap((prevMap) => {
      const map = new Map(prevMap);
      map.delete(node);
      return map;
    });
  }, []);

  useLayoutEffect(() => {
    const newMap = new Map(map);
    const nodes = Array.from(newMap.keys()).sort(sortByDocumentPosition);

    nodes.forEach((node, index) => {
      newMap.set(node, index);
    });

    if (!areMapsEqual(map, newMap)) {
      setMap(newMap);
    }
  }, [map]);

  return (
    <FloatingListContext.Provider
      value={React.useMemo(
        () => ({register, unregister, map, elementsRef, labelsRef}),
        [register, unregister, map, elementsRef, labelsRef]
      )}
    >
      {children}
    </FloatingListContext.Provider>
  );
}

export interface UseListItemProps {
  label?: string | null;
}

export function useListItem({label}: UseListItemProps = {}): {
  ref: (node: HTMLElement | null) => void;
  index: number;
} {
  const [index, setIndex] = React.useState<number | null>(null);
  const componentRef = React.useRef<Node | null>(null);
  const {register, unregister, map, elementsRef, labelsRef} =
    React.useContext(FloatingListContext);

  const ref = React.useCallback(
    (node: HTMLElement | null) => {
      componentRef.current = node;

      if (index !== null) {
        elementsRef.current[index] = node;
        if (labelsRef) {
          const isLabelDefined = label !== undefined;
          labelsRef.current[index] = isLabelDefined
            ? label
            : node?.textContent ?? null;
        }
      }
    },
    [index, elementsRef, labelsRef, label]
  );

  useLayoutEffect(() => {
    const node = componentRef.current;
    if (node) {
      register(node);
      return () => {
        unregister(node);
      };
    }
  }, [register, unregister]);

  useLayoutEffect(() => {
    const index = componentRef.current ? map.get(componentRef.current) : null;
    if (index != null) {
      setIndex(index);
    }
  }, [map]);

  return React.useMemo(
    () => ({
      ref,
      index: index == null ? -1 : index,
    }),
    [index, ref]
  );
}
