import {arrow as apply, Middleware} from '@floating-ui/dom';

import {ArrowOptions} from './types';
/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 *
 * @see https://floating-ui.com/docs/arrow
 */
export function arrow(options: ArrowOptions): Middleware {
  console.log(options);
  return {
    name: 'arrow',
    options,
    fn(args) {
      if (options.element() == null || options.element() == undefined) {
        return {};
      }

      return apply({
        element: options.element() as HTMLElement,
        padding: options.padding,
      }).fn(args);
    },
  };
}
