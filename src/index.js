// @flow
import type {
  JQueryWrapper,
  State,
  Options,
  Modifier,
  Instance,
} from './types';
import getCompositeRect from './dom-utils/getCompositeRect';
import getLayoutRect from './dom-utils/getLayoutRect';
import listScrollParents from './dom-utils/listScrollParents';
import getOffsetParent from './dom-utils/getOffsetParent';
import unwrapJqueryElement from './utils/unwrapJqueryElement';
import orderModifiers from './utils/orderModifiers';
import debounce from './utils/debounce';
import validateModifiers from './utils/validateModifiers';
import uniqueBy from './utils/uniqueBy';

export * from './types';
export * from './enums';

const INVALID_ELEMENT_ERROR =
  'Popper: Invalid reference or popper argument provided to Popper, they must be either a valid DOM element, virtual element, or a jQuery-wrapped DOM element.';
const INFINITE_LOOP_ERROR =
  'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';

const DEFAULT_OPTIONS: Options = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute',
};

type PopperGeneratorArgs = {
  defaultModifiers?: Array<Modifier<any>>,
  defaultOptions?: $Shape<Options>,
};

function areValidElements(...args: Array<any>): boolean {
  return !args.some(
    element => !(element && typeof element.getBoundingClientRect === 'function')
  );
}

export function popperGenerator(generatorOptions: PopperGeneratorArgs = {}) {
  const {
    defaultModifiers = [],
    defaultOptions = DEFAULT_OPTIONS,
  } = generatorOptions;

  return function createPopper(
    reference: HTMLElement | JQueryWrapper,
    popper: HTMLElement | JQueryWrapper,
    options: $Shape<Options> = defaultOptions
  ): Instance {
    // Consumers may pass a jQuery element where the real DOM element is wrapped
    // inside an object at the `0` property
    const referenceElement = unwrapJqueryElement(reference);
    const popperElement = unwrapJqueryElement(popper);

    let state: $Shape<State> = {
      isCreated: false,
      placement: 'bottom',
      orderedModifiers: [],
      options: { ...DEFAULT_OPTIONS, ...defaultOptions },
      modifiersData: {},
      elements: {
        reference: referenceElement,
        popper: popperElement,
      },
      attributes: {},
      styles: {},
    };

    const instance = {
      state,
      setOptions(options) {
        state.options = {
          ...defaultOptions,
          ...options,
        };

        state.scrollParents = {
          reference: listScrollParents(referenceElement),
          popper: listScrollParents(popperElement),
        };

        // Orders the modifiers based on their dependencies and `phase`
        // properties
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
        // if one of the modifiers is invalid for any reason
        if (__DEV__) {
          const modifiers = [
            ...state.orderedModifiers,
            ...state.options.modifiers,
          ];

          validateModifiers(uniqueBy(modifiers, ({ name }) => name));
        }

        if (state.isCreated) {
          runModifiersCallback('onDestroy');
        }

        runModifiersCallback('onLoad');

        state.isCreated = true;
      },

      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate() {
        const {
          reference: referenceElement,
          popper: popperElement,
        } = state.elements;

        // Don't proceed if `reference` or `popper` are not valid elements
        // anymore
        if (!areValidElements(referenceElement, popperElement)) {
          if (__DEV__) {
            console.error(INVALID_ELEMENT_ERROR);
          }
          return;
        }

        // Store the reference and popper rects to be read by modifiers
        state.rects = {
          reference: getCompositeRect(
            referenceElement,
            getOffsetParent(popperElement),
            state.options.strategy === 'fixed'
          ),
          popper: getLayoutRect(popperElement),
        };

        // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect
        state.reset = false;

        state.placement = state.options.placement;

        // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`
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
            state = fn({ state, options, name, instance }) || state;
          }
        }
      },

      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(
        () =>
          new Promise<$Shape<State>>(resolve => {
            instance.forceUpdate();
            resolve(state);
          })
      ),

      destroy() {
        runModifiersCallback('onDestroy');
      },
    };

    if (!areValidElements(referenceElement, popperElement)) {
      if (__DEV__) {
        console.error(INVALID_ELEMENT_ERROR);
      }
      return instance;
    }

    instance.setOptions(options);

    // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.
    function runModifiersCallback(callback: 'onLoad' | 'onDestroy') {
      state.orderedModifiers.forEach(
        ({ enabled, name, options = {}, ...rest }) => {
          const callbackFn = rest[callback];

          if (enabled && typeof callbackFn === 'function') {
            state = callbackFn({ state, name, instance, options }) || state;
          }
        }
      );
    }

    instance.update();

    return instance;
  };
}

export const createPopper = popperGenerator();
