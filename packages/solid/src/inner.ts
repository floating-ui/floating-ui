import {detectOverflow, offset} from '@floating-ui/core';
import {access, MaybeAccessor} from '@solid-primitives/utils';
import {
  Accessor,
  createEffect,
  createMemo,
  mergeProps,
  onCleanup,
} from 'solid-js';
import {createStore, SetStoreFunction} from 'solid-js/store';

import type {
  DetectOverflowOptions,
  ElementProps,
  FloatingContext,
  Middleware,
  MiddlewareState,
  Prettify,
  SideObject,
} from './types';
import {getUserAgent} from './utils';
import {destructure} from './utils/destructure';

function getArgsWithCustomFloatingHeight(
  state: MiddlewareState,
  height: number,
) {
  return {
    ...state,
    rects: {
      ...state.rects,
      floating: {
        ...state.rects.floating,
        height,
      },
    },
  };
}

export interface InnerProps {
  listRef: Array<HTMLElement | null>;
  index: number;
  onFallbackChange?: null | ((fallback: boolean) => void);
  offset?: number;
  overflowRef?: [get: SideObject, set: SetStoreFunction<SideObject>];
  scrollRef?: MaybeAccessor<HTMLElement | null>;
  minItemsVisible?: number;
  referenceOverflowThreshold?: number;
}

/**
 * Positions the floating element such that an inner element inside
 * of it is anchored to the reference element.
 * @see https://floating-ui.com/docs/inner
 */

export const inner = (
  props: InnerProps & Partial<DetectOverflowOptions>,
): Middleware => ({
  name: 'inner',
  options: props,
  async fn(state) {
    const {
      listRef,
      overflowRef,
      onFallbackChange,
      offset: innerOffset = 0,
      index = 0,
      minItemsVisible = 4,
      referenceOverflowThreshold = 0,
      scrollRef,
      ...detectOverflowOptions
      // eslint-disable-next-line solid/reactivity
    } = props;

    const {
      rects,
      elements: {floating},
    } = state;

    const item = listRef[index];

    if (process.env.NODE_ENV === 'development') {
      if (!state.placement.startsWith('bottom')) {
        console.warn(
          [
            'Floating UI: `placement` side must be "bottom" when using the',
            '`inner` middleware.',
          ].join(' '),
        );
      }
    }

    if (!item) {
      return {};
    }

    const nextArgs = {
      ...state,
      ...(await offset(
        -item.offsetTop -
          floating.clientTop -
          rects.reference.height / 2 -
          item.offsetHeight / 2 -
          innerOffset,
      ).fn(state)),
    };

    const el = access(scrollRef) || floating;

    const overflow = await detectOverflow(
      getArgsWithCustomFloatingHeight(nextArgs, el.scrollHeight),
      detectOverflowOptions,
    );
    const refOverflow = await detectOverflow(nextArgs, {
      ...detectOverflowOptions,
      elementContext: 'reference',
    });

    const diffY = Math.max(0, overflow.top);
    const nextY = nextArgs.y + diffY;

    const maxHeight = Math.max(
      0,
      el.scrollHeight - diffY - Math.max(0, overflow.bottom),
    );

    el.style.maxHeight = `${maxHeight}px`;
    el.scrollTop = diffY;

    // There is not enough space, fallback to standard anchored positioning
    if (onFallbackChange) {
      if (
        el.offsetHeight <
          item.offsetHeight * Math.min(minItemsVisible, listRef.length - 1) -
            1 ||
        refOverflow.top >= -referenceOverflowThreshold ||
        refOverflow.bottom >= -referenceOverflowThreshold
      ) {
        () => onFallbackChange(true);
      } else {
        () => onFallbackChange(false);
      }
    }
    if (overflowRef) {
      const [overFlowVal, setOverFlowVal] = overflowRef;
      const val = await detectOverflow(
        getArgsWithCustomFloatingHeight(
          {...nextArgs, y: nextY},
          el.offsetHeight,
        ),
        detectOverflowOptions,
      );
      setOverFlowVal({...overFlowVal, ...val});
    }

    return {
      y: nextY,
    };
  },
});

export interface UseInnerOffsetProps {
  enabled?: MaybeAccessor<boolean>;
  overflowRef: [get: SideObject, set: SetStoreFunction<SideObject>];
  scrollRef?: HTMLElement | null;
  onChange: (offset: number | ((offset: number) => number)) => void;
}

/**
 * Changes the `inner` middleware's `offset` upon a `wheel` event to
 * expand the floating element's height, revealing more list items.
 * @see https://floating-ui.com/docs/inner
 */
export function useInnerOffset(
  context: Accessor<FloatingContext>,
  props?: UseInnerOffsetProps,
): Accessor<ElementProps> {
  const {
    enabled,
    overflowRef,
    scrollRef,
    onChange,
    // eslint-disable-next-line solid/reactivity
  } = destructure(mergeProps({enabled: true}, props), {normalize: true});

  // const onChange = useEffectEvent(unstable_onChange);
  let controlledScrollingRef = false;
  let prevScrollTopRef: number | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let initialOverflowRef: SideObject | null = null;

  createEffect(() => {
    if (!enabled()) {
      console.log('not enabled');

      return;
    }
    const {open, elements} = context();
    const [overflow] = overflowRef();
    function onWheel(e: WheelEvent) {
      if (e.ctrlKey || !el || overflow == null) {
        return;
      }
      const dY = e.deltaY;
      const isAtTop = overflow.top >= -0.5;
      const isAtBottom = overflow.bottom >= -0.5;
      const remainingScroll = el.scrollHeight - el.clientHeight;
      const sign = dY < 0 ? -1 : 1;
      const method = dY < 0 ? 'max' : 'min';

      if (el.scrollHeight <= el.clientHeight) {
        return;
      }

      if ((!isAtTop && dY > 0) || (!isAtBottom && dY < 0)) {
        e.preventDefault();

        onChange((d) => d + Math[method](dY, remainingScroll * sign));
      } else if (/firefox/i.test(getUserAgent())) {
        // Needed to propagate scrolling during momentum scrolling phase once
        // it gets limited by the boundary. UX improvement, not critical.
        el.scrollTop += dY;
      }
    }

    const el = scrollRef?.() || elements.floating();

    if (open() && el) {
      el.addEventListener('wheel', onWheel);

      // Wait for the position to be ready.
      requestAnimationFrame(() => {
        prevScrollTopRef = el.scrollTop;

        if (overflow != null) {
          initialOverflowRef = overflow;
        }
      });

      onCleanup(() => {
        prevScrollTopRef = null;
        initialOverflowRef = null;
        el.removeEventListener('wheel', onWheel);
      });
    }
  });

  // eslint-disable-next-line solid/reactivity
  return createMemo(() => {
    if (!enabled()) {
      return {};
    }
    const {elements} = context();
    const [overflow] = overflowRef();
    return {
      floating: {
        onKeyDown() {
          controlledScrollingRef = true;
        },
        onWheel() {
          controlledScrollingRef = false;
        },
        onPointerMove() {
          controlledScrollingRef = false;
        },
        onScroll() {
          const el = scrollRef?.() || elements.floating();
          if (!overflow || !el || !controlledScrollingRef) {
            return;
          }

          if (prevScrollTopRef !== null) {
            const scrollDiff = el.scrollTop - prevScrollTopRef;

            if (
              (overflow.bottom < -0.5 && scrollDiff < -1) ||
              (overflow.top < -0.5 && scrollDiff > 1)
            ) {
              onChange((d) => d + scrollDiff);
            }
          }

          // [Firefox] Wait for the height change to have been applied.
          requestAnimationFrame(() => {
            prevScrollTopRef = el.scrollTop;
          });
        },
      },
    };
  });
}

export function createOverflowRef(initialPosition?: Prettify<SideObject>) {
  const mergedConfig = mergeProps(
    {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    initialPosition,
  );

  // eslint-disable-next-line solid/reactivity
  return createStore<SideObject>(mergedConfig);
}
