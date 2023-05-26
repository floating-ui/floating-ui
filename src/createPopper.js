// @flow
import type {
  State,
  OptionsGeneric,
  Modifier,
  Instance,
  VirtualElement,
} from './types';
import getCompositeRect from './dom-utils/getCompositeRect';
import getLayoutRect from './dom-utils/getLayoutRect';
import listScrollParents from './dom-utils/listScrollParents';
import getOffsetParent from './dom-utils/getOffsetParent';
import orderModifiers from './utils/orderModifiers';
import debounce from './utils/debounce';
import mergeByName from './utils/mergeByName';
import detectOverflow from './utils/detectOverflow';
import { isElement } from './dom-utils/instanceOf';

const DEFAULT_OPTIONS: OptionsGeneric<any> = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute',
};

type PopperGeneratorArgs = {
  defaultModifiers?: Array<Modifier<any, any>>,
  defaultOptions?: $Shape<OptionsGeneric<any>>,
};

function areValidElements(...args: Array<any>): boolean {
  return !args.some(
    (element) =>
      !(element && typeof element.getBoundingClientRect === 'function')
  );
}

export function popperGenerator(generatorOptions: PopperGeneratorArgs = {}) {
  const { defaultModifiers = [], defaultOptions = DEFAULT_OPTIONS } =
    generatorOptions;

  return function createPopper<TModifier: $Shape<Modifier<any, any>>>(
    reference: Element | VirtualElement,
    popper: HTMLElement,
    options: $Shape<OptionsGeneric<TModifier>> = defaultOptions
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
      setOptions(setOptionsAction) {
        const options =
          typeof setOptionsAction === 'function'
            ? setOptionsAction(state.options)
            : setOptionsAction;

        cleanupModifierEffects();

        state.options = {
          // $FlowFixMe[exponential-spread]
          ...defaultOptions,
          ...state.options,
          ...options,
        };

        state.scrollParents = {
          reference: isElement(reference)
            ? listScrollParents(reference)
            : reference.contextElement
            ? listScrollParents(reference.contextElement)
            : [],
          popper: listScrollParents(popper),
        };

        // Orders the modifiers based on their dependencies and `phase`
        // properties
        const orderedModifiers = orderModifiers(
          mergeByName([...defaultModifiers, ...state.options.modifiers])
        );

        // Strip out disabled modifiers
        state.orderedModifiers = orderedModifiers.filter((m) => m.enabled);

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
          (modifier) =>
            (state.modifiersData[modifier.name] = {
              ...modifier.data,
            })
        );

        for (let index = 0; index < state.orderedModifiers.length; index++) {
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
          new Promise<$Shape<State>>((resolve) => {
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
      return instance;
    }

    instance.setOptions(options).then((state) => {
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
      effectCleanupFns.forEach((fn) => fn());
      effectCleanupFns = [];
    }

    return instance;
  };
}

export const createPopper = popperGenerator();

// eslint-disable-next-line import/no-unused-modules
export { detectOverflow };
