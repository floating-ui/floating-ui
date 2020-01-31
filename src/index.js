// @flow
import type {
  State,
  Options,
  Modifier,
  Instance,
  VirtualElement,
} from './types';
import getCompositeRect from './dom-utils/getCompositeRect';
import getLayoutRect from './dom-utils/getLayoutRect';
import listScrollParents from './dom-utils/listScrollParents';
import getOffsetParent from './dom-utils/getOffsetParent';
import getComputedStyle from './dom-utils/getComputedStyle';
import orderModifiers from './utils/orderModifiers';
import debounce from './utils/debounce';
import validateModifiers from './utils/validateModifiers';
import uniqueBy from './utils/uniqueBy';
import getBasePlacement from './utils/getBasePlacement';
import { isElement } from './dom-utils/instanceOf';
import { auto } from './enums';

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
    reference: Element | VirtualElement,
    popper: HTMLElement,
    options: $Shape<Options> = defaultOptions
  ): Instance {
    let state: $Shape<State> = {
      placement: 'bottom',
      orderedModifiers: [],
      options: { ...DEFAULT_OPTIONS, ...defaultOptions },
      modifiersData: {},
      elements: {
        reference,
        popper,
      },
      attributes: {},
      styles: {},
    };

    let effectCleanupFns: Array<() => void> = [];
    let isDestroyed = false;

    const instance = {
      state,
      setOptions(options) {
        cleanupModifierEffects();

        state.options = {
          ...defaultOptions,
          ...state.options,
          ...options,
        };

        state.scrollParents = {
          reference: isElement(reference) ? listScrollParents(reference) : [],
          popper: listScrollParents(popper),
        };

        // Orders the modifiers based on their dependencies and `phase`
        // properties
        const orderedModifiers = orderModifiers([
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
          const modifiers = uniqueBy(
            [...orderedModifiers, ...state.options.modifiers],
            ({ name }) => name
          );

          validateModifiers(modifiers);

          if (getBasePlacement(state.options.placement) === auto) {
            const flipModifier = orderedModifiers.find(
              ({ name }) => name === 'flip'
            );

            if (!flipModifier) {
              console.error(
                [
                  'Popper: "auto" placements require the "flip" modifier be',
                  'present and enabled to work.',
                ].join(' ')
              );
            }
          }

          const {
            marginTop,
            marginRight,
            marginBottom,
            marginLeft,
          } = getComputedStyle(popper);

          // We no longer take into account `margins` on the popper, and it can
          // cause bugs with positioning, so we'll warn the consumer
          if (
            [marginTop, marginRight, marginBottom, marginLeft].some(margin =>
              parseFloat(margin)
            )
          ) {
            console.warn(
              [
                'Popper: CSS "margin" styles cannot be used to apply padding',
                'between the popper and its reference element or boundary.',
                'To replicate margin, use the `offset` modifier, as well as',
                'the `padding` option in the `preventOverflow` and `flip`',
                'modifiers.',
              ].join(' ')
            );
          }
        }

        // Strip out disabled modifiers
        state.orderedModifiers = orderedModifiers.filter(m => m.enabled);

        runModifierEffects();

        return instance.update();
      },

      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate() {
        if (isDestroyed) {
          return;
        }

        const { reference, popper } = state.elements;

        // Don't proceed if `reference` or `popper` are not valid elements
        // anymore
        if (!areValidElements(reference, popper)) {
          if (__DEV__) {
            console.error(INVALID_ELEMENT_ERROR);
          }
          return;
        }

        // Store the reference and popper rects to be read by modifiers
        state.rects = {
          reference: getCompositeRect(
            reference,
            getOffsetParent(popper),
            state.options.strategy === 'fixed'
          ),
          popper: getLayoutRect(popper),
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

          const { fn, options = {}, name } = state.orderedModifiers[index];

          if (typeof fn === 'function') {
            state = fn({ state, options, name, instance }) || state;
          }
        }
      },

      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce<$Shape<State>>(
        () =>
          new Promise<$Shape<State>>(resolve => {
            instance.forceUpdate();
            resolve(state);
          })
      ),

      destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      },
    };

    if (!areValidElements(reference, popper)) {
      if (__DEV__) {
        console.error(INVALID_ELEMENT_ERROR);
      }
      return instance;
    }

    instance.setOptions(options).then(state => {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    });

    // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.
    function runModifierEffects() {
      state.orderedModifiers.forEach(({ name, options = {}, effect }) => {
        if (typeof effect === 'function') {
          const cleanupFn = effect({ state, name, instance, options });
          const noopFn = () => {};
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(fn => fn());
      effectCleanupFns = [];
    }

    return instance;
  };
}

export const createPopper = popperGenerator();
