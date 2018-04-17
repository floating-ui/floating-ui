// @flow
import type { JQueryWrapper, State, Options } from "./types";
import unwrapJqueryElement from "./utils/unwrapJqueryElement";
import orderModifiers from "./utils/orderModifiers";

export default class Popper {
  state: State = {
    reference: undefined,
    popper: undefined,
    orderedModifiers: []
  };

  constructor(
    reference: Element | JQueryWrapper,
    popper: Element | JQueryWrapper,
    options: Options
  ) {
    // Unwrap `reference` and `popper` elements in case they are
    // wrapped by jQuery, otherwise consume them as is
    this.state.reference = unwrapJqueryElement(reference);
    this.state.popper = unwrapJqueryElement(popper);

    // Validate `reference` and `popper` elements
    // this will get stripped in production to reduce the final bundle size
    if (process.env.NODE_ENV !== "production") {
      if (!this.state.reference) {
        throw new Error(
          `Invalid \`reference\` argument provided to Popper.js, it must be either a valid DOM element or a jQuery-wrapped DOM element, you provided \`${String(
            this.state.reference
          )}\``
        );
      }
      if (!this.state.popper) {
        throw new Error(
          `Invalid \`popper\` argument provided to Popper.js, it must be either a valid DOM element or a jQuery-wrapped DOM element, you provided \`${String(
            this.state.popper
          )}\``
        );
      }
    }

    // Order `options.modifiers` so that the dependencies are fulfilled
    // once the modifiers are executed
    this.state.orderedModifiers = orderModifiers(options.modifiers);

    // Modifiers have the opportunity to execute some arbitrary code before
    // the first update cycle is ran, the order of execution will be the same
    // defined by the modifier dependencies directive.
    // The `onLoad` function may add or alter the options of themselves
    this.state.orderedModifiers.forEach(
      ({ onLoad, enabled }) => enabled && onLoad && onLoad(this.state)
    );

    this.update();
  }

  // Async and optimistically optimized update
  // it will not be executed if not necessary
  update() {}

  // Syncronous and forcefully executed update
  // it will always be executed even if not necessary, usually NOT needed
  // use Popper#update instead
  forceUpdate() {}
}
