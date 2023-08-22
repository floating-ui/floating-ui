import {JSX} from 'solid-js';

import type {ElementProps} from '../types';

function mergeProps(
  userProps:
    | JSX.HTMLAttributes<HTMLElement>
    | JSX.HTMLAttributes<Element>
    | undefined,
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
  const getReferenceProps = (userProps?: JSX.HTMLAttributes<Element>) =>
    mergeProps(userProps, propsList, 'reference');

  const getFloatingProps = (userProps?: JSX.HTMLAttributes<HTMLElement>) =>
    mergeProps(userProps, propsList, 'floating');

  const getItemProps = (userProps?: JSX.HTMLAttributes<HTMLElement>) =>
    mergeProps(userProps, propsList, 'item');

  return () => ({getReferenceProps, getFloatingProps, getItemProps});
}
