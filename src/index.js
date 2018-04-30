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
import format from './utils/format';
import debounce from './utils/debounce';

const INVALID_ELEMENT_ERROR =
  'Invalid `%s` argument provided to Popper.js, it must be either a valid DOM element or a jQuery-wrapped DOM element, you provided `%s`';

const isValidElement = (element: mixed, name: string): boolean %checks =>
  element instanceof Element
    ? true
    : Boolean(
        console.error(format(INVALID_ELEMENT_ERROR, name, String(element)))
      );

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
    // make update() debounced, so that it only runs at most once-per-tick
    (this: any).update = debounce(this.update.bind(this));

    // Unwrap `reference` and `popper` elements in case they are
    // wrapped by jQuery, otherwise consume them as is
    this.state.reference = unwrapJqueryElement(reference);
    this.state.popper = unwrapJqueryElement(popper);

    // Store options into state
    this.state.options = { ...defaultOptions, ...options };

    // Don't proceed if `reference` or `popper` are invalid elements
    if (
      !isValidElement(this.state.reference, 'reference') ||
      !isValidElement(this.state.popper, 'popper')
    ) {
      return;
    }

    // Order `options.modifiers` so that the dependencies are fulfilled
    // once the modifiers are executed
    this.state.orderedModifiers = orderModifiers(this.state.options.modifiers);

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
  // check Popper#constructor to see how it gets debounced
  update() {
    return new Promise((success, reject) => {
      this.forceUpdate();
      success(this.state);
    });
  }

  // Syncronous and forcefully executed update
  // it will always be executed even if not necessary, usually NOT needed
  // use Popper#update instead
  forceUpdate() {
    // Don't proceed if `reference` or `popper` are not valid elements anymore
    if (
      !isValidElement(this.state.reference, 'reference') ||
      !isValidElement(this.state.popper, 'popper')
    ) {
      return;
    }

    // Get initial measurements
    // these are going to be used to compute the initial popper offsets
    // and as cache for any modifier that needs them later
    this.state.measures = {
      // $FlowFixMe the above isValidElement checks don't seem to have effect?
      reference: getElementClientRect(this.state.reference),
      // $FlowFixMe the above isValidElement checks don't seem to have effect?
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

    this.state.orderedModifiers.forEach(
      ({ fn, enabled }) => enabled && fn && fn(this.state)
    );
  }

  enableEventListeners(eventListeners: boolean | EventListeners) {
    const { scroll, resize } = expandEventListeners(eventListeners);
  }
}
