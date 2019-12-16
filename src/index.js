// @flow
import type {
  JQueryWrapper,
  State,
  Options,
  Modifier,
  Instance,
} from './types';

export * from './types';
export * from './enums';

// DOM Utils
import getCompositeRect from './dom-utils/getCompositeRect';
import getLayoutRect from './dom-utils/getLayoutRect';
import listScrollParents from './dom-utils/listScrollParents';
import addClientRectMargins from './dom-utils/addClientRectMargins';
import getCommonOffsetParent from './dom-utils/getCommonOffsetParent';
import unwrapVirtualElement from './dom-utils/unwrapVirtualElement';

// Pure Utils
import unwrapJqueryElement from './utils/unwrapJqueryElement';
import orderModifiers from './utils/orderModifiers';
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

const defaultOptionsValue: Options = {
  placement: 'bottom',
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
  ): Instance {
    // Unwrap `reference` and `popper` elements in case they are
    // wrapped by jQuery, otherwise consume them as is
    const referenceElement = unwrapJqueryElement(reference);
    const popperElement = unwrapJqueryElement(popper);

    let state: $Shape<State> = {
      placement: 'bottom',
      orderedModifiers: [],
      options: { ...defaultOptionsValue, ...defaultOptions },
      modifiersData: {},
      elements: {
        reference: referenceElement,
        popper: popperElement,
      },
      attributes: {},
      styles: {},
    };

    const instance = {
      setOptions(options) {
        // Store options into state
        state.options = {
          ...defaultOptions,
          ...options,
        };

        state.scrollParents = {
          reference: listScrollParents(referenceElement),
          popper: listScrollParents(popperElement),
        };

        // Order `options.modifiers` so that the dependencies are fulfilled
        // once the modifiers are executed
        state.orderedModifiers = orderModifiers([
          ...state.options.modifiers.filter(
            modifier =>
              !defaultModifiers.find(({ name }) => name === modifier.name)
          ),
          ...defaultModifiers.map(defaultModifier => ({
            ...defaultModifier,
            ...state.options.modifiers.find(
              ({ name }) => name === defaultModifier.name
            ),
          })),
        ]);

        // Validate the provided modifiers so that the consumer will get warned
        // if one of the custom modifiers is invalid for any reason
        if (__DEV__) {
          validateModifiers(state.orderedModifiers);
        }
      },
      // Syncronous and forcefully executed update
      // it will always be executed even if not necessary, usually NOT needed
      // use Popper#update instead
      forceUpdate() {
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
          reference: getCompositeRect(
            referenceElement,
            getCommonOffsetParent(
              unwrapVirtualElement(referenceElement),
              popperElement
            ),
            isFixed
          ),
          // CSS marginsc an be applied to popper elements to quickly
          // apply offsets dynamically based on some CSS selectors.
          // For this reason we include margins in this calculation.
          popper: addClientRectMargins(
            getLayoutRect(popperElement),
            popperElement
          ),
        };

        // Modifiers have the ability to read the current Popper state, included
        // the popper offsets, and modify it to address specifc cases
        state.reset = false;

        // Cache the placement in cache to make it available to the modifiers
        // modifiers will modify this one (rather than the one in options)
        const prevPlacement = state.placement;
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

          const { fn, enabled, options = {}, name } = state.orderedModifiers[
            index
          ];

          if (enabled && typeof fn === 'function') {
            state = fn({ state, options, name, instance });
          }
        }

        // Prevents a jitter if elements' size changes based on placement.
        // This is separate from and does not solve the "flip flicker" issue.
        // We can't know ahead of time (before the placement gets written to the
        // DOM) what size the element will be due to conditionally applied/
        // computed CSS based on placement (e.g. margins on arrow)
        if (prevPlacement !== state.placement) {
          instance.forceUpdate();
        }
      },

      // Async and optimistically optimized update
      // it will not be executed if not necessary
      // debounced, so that it only runs at most once-per-tick
      update: debounce(
        () =>
          // prettier-ignore
          new Promise<$Shape<State>>(resolve => {
          instance.forceUpdate();
          resolve(state);
        })
      ),

      destroy() {
        // Run `onDestroy` modifier methods
        state.orderedModifiers.forEach(
          ({ onDestroy, enabled, name, options = {} }) =>
            enabled &&
            onDestroy &&
            onDestroy({ state, name, instance, options })
        );
      },
    };

    // Don't proceed if `reference` or `popper` are invalid elements
    if (!areValidElements(referenceElement, popperElement)) {
      if (__DEV__) {
        console.error(INVALID_ELEMENT_ERROR);
      }
      return instance;
    }

    instance.setOptions(options);

    // Modifiers have the opportunity to execute some arbitrary code before
    // the first update cycle is ran, the order of execution will be the same
    // defined by the modifier dependencies directive.
    // The `onLoad` function may add or alter the options of themselves
    state.orderedModifiers.forEach(
      ({ onLoad, enabled, name, options = {} }) =>
        enabled &&
        onLoad &&
        (state =
          onLoad({
            state,
            name,
            instance,
            options,
          }) || state)
    );

    instance.update();

    return instance;
  };
}

export const createPopper = popperGenerator();
