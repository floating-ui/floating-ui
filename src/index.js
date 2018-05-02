// @flow
import type {
  JQueryWrapper,
  State,
  Options,
  UpdateCallback,
  EventListeners,
} from './types';

// DOM Utils
import getElementClientRect from './dom-utils/getElementClientRect';
import listScrollParents from './dom-utils/listScrollParents';
import getWindow from './dom-utils/getWindow';

// Pure Utils
import unwrapJqueryElement from './utils/unwrapJqueryElement';
import orderModifiers from './utils/orderModifiers';
import expandEventListeners from './utils/expandEventListeners';
import computeOffsets from './utils/computeOffsets';
import format from './utils/format';
import debounce from './utils/debounce';
import validateModifiers from './utils/validateModifiers';

const INVALID_ELEMENT_ERROR =
  'Invalid `%s` argument provided to Popper.js, it must be either a valid DOM element or a jQuery-wrapped DOM element, you provided `%s`';

const areValidElements = (a: mixed, b: mixed): boolean %checks =>
  a instanceof Element && b instanceof Element;

const defaultOptions = {
  placement: 'bottom',
  eventListeners: { scroll: true, resize: true },
  modifiers: [],
};

export default class Popper {
  state: State = {
    reference: undefined,
    popper: undefined,
    orderedModifiers: [],
    measures: {},
    offsets: {},
    scrollParents: {},
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
    const { reference: referenceElement, popper: popperElement } = this.state;

    // Store options into state
    this.state.options = { ...defaultOptions, ...options };

    // Don't proceed if `reference` or `popper` are invalid elements
    if (!areValidElements(referenceElement, popperElement)) {
      return;
    }

    this.state.scrollParents = {
      reference: listScrollParents(referenceElement),
      popper: listScrollParents(popperElement),
    };

    // Order `options.modifiers` so that the dependencies are fulfilled
    // once the modifiers are executed
    this.state.orderedModifiers = orderModifiers(this.state.options.modifiers);

    // Validate the provided modifiers so that the consumer will get warned
    // of one of the custom modifiers is invalid for any reason
    if (process.env.NODE_ENV !== 'production') {
      validateModifiers(this.state.options.modifiers);
    }

    // Modifiers have the opportunity to execute some arbitrary code before
    // the first update cycle is ran, the order of execution will be the same
    // defined by the modifier dependencies directive.
    // The `onLoad` function may add or alter the options of themselves
    this.state.orderedModifiers.forEach(
      ({ onLoad, enabled }) => enabled && onLoad && onLoad(this.state)
    );

    this.update().then(() => {
      // After the first update completed, enable the event listeners
      this.enableEventListeners(this.state.options.eventListeners);
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
    const { reference: referenceElement, popper: popperElement } = this.state;
    // Don't proceed if `reference` or `popper` are not valid elements anymore
    if (!areValidElements(referenceElement, popperElement)) {
      return;
    }

    // Get initial measurements
    // these are going to be used to compute the initial popper offsets
    // and as cache for any modifier that needs them later
    this.state.measures = {
      reference: getElementClientRect(referenceElement),
      popper: getElementClientRect(popperElement),
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
      ({ fn, enabled }) => enabled && fn && (this.state = fn(this.state))
    );
  }

  enableEventListeners(
    eventListeners: boolean | { scroll?: boolean, resize?: boolean }
  ) {
    const { reference: referenceElement, popper: popperElement } = this.state;
    const { scroll, resize } = expandEventListeners(eventListeners);

    // Don't proceed if `reference` or `popper` are not valid elements anymore
    if (!areValidElements(referenceElement, popperElement)) {
      return;
    }

    if (scroll) {
      const scrollParents = [
        ...listScrollParents(referenceElement),
        ...listScrollParents(popperElement),
      ];
      scrollParents.length > 0 &&
        scrollParents.forEach(scrollParent =>
          scrollParent.addEventListener('scroll', this.update, {
            passive: true,
          })
        );
    }

    if (resize && this.state.popper) {
      const win = getWindow(this.state.popper);
      win &&
        win.addEventListener('resize', this.update, {
          passive: true,
        });
    }
  }
}
