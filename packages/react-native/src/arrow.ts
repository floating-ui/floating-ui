import type {Derivable, Middleware, ArrowOptions} from '@floating-ui/core';
import {arrow as arrowCore} from '@floating-ui/core';

/**
 * A data provider that provides data to position an inner element of the
 * floating element (usually a triangle or caret) so that it is centered to the
 * reference element.
 * This wraps the core `arrow` middleware to allow React refs as the element.
 * @see https://floating-ui.com/docs/arrow
 */
export const arrow = (
  options: ArrowOptions | Derivable<ArrowOptions>,
): Middleware => {
  function isRef(value: unknown) {
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
      }

      if (element) {
        return arrowCore({element, padding}).fn(state);
      }

      return {};
    },
  };
};
