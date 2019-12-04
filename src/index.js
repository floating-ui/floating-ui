// @flow
import type { JQueryWrapper, State, Options, Modifier } from './types';

// DOM Utils
import getElementClientRect from './dom-utils/getRectRelativeToOffsetParent';
import listScrollParents from './dom-utils/listScrollParents';
import getWindow from './dom-utils/getWindow';
import addClientRectMargins from './dom-utils/addClientRectMargins';

// Pure Utils
import unwrapJqueryElement from './utils/unwrapJqueryElement';
import orderModifiers from './utils/orderModifiers';
import expandToHashMap from './utils/expandToHashMap';
import debounce from './utils/debounce';
import validateModifiers from './utils/validateModifiers';

const INVALID_ELEMENT_ERROR =
  'Popper: Invalid reference or popper argument provided to Popper, they must be either a valid DOM element, virtual element, or a jQuery-wrapped DOM element.';
const INFINITE_LOOP_ERROR =
  'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';

const areValidElements = (...args: Array<any>): boolean =>
  !args.some(
    element => !(element && typeof element.getBoundingClientRect === 'function')
  );

const defaultOptionsValue = {
  placement: 'bottom',
  eventListeners: { scroll: true, resize: true },
  modifiers: [],
  strategy: 'absolute',
};

type PopperGeneratorArgs = {
  defaultModifiers?: Array<Modifier<any>>,
  defaultOptions?: $Shape<Options>,
};

export function popperGenerator(generatorOptions: PopperGeneratorArgs = {}) {
  const {
    defaultModifiers = [],
    defaultOptions = defaultOptionsValue,
  } = generatorOptions;

  return function createPopper(
    reference: HTMLElement | JQueryWrapper,
    popper: HTMLElement | JQueryWrapper,
    options: $Shape<Options> = defaultOptions
  ) {
    const instance = {};

    let state: $Shape<State> = {
      placement: 'bottom',
      orderedModifiers: [],
      options: defaultOptions,
      modifiersData: {},
    };

    // Syncronous and forcefully executed update
    // it will always be executed even if not necessary, usually NOT needed
    // use Popper#update instead
    instance.forceUpdate = () => {
      const {
        reference: referenceElement,
        popper: popperElement,
      } = state.elements;
      // Don't proceed if `reference` or `popper` are not valid elements anymore
      if (!areValidElements(referenceElement, popperElement)) {
        if (__DEV__) {
          console.error(INVALID_ELEMENT_ERROR);
        }
        return;
      }

      const isFixed = state.options.strategy === 'fixed';

      // Get initial measurements
      // these are going to be used to compute the initial popper offsets
      // and as cache for any modifier that needs them later
      state.measures = {
        reference: getElementClientRect(referenceElement, isFixed),
        // CSS marginsc an be applied to popper elements to quickly
        // apply offsets dynamically based on some CSS selectors.
        // For this reason we include margins in this calculation.
        popper: addClientRectMargins(
          getElementClientRect(popperElement, isFixed),
          popperElement
        ),
      };

      // Modifiers have the ability to read the current Popper state, included
      // the popper offsets, and modify it to address specifc cases
      state.reset = false;

      // Cache the placement in cache to make it available to the modifiers
      // modifiers will modify this one (rather than the one in options)
      state.placement = state.options.placement;

      state.orderedModifiers.forEach(
        modifier =>
          (state.modifiersData[modifier.name] = {
            ...modifier.data,
          })
      );

      let __debug_loops__ = 0;
      for (let index = 0; index < state.orderedModifiers.length; index++) {
        if (__DEV__) {
          __debug_loops__ += 1;
          if (__debug_loops__ > 100) {
            console.error(INFINITE_LOOP_ERROR);
            break;
          }
        }

        if (state.reset === true) {
          state.reset = false;
          index = -1;
          continue;
        }

        const { fn, enabled, options } = state.orderedModifiers[index];

        if (enabled && typeof fn === 'function') {
          state = fn((state: State), options);
        }
      }
    };

    // Async and optimistically optimized update
    // it will not be executed if not necessary
    // debounced, so that it only runs at most once-per-tick
    instance.update = debounce(
      () =>
        new Promise<State>(resolve => {
          instance.forceUpdate();
          resolve(state);
        })
    );

    // Unwrap `reference` and `popper` elements in case they are
    // wrapped by jQuery, otherwise consume them as is
    const referenceElement = unwrapJqueryElement(reference);
    const popperElement = unwrapJqueryElement(popper);
    state.elements = {
      reference: referenceElement,
      popper: popperElement,
    };

    // Store options into state
    state.options = { ...defaultOptions, ...options };

    // Don't proceed if `reference` or `popper` are invalid elements
    if (!areValidElements(referenceElement, popperElement)) {
      if (__DEV__) {
        console.error(INVALID_ELEMENT_ERROR);
      }
      return;
    }

    state.scrollParents = {
      reference: listScrollParents(referenceElement),
      popper: listScrollParents(popperElement),
    };

    // Validate the provided modifiers so that the consumer will get warned
    // of one of the custom modifiers is invalid for any reason
    if (__DEV__) {
      validateModifiers(state.options.modifiers);
    }

    // Order `options.modifiers` so that the dependencies are fulfilled
    // once the modifiers are executed
    state.orderedModifiers = orderModifiers([
      ...defaultModifiers,
      ...state.options.modifiers,
    ])
      // Apply user defined preferences to modifiers
      .map(modifier => ({
        ...modifier,
        ...state.options.modifiers.find(({ name }) => name === modifier.name),
      }));

    // Modifiers have the opportunity to execute some arbitrary code before
    // the first update cycle is ran, the order of execution will be the same
    // defined by the modifier dependencies directive.
    // The `onLoad` function may add or alter the options of themselves
    state.orderedModifiers.forEach(
      ({ onLoad, enabled }) => enabled && onLoad && onLoad(state)
    );

    instance.enableEventListeners = (
      eventListeners: boolean | {| scroll?: boolean, resize?: boolean |}
    ) => {
      const { scroll, resize } =
        typeof eventListeners === 'boolean'
          ? expandToHashMap(eventListeners, ['scroll', 'resize'])
          : eventListeners;

      if (scroll) {
        const scrollParents = [
          ...state.scrollParents.reference,
          ...state.scrollParents.popper,
        ];

        scrollParents.forEach(scrollParent =>
          scrollParent.addEventListener('scroll', instance.update, {
            passive: true,
          })
        );
      }

      if (resize) {
        const window = getWindow(state.elements.popper);
        window.addEventListener('resize', instance.update, {
          passive: true,
        });
      }
    };

    instance.destroy = () => {
      // Remove scroll event listeners
      const scrollParents = [
        ...state.scrollParents.reference,
        ...state.scrollParents.popper,
      ];

      scrollParents.forEach(scrollParent =>
        scrollParent.removeEventListener('scroll', instance.update)
      );

      // Remove resize event listeners
      const window = getWindow(state.elements.popper);
      window.removeEventListener('resize', instance.update);

      // Run `onDestroy` modifier methods
      state.orderedModifiers.forEach(
        ({ onDestroy, enabled }) => enabled && onDestroy && onDestroy(state)
      );
    };

    instance.update().then(() => {
      // After the first update completed, enable the event listeners
      instance.enableEventListeners(state.options.eventListeners);
    });

    return instance;
  };
}

export const createPopper = popperGenerator();
