// @flow
import type {
  JQueryWrapper,
  State,
  Options,
  UpdateCallback,
  EventListeners,
} from './types';
import unwrapJqueryElement from './utils/unwrapJqueryElement';
import orderModifiers from './utils/orderModifiers';
import expandEventListeners from './utils/expandEventListeners';
import getElementClientRect from './dom-utils/getElementClientRect';
import computeOffsets from './utils/computeOffsets';

const defaultOptions = {
  placement: 'bottom',
  eventListeners: { scroll: true, resize: true },
  modifiers: [],
};

export default class Popper {
  state: State = {
    orderedModifiers: [],
    measures: {},
    offsets: {},
    options: defaultOptions,
  };

  constructor(
    reference: Element | JQueryWrapper,
    popper: Element | JQueryWrapper,
    options: Options = defaultOptions
  ) {
    // Unwrap `reference` and `popper` elements in case they are
    // wrapped by jQuery, otherwise consume them as is
    this.state.reference = unwrapJqueryElement(reference);
    this.state.popper = unwrapJqueryElement(popper);

    // Store options into state
    this.state.options = { ...defaultOptions, ...options };

    // Validate `reference` and `popper` elements
    // this will get stripped in production to reduce the final bundle size
    if (process.env.NODE_ENV !== 'production') {
      if (!this.state.reference instanceof Element) {
        throw new Error(
          `Invalid \`reference\` argument provided to Popper.js, it must be either a valid DOM element or a jQuery-wrapped DOM element, you provided \`${String(
            this.state.reference
          )}\``
        );
      }
      if (!this.state.popper instanceof Element) {
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

    this.update().then(() => {
      // After the first update completed, enable the event listeners
      if (options.eventListeners) {
        this.enableEventListeners(options.eventListeners);
      }
    });
  }

  // Async and optimistically optimized update
  // it will not be executed if not necessary
  update() {
    return new Promise((success, reject) => {
      // Get initial measurements
      // these are going to be used to compute the initial
      // popper offsets and as cache for any modifier that
      // needs them
      this.state.measures = {
        reference: getElementClientRect(this.state.reference),
        popper: getElementClientRect(this.state.popper),
      };

      this.state.offsets = {
        popper: computeOffsets({
          reference: this.state.measures.reference,
          popper: this.state.measures.popper,
          strategy: 'absolute',
          placement: this.state.options.placement,
        }),
      };

      success(this.state);
    });
  }

  // Syncronous and forcefully executed update
  // it will always be executed even if not necessary, usually NOT needed
  // use Popper#update instead
  forceUpdate() {}

  enableEventListeners(eventListeners: boolean | EventListeners) {
    const { scroll, resize } = expandEventListeners(eventListeners);
  }
}
