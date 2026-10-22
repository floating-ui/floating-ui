import type {Derivable, Middleware, Padding} from '@floating-ui/dom';
import {arrow as arrowCore} from '@floating-ui/dom';
import type * as React from 'react';

export interface ArrowOptions {
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
  padding?: Padding | undefined;
}

function isRef(value: unknown): value is React.MutableRefObject<unknown> {
  return {}.hasOwnProperty.call(value, 'current');
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
export const arrow = (
  options: ArrowOptions | Derivable<ArrowOptions>,
): Middleware => ({
  name: 'arrow',
  options,
  fn(state) {
    const {element, padding} =
      typeof options === 'function' ? options(state) : options;
    const el = element && isRef(element) ? element.current : element;

    return el ? arrowCore({element: el, padding}).fn(state) : {};
  },
});
