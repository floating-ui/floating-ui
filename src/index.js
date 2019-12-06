// @flow
import type {
  JQueryWrapper,
  State,
  Options,
  Modifier,
  Instance,
} from './types';

// DOM Utils
import getElementClientRect from './dom-utils/getRectRelativeToOffsetParent';
import listScrollParents from './dom-utils/listScrollParents';
import addClientRectMargins from './dom-utils/addClientRectMargins';

// Pure Utils
import unwrapJqueryElement from './utils/unwrapJqueryElement';
import orderModifiers from './utils/orderModifiers';
import debounce from './utils/debounce';
import validateModifiers from './utils/validateModifiers';
import { basePlacements } from './enums';
import getBoundingClientRect from './dom-utils/getBoundingClientRect';

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
  ): Instance {
    // Unwrap `reference` and `popper` elements in case they are
    // wrapped by jQuery, otherwise consume them as is
    const referenceElement = unwrapJqueryElement(reference);
    const popperElement = unwrapJqueryElement(popper);

    let state: $Shape<State> = {
      placement: 'bottom',
      orderedModifiers: [],
      options: defaultOptions,
      modifiersData: {},
      elements: {
        reference: referenceElement,
        popper: popperElement,
      },
    };

    const instance = {
      setOptions(options) {
        // Store options into state
        state.options = {
          ...defaultOptions,
          ...options,
        };

        // Cache the placement in cache to make it available to the modifiers
        // modifiers will modify this one (rather than the one in options)
        state.placement = state.options.placement;

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
            ...state.options.modifiers.find(
              ({ name }) => name === modifier.name
            ),
          }));
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

        const prevPlacement = state.placement;
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

        state.orderedModifiers.forEach(
          modifier =>
            (state.modifiersData[modifier.name] = {
              ...modifier.data,
            })
        );

        const computeStylesModifier = state.orderedModifiers.find(
          modifier => modifier.name === 'computeStyles'
        );
        const applyStylesModifier = state.orderedModifiers.find(
          modifier => modifier.name === 'applyStyles'
        );

        if (!computeStylesModifier) {
          if (__DEV__) {
            console.error(
              'Popper: Required `computeStyles` modifier is missing'
            );
          }
          return;
        }

        if (!applyStylesModifier) {
          if (__DEV__) {
            console.error('Popper: Required `applyStyles` modifier is missing');
          }
          return;
        }

        const computeStyles = computeStylesModifier.fn;
        const applyStyles = applyStylesModifier.fn;

        // Test the size of the popper for each different basePlacement
        state.modifiersData.popperOffsets = { x: 0, y: 0 };
        state.placementMeasures = basePlacements.reduce((acc, placement) => {
          const testState = computeStyles({
            state: { ...state, placement },
            instance,
            name: computeStylesModifier.name,
          });

          applyStyles({
            state: testState,
            instance,
            name: applyStylesModifier.name,
          });

          acc[placement] = getBoundingClientRect(state.elements.popper);

          return acc;
        }, {});

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

          const { fn, enabled, options, name } = state.orderedModifiers[index];

          if (enabled && typeof fn === 'function') {
            state = fn({ state, options, name, instance });
          }
        }

        // Prevent the jitter when the popper changes placements if the
        // placement causes its size to change
        if (state.placement !== prevPlacement) {
          instance.forceUpdate();
        }
      },

      // Async and optimistically optimized update
      // it will not be executed if not necessary
      // debounced, so that it only runs at most once-per-tick
      update: debounce(
        () =>
          // prettier-ignore
          new Promise<State>(resolve => {
          instance.forceUpdate();
          resolve(state);
        })
      ),

      destroy() {
        // Run `onDestroy` modifier methods
        state.orderedModifiers.forEach(
          ({ onDestroy, enabled, name }) =>
            enabled && onDestroy && onDestroy({ state, name, instance })
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
      ({ onLoad, enabled, name }) =>
        enabled &&
        onLoad &&
        (state =
          onLoad({
            state,
            name,
            instance,
          }) || state)
    );

    instance.update();

    return instance;
  };
}

export const createPopper = popperGenerator();
