import {getUserAgent} from '@floating-ui/react/utils';
import {detectOverflow, offset} from '@floating-ui/react-dom';
import * as React from 'react';
import {flushSync} from 'react-dom';

import {useEffectEvent} from './hooks/utils/useEffectEvent';
import type {
  DetectOverflowOptions,
  ElementProps,
  FloatingContext,
  Middleware,
  MiddlewareState,
  SideObject,
} from './types';

function getArgsWithCustomFloatingHeight(
  state: MiddlewareState,
  height: number
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
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  index: number;
  onFallbackChange?: null | ((fallback: boolean) => void);
  offset?: number;
  overflowRef?: React.MutableRefObject<SideObject | null>;
  scrollRef?: React.MutableRefObject<HTMLElement | null>;
  minItemsVisible?: number;
  referenceOverflowThreshold?: number;
}

/**
 * Positions the floating element such that an inner element inside
 * of it is anchored to the reference element.
 * @see https://floating-ui.com/docs/inner
 */
export const inner = (
  props: InnerProps & Partial<DetectOverflowOptions>
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
    } = props;

    const {
      rects,
      elements: {floating},
    } = state;

    const item = listRef.current[index];

    if (__DEV__) {
      if (!state.placement.startsWith('bottom')) {
        console.warn(
          [
            'Floating UI: `placement` side must be "bottom" when using the',
            '`inner` middleware.',
          ].join(' ')
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
          innerOffset
      ).fn(state)),
    };

    const el = scrollRef?.current || floating;

    const overflow = await detectOverflow(
      getArgsWithCustomFloatingHeight(nextArgs, el.scrollHeight),
      detectOverflowOptions
    );
    const refOverflow = await detectOverflow(nextArgs, {
      ...detectOverflowOptions,
      elementContext: 'reference',
    });

    const diffY = Math.max(0, overflow.top);
    const nextY = nextArgs.y + diffY;

    const maxHeight = Math.max(
      0,
      el.scrollHeight - diffY - Math.max(0, overflow.bottom)
    );

    el.style.maxHeight = `${maxHeight}px`;
    el.scrollTop = diffY;

    // There is not enough space, fallback to standard anchored positioning
    if (onFallbackChange) {
      if (
        el.offsetHeight <
          item.offsetHeight *
            Math.min(minItemsVisible, listRef.current.length - 1) -
            1 ||
        refOverflow.top >= -referenceOverflowThreshold ||
        refOverflow.bottom >= -referenceOverflowThreshold
      ) {
        flushSync(() => onFallbackChange(true));
      } else {
        flushSync(() => onFallbackChange(false));
      }
    }

    if (overflowRef) {
      overflowRef.current = await detectOverflow(
        getArgsWithCustomFloatingHeight(
          {...nextArgs, y: nextY},
          el.offsetHeight
        ),
        detectOverflowOptions
      );
    }

    return {
      y: nextY,
    };
  },
});

export interface UseInnerOffsetProps {
  enabled?: boolean;
  overflowRef: React.MutableRefObject<SideObject | null>;
  scrollRef?: React.MutableRefObject<HTMLElement | null>;
  onChange: (offset: number | ((offset: number) => number)) => void;
}

/**
 * Changes the `inner` middleware's `offset` upon a `wheel` event to
 * expand the floating element's height, revealing more list items.
 * @see https://floating-ui.com/docs/inner
 */
export function useInnerOffset(
  context: FloatingContext,
  props: UseInnerOffsetProps
): ElementProps {
  const {open, elements} = context;
  const {
    enabled = true,
    overflowRef,
    scrollRef,
    onChange: unstable_onChange,
  } = props;

  const onChange = useEffectEvent(unstable_onChange);
  const controlledScrollingRef = React.useRef(false);
  const prevScrollTopRef = React.useRef<number | null>(null);
  const initialOverflowRef = React.useRef<SideObject | null>(null);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    function onWheel(e: WheelEvent) {
      if (e.ctrlKey || !el || overflowRef.current == null) {
        return;
      }

      const dY = e.deltaY;
      const isAtTop = overflowRef.current.top >= -0.5;
      const isAtBottom = overflowRef.current.bottom >= -0.5;
      const remainingScroll = el.scrollHeight - el.clientHeight;
      const sign = dY < 0 ? -1 : 1;
      const method = dY < 0 ? 'max' : 'min';

      if (el.scrollHeight <= el.clientHeight) {
        return;
      }

      if ((!isAtTop && dY > 0) || (!isAtBottom && dY < 0)) {
        e.preventDefault();
        flushSync(() => {
          onChange((d) => d + Math[method](dY, remainingScroll * sign));
        });
      } else if (/firefox/i.test(getUserAgent())) {
        // Needed to propagate scrolling during momentum scrolling phase once
        // it gets limited by the boundary. UX improvement, not critical.
        el.scrollTop += dY;
      }
    }

    const el = scrollRef?.current || elements.floating;

    if (open && el) {
      el.addEventListener('wheel', onWheel);

      // Wait for the position to be ready.
      requestAnimationFrame(() => {
        prevScrollTopRef.current = el.scrollTop;

        if (overflowRef.current != null) {
          initialOverflowRef.current = {...overflowRef.current};
        }
      });

      return () => {
        prevScrollTopRef.current = null;
        initialOverflowRef.current = null;
        el.removeEventListener('wheel', onWheel);
      };
    }
  }, [enabled, open, elements.floating, overflowRef, scrollRef, onChange]);

  return React.useMemo(() => {
    if (!enabled) {
      return {};
    }

    return {
      floating: {
        onKeyDown() {
          controlledScrollingRef.current = true;
        },
        onWheel() {
          controlledScrollingRef.current = false;
        },
        onPointerMove() {
          controlledScrollingRef.current = false;
        },
        onScroll() {
          const el = scrollRef?.current || elements.floating;

          if (!overflowRef.current || !el || !controlledScrollingRef.current) {
            return;
          }

          if (prevScrollTopRef.current !== null) {
            const scrollDiff = el.scrollTop - prevScrollTopRef.current;

            if (
              (overflowRef.current.bottom < -0.5 && scrollDiff < -1) ||
              (overflowRef.current.top < -0.5 && scrollDiff > 1)
            ) {
              flushSync(() => onChange((d) => d + scrollDiff));
            }
          }

          // [Firefox] Wait for the height change to have been applied.
          requestAnimationFrame(() => {
            prevScrollTopRef.current = el.scrollTop;
          });
        },
      },
    };
  }, [enabled, overflowRef, elements.floating, scrollRef, onChange]);
}
