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
  unref,
  watch,
} from 'vue-demi';

import type {
  MaybeElement,
  UseFloatingOptions,
  UseFloatingReturn,
} from './types';
import {unwrapElement} from './utils/unwrapElement';

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
  options: UseFloatingOptions<T> = {}
): UseFloatingReturn {
  const whileElementsMountedOption = options.whileElementsMounted;
  const openOption = computed(() => unref(options.open) ?? true);
  const middlewareOption = computed(() => unref(options.middleware));
  const placementOption = computed(() => unref(options.placement) ?? 'bottom');
  const strategyOption = computed(() => unref(options.strategy) ?? 'absolute');
  const referenceElement = computed(() => unwrapElement(reference.value));
  const floatingElement = computed(() => unwrapElement(floating.value));
  const x = ref<number | null>(null);
  const y = ref<number | null>(null);
  const strategy = ref(strategyOption.value);
  const placement = ref(placementOption.value);
  const middlewareData = shallowRef<MiddlewareData>({});
  const isPositioned = ref(false);

  let whileElementsMountedCleanup: void | (() => void);

  function update() {
    if (referenceElement.value == null || floatingElement.value == null) {
      return;
    }

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
      isPositioned.value = true;
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
        update
      );
      return;
    }
  }

  function reset() {
    if (!openOption.value) {
      isPositioned.value = false;
    }
  }

  watch([middlewareOption, placementOption, strategyOption], update, {
    flush: 'sync',
  });
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
    update,
  };
}
