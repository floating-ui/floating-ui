// credits to Alexis Munsayac
// "https://github.com/lxsmnsyc/solid-floating-ui/tree/main/packages/solid-floating-ui",
import {
  computePosition,
  ComputePositionReturn,
  ReferenceElement,
} from '@floating-ui/dom';
import {isElement} from '@floating-ui/utils/dom';
import {access} from '@solid-primitives/utils';
import {createEffect, createMemo, createSignal} from 'solid-js';

import {
  ExtendedPositionElements,
  ExtendedPositionRefs,
  ReferenceType,
  UseFloatingOptions,
  UseFloatingReturn,
} from '../types';
import {getDPR} from '../utils/getDPR';
import {roundByDPR} from '../utils/roundByDPR';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ignore<T>(_value: T): void {
  // no-op
}

export function usePosition<R extends ReferenceElement = ReferenceElement>(
  // reference: () => R | undefined | null,
  // floating: () => F | undefined | null,
  options: UseFloatingOptions<R> = {transform: true},
): Omit<UseFloatingReturn<R>, 'context' | 'refs' | 'elements'> & {
  refs: ExtendedPositionRefs<R>;
  elements: ExtendedPositionElements<R>;
} {
  const placement = () => options?.placement ?? 'bottom';
  const strategy = () => options?.strategy ?? 'absolute';

  const [data, setData] = createSignal<
    ComputePositionReturn & {isPositioned: boolean}
  >({
    x: 0,
    y: 0,
    placement: placement(),
    strategy: strategy(),
    middlewareData: {},
    isPositioned: false,
  });

  const [error, setError] = createSignal<{value: any} | undefined>();

  const [_reference, setReference] = createSignal<R | null>(null);
  const [_floating, setFloating] = createSignal<HTMLElement | null>(null);

  const reference = createMemo(
    () => _reference() ?? options.elements?.reference?.() ?? null,
  );
  const floating = createMemo(
    () => _floating() ?? options.elements?.floating?.() ?? null,
  );

  const setPositionReference = (node: ReferenceType | null) => {
    const positionReference = isElement(node)
      ? {
          getBoundingClientRect: () => node.getBoundingClientRect(),
          contextElement: node,
        }
      : node;
    //@ts-ignore
    setReference(positionReference as R);
  };

  createEffect(() => {
    const currentError = error();
    if (currentError) {
      // throw currentError.value;
      process.env.NODE_ENV !== 'production' && console.warn(currentError.value);
    }
  });

  const version = createMemo(() => {
    reference();
    floating();
    return {};
  });

  async function update() {
    const currentReference = reference();
    const currentFloating = floating();

    if (currentReference && currentFloating) {
      const capturedVersion = version();

      computePosition(currentReference, currentFloating, {
        middleware: access(options?.middleware),
        placement: placement(),
        strategy: strategy(),
      }).then(
        (currentData) => {
          // Check if it's still valid
          const x = roundByDPR(currentFloating, currentData.x);
          const y = roundByDPR(currentFloating, currentData.y);
          if (capturedVersion === version()) {
            setData({...currentData, x, y, isPositioned: true});
          }
        },
        (err) => {
          console.log({
            floating: floating()?.id,
            currentFloating: currentFloating.id,
          });
          setError(err);
        },
      );
    }
  }

  createEffect(() => {
    const currentReference = reference();
    const currentFloating = floating();

    // Subscribe to other reactive properties
    ignore(access(options?.middleware));
    placement();
    strategy();

    if (currentReference && currentFloating) {
      update();
    }

    // onCleanup(() => {
    //   if (
    //     currentReference &&
    //     currentFloating &&
    //     options?.whileElementsMounted
    //   ) {
    //     console.log('#########', {currentFloating, currentReference});
    //     // return;
    //     const cleanup = options.whileElementsMounted?.(
    //       currentReference,
    //       currentFloating,
    //       update
    //     );
    //     if (cleanup) {
    //       onCleanup(cleanup);
    //     }
    //   }
    // });
  });

  const floatingStyles = () => {
    const initialStyles = {
      position: strategy(),
      left: '0px',
      top: '0px',
    };
    const floatingElement = floating();
    if (!floatingElement) {
      return initialStyles;
    }

    const x = roundByDPR(floatingElement, data().x);
    const y = roundByDPR(floatingElement, data().y);

    if (options?.transform) {
      return {
        ...initialStyles,
        transform: `translate(${x}px, ${y}px)`,
        ...(getDPR(floatingElement) >= 1.5 && {willChange: 'transform'}),
      };
    }

    return {
      position: strategy(),
      left: `${x}px`,
      top: `${y}px`,
    };
  };

  const refs = {
    reference,
    floating,
    setReference,
    setFloating,
    setPositionReference,
  };

  return {
    get x() {
      return data().x;
    },
    get y() {
      return data().y;
    },
    get isPositioned() {
      return data().isPositioned;
    },
    get placement() {
      return data().placement;
    },
    get strategy() {
      return data().strategy;
    },
    get middlewareData() {
      return data().middlewareData;
    },
    get floatingStyles() {
      return floatingStyles;
    },
    get elements() {
      return {
        reference: reference,
        floating: floating,
      };
    },
    get refs() {
      return refs;
    },
    update,
  };
}
