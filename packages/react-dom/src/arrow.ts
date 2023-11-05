import {arrow as arrowCore, Middleware, MiddlewareState, Padding} from '@floating-ui/dom';
import * as React from 'react';

export interface Options {
  /**
   * The arrow element to be positioned.
   * @default undefined
   */
  element: React.MutableRefObject<Element | null> | Element | null;
  /**
   * The padding between the arrow element and the floating element edges.
   * Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding;
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
export const arrow = (
  options: Options | ((state: MiddlewareState) => Options)
): Middleware => {
  function isRef(value: unknown): value is React.MutableRefObject<unknown> {
    return {}.hasOwnProperty.call(value, 'current');
  }

  return {
    name: 'arrow',
    options,
    fn(state) {
      const {element, padding} =
        typeof options === 'function' ? options(state) : options;

      if (element && isRef(element)) {
        if (element.current != null) {
          return arrowCore({element: element.current, padding}).fn(state);
        }

        return {};
      } else if (element) {
        return arrowCore({element, padding}).fn(state);
      }

      return {};
    },
  };
};
