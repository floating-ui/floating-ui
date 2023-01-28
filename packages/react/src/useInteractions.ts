import * as React from 'react';

import type {ElementProps} from './types';

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
                map.get(key)?.forEach((fn) => fn(...args));
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

export const useInteractions = (propsList: Array<ElementProps | void> = []) => {
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
    // `activeIndex` can change frequently, this allows the consumer to avoid
    // re-rendering all list items when memo'ing item components and placing
    // `getItemProps` as a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps.map((props) => props?.item)
  );

  return React.useMemo(
    () => ({getReferenceProps, getFloatingProps, getItemProps}),
    [getReferenceProps, getFloatingProps, getItemProps]
  );
};
