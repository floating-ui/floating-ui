import * as React from 'react';

import type {ElementProps} from '../types';

function mergeProps(
  userProps: React.HTMLProps<Element> | undefined,
  propsList: Array<ElementProps | void>,
  elementKey: 'reference' | 'floating' | 'item'
): Record<string, unknown> {
  const map = new Map<string, Array<(...args: unknown[]) => void>>();

  return {
    ...(elementKey === 'floating' && {tabIndex: -1}),
    ...userProps,
    ...propsList
      .map((value) => (value ? value[elementKey] : null))
      .concat(userProps)
      .reduce((acc: Record<string, unknown>, props) => {
        if (!props) {
          return acc;
        }

        Object.entries(props).forEach(([key, value]) => {
          if (key.indexOf('on') === 0) {
            if (!map.has(key)) {
              map.set(key, []);
            }

            if (typeof value === 'function') {
              map.get(key)?.push(value);

              acc[key] = (...args: unknown[]) => {
                return map
                  .get(key)
                  ?.map((fn) => fn(...args))
                  .find((val) => val !== undefined);
              };
            }
          } else {
            acc[key] = value;
          }
        });

        return acc;
      }, {}),
  };
}

/**
 * Merges an array of interaction hooks' props into prop getters, allowing
 * event handler functions to be composed together without overwriting one
 * another.
 * @see https://floating-ui.com/docs/react#interaction-hooks
 */
export function useInteractions(propsList: Array<ElementProps | void> = []) {
  // The dependencies are a dynamic array, so we can't use the linter's
  // suggestion to add it to the deps array.
  const deps = propsList;

  const getReferenceProps = React.useCallback(
    (userProps?: React.HTMLProps<Element>) =>
      mergeProps(userProps, propsList, 'reference'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  const getFloatingProps = React.useCallback(
    (userProps?: React.HTMLProps<HTMLElement>) =>
      mergeProps(userProps, propsList, 'floating'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  const getItemProps = React.useCallback(
    (userProps?: React.HTMLProps<HTMLElement>) =>
      mergeProps(userProps, propsList, 'item'),
    // Granularly check for `item` changes, because the `getItemProps` getter
    // should be as referentially stable as possible since it may be passed as
    // a prop to many components. All `item` key values must therefore be
    // memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    propsList.map((key) => key?.item)
  );

  return React.useMemo(
    () => ({getReferenceProps, getFloatingProps, getItemProps}),
    [getReferenceProps, getFloatingProps, getItemProps]
  );
}
