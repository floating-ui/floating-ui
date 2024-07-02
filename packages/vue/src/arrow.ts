import type {Middleware} from '@floating-ui/dom';
import {arrow as apply} from '@floating-ui/dom';

import type {ArrowOptions} from './types';
import {unwrapElement} from './utils/unwrapElement';
import {toValue} from './utils/toValue';

/**
 * Positions an inner element of the floating element such that it is centered to the reference element.
 * @param options The arrow options.
 * @see https://floating-ui.com/docs/arrow
 */
export function arrow(options: ArrowOptions): Middleware {
  return {
    name: 'arrow',
    options,
    fn(args) {
      const element = unwrapElement(toValue(options.element));

      if (element == null) {
        return {};
      }

      return apply({element, padding: options.padding}).fn(args);
    },
  };
}
