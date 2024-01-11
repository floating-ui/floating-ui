import * as React from 'react';

import type {ElementProps} from '../types';

const ACTIVE_KEY = 'active';
const SELECTED_KEY = 'selected';

export type ExtendedUserProps = {
  [ACTIVE_KEY]?: boolean;
  [SELECTED_KEY]?: boolean;
};

function mergeProps<Key extends keyof ElementProps>(
  userProps: (React.HTMLProps<Element> & ExtendedUserProps) | undefined,
  propsList: Array<ElementProps | void>,
  elementKey: Key,
): Record<string, unknown> {
  const map = new Map<string, Array<(...args: unknown[]) => void>>();
  const isItem = elementKey === 'item';

  let domUserProps = userProps;
  if (isItem && userProps) {
    const {[ACTIVE_KEY]: _, [SELECTED_KEY]: __, ...validProps} = userProps;
    domUserProps = validProps;
  }

  return {
    ...(elementKey === 'floating' && {tabIndex: -1}),
    ...domUserProps,
    ...propsList
      .map((value) => {
        const propsOrGetProps = value ? value[elementKey] : null;
        if (typeof propsOrGetProps === 'function') {
          return userProps ? propsOrGetProps(userProps) : null;
        }
        return propsOrGetProps;
      })
      .concat(userProps)
      .reduce((acc: Record<string, unknown>, props) => {
        if (!props) {
          return acc;
        }

        Object.entries(props).forEach(([key, value]) => {
          if (isItem && [ACTIVE_KEY, SELECTED_KEY].includes(key)) {
            return;
          }

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
 * @see https://floating-ui.com/docs/useInteractions
 */
export function useInteractions(propsList: Array<ElementProps | void> = []) {
  // The dependencies are a dynamic array, so we can't use the linter's
  // suggestion to add it to the deps array.
  const deps = propsList;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  const getReferenceProps = React.useCallback(
    (userProps?: React.HTMLProps<Element>) =>
      mergeProps(userProps, propsList, 'reference'),
    deps,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  const getFloatingProps = React.useCallback(
    (userProps?: React.HTMLProps<HTMLElement>) =>
      mergeProps(userProps, propsList, 'floating'),
    deps,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  const getItemProps = React.useCallback(
    (
      userProps?: Omit<React.HTMLProps<HTMLElement>, 'selected' | 'active'> &
        ExtendedUserProps,
    ) => mergeProps(userProps, propsList, 'item'),
    // Granularly check for `item` changes, because the `getItemProps` getter
    // should be as referentially stable as possible since it may be passed as
    // a prop to many components. All `item` key values must therefore be
    // memoized.
    propsList.map((key) => key?.item),
  );

  return React.useMemo(
    () => ({getReferenceProps, getFloatingProps, getItemProps}),
    [getReferenceProps, getFloatingProps, getItemProps],
  );
}
