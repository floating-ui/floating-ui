import type {
  FloatingElement,
  MiddlewareData,
  ReferenceElement,
} from '@floating-ui/dom';
import {computePosition} from '@floating-ui/dom';
import type {Ref} from 'vue-demi';
import {
  computed,
  getCurrentScope,
  onScopeDispose,
  ref,
  shallowReadonly,
  shallowRef,
  watch,
} from 'vue-demi';

import type {
  MaybeElement,
  UseFloatingOptions,
  UseFloatingReturn,
} from './types';
import {getDPR} from './utils/getDPR';
import {roundByDPR} from './utils/roundByDPR';
import {unwrapElement} from './utils/unwrapElement';
import {toValue} from './utils/toValue';

/**
 * Computes the `x` and `y` coordinates that will place the floating element next to a reference element when it is given a certain CSS positioning strategy.
 * @param reference The reference template ref.
 * @param floating The floating template ref.
 * @param options The floating options.
 * @see https://floating-ui.com/docs/vue
 */
export function useFloating<T extends ReferenceElement = ReferenceElement>(
  reference: Readonly<Ref<MaybeElement<T>>>,
  floating: Readonly<Ref<MaybeElement<FloatingElement>>>,
  options: UseFloatingOptions<T> = {},
): UseFloatingReturn {
  const whileElementsMountedOption = options.whileElementsMounted;
  const openOption = computed(() => toValue(options.open) ?? true);
  const middlewareOption = computed(() => toValue(options.middleware));
  const placementOption = computed(
    () => toValue(options.placement) ?? 'bottom',
  );
  const strategyOption = computed(
    () => toValue(options.strategy) ?? 'absolute',
  );
  const transformOption = computed(() => toValue(options.transform) ?? true);
  const referenceElement = computed(() => unwrapElement(reference.value));
  const floatingElement = computed(() => unwrapElement(floating.value));
  const x = ref(0);
  const y = ref(0);
  const strategy = ref(strategyOption.value);
  const placement = ref(placementOption.value);
  const middlewareData = shallowRef<MiddlewareData>({});
  const isPositioned = ref(false);
  const floatingStyles = computed(() => {
    const initialStyles = {
      position: strategy.value,
      left: '0',
      top: '0',
    };

    if (!floatingElement.value) {
      return initialStyles;
    }

    const xVal = roundByDPR(floatingElement.value, x.value);
    const yVal = roundByDPR(floatingElement.value, y.value);

    if (transformOption.value) {
      return {
        ...initialStyles,
        transform: `translate(${xVal}px, ${yVal}px)`,
        ...(getDPR(floatingElement.value) >= 1.5 && {willChange: 'transform'}),
      };
    }

    return {
      position: strategy.value,
      left: `${xVal}px`,
      top: `${yVal}px`,
    };
  });

  let whileElementsMountedCleanup: (() => void) | undefined;

  function update() {
    if (referenceElement.value == null || floatingElement.value == null) {
      return;
    }

    const open = openOption.value;

    computePosition(referenceElement.value, floatingElement.value, {
      middleware: middlewareOption.value,
      placement: placementOption.value,
      strategy: strategyOption.value,
    }).then((position) => {
      x.value = position.x;
      y.value = position.y;
      strategy.value = position.strategy;
      placement.value = position.placement;
      middlewareData.value = position.middlewareData;
      /**
       * The floating element's position may be recomputed while it's closed
       * but still mounted (such as when transitioning out). To ensure
       * `isPositioned` will be `false` initially on the next open, avoid
       * setting it to `true` when `open === false` (must be specified).
       */
      isPositioned.value = open !== false;
    });
  }

  function cleanup() {
    if (typeof whileElementsMountedCleanup === 'function') {
      whileElementsMountedCleanup();
      whileElementsMountedCleanup = undefined;
    }
  }

  function attach() {
    cleanup();

    if (whileElementsMountedOption === undefined) {
      update();
      return;
    }

    if (referenceElement.value != null && floatingElement.value != null) {
      whileElementsMountedCleanup = whileElementsMountedOption(
        referenceElement.value,
        floatingElement.value,
        update,
      );
      return;
    }
  }

  function reset() {
    if (!openOption.value) {
      isPositioned.value = false;
    }
  }

  watch(
    [middlewareOption, placementOption, strategyOption, openOption],
    update,
    {
      flush: 'sync',
    },
  );
  watch([referenceElement, floatingElement], attach, {flush: 'sync'});
  watch(openOption, reset, {flush: 'sync'});

  if (getCurrentScope()) {
    onScopeDispose(cleanup);
  }

  return {
    x: shallowReadonly(x),
    y: shallowReadonly(y),
    strategy: shallowReadonly(strategy),
    placement: shallowReadonly(placement),
    middlewareData: shallowReadonly(middlewareData),
    isPositioned: shallowReadonly(isPositioned),
    floatingStyles,
    update,
  };
}
