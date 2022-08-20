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

export const useInteractions = (
  propsList: Array<ElementProps | void> = []
) => ({
  getReferenceProps: (userProps?: React.HTMLProps<Element>) =>
    mergeProps(userProps, propsList, 'reference'),
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) =>
    mergeProps(userProps, propsList, 'floating'),
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) =>
    mergeProps(userProps, propsList, 'item'),
});
