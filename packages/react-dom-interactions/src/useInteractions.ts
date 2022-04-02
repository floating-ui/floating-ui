import React from 'react';
import type {ElementProps} from './types';

function reducePropsToArrayWithInitValue(userProps?: Record<string, any>) {
  return Object.entries(userProps ?? {}).reduce((acc: any, [key, value]) => {
    acc[key] = [value];
    return acc;
  }, {});
}

function mergeProps(
  userProps: Record<string, any> | undefined,
  propsList: Array<ElementProps | void>,
  elementKey: 'reference' | 'floating'
) {
  const mergePropsMap: {
    reference: Record<string, Array<(...args: any[]) => void>>;
    floating: Record<string, Array<(...args: any[]) => void>>;
  } = {
    reference:
      elementKey === 'reference'
        ? reducePropsToArrayWithInitValue(userProps)
        : {},
    floating:
      elementKey === 'floating'
        ? reducePropsToArrayWithInitValue(userProps)
        : {},
  };

  propsList.forEach((props) => {
    const elementProps = ((props && props[elementKey]) ??
      {}) as React.HTMLProps<Element>;

    (
      Object.keys(elementProps) as Array<keyof React.HTMLProps<Element>>
    ).forEach((propKey) => {
      if (typeof elementProps[propKey] === 'function') {
        if (mergePropsMap[elementKey][propKey] == null) {
          mergePropsMap[elementKey][propKey] = [];
        }

        mergePropsMap[elementKey][propKey]?.push(elementProps[propKey]);
      }
    });
  });

  return {
    ...(elementKey === 'floating' && {tabIndex: -1}),
    ...userProps,
    ...propsList.reduce((acc, props) => {
      props && Object.assign(acc, props[elementKey]);
      return acc;
    }, {}),
    ...Object.entries(mergePropsMap[elementKey]).reduce(
      (acc: any, [prop, fns]) => {
        if (prop.indexOf('on') === 0) {
          acc[prop] = (...args: any[]) => {
            fns.forEach((fn) => fn(...args));
          };
        }

        return acc;
      },
      {}
    ),
  };
}

export const useInteractions = (
  propsList: Array<ElementProps | void> = []
) => ({
  getReferenceProps: (userProps?: React.HTMLProps<Element>) =>
    mergeProps(userProps, propsList, 'reference'),
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) =>
    mergeProps(userProps, propsList, 'floating'),
});
