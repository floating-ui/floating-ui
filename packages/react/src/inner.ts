import {getUserAgent} from '@floating-ui/react/utils';
import {evaluate} from '@floating-ui/utils';
import {detectOverflow, offset, type Derivable} from '@floating-ui/react-dom';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {useEffectEvent} from './hooks/utils/useEffectEvent';
import type {
  DetectOverflowOptions,
  ElementProps,
  FloatingRootContext,
  Middleware,
  MiddlewareState,
  SideObject,
} from './types';
import {warn} from './utils/log';

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

export interface InnerProps extends DetectOverflowOptions {
  /**
   * A ref which contains an array of HTML elements.
   * @default empty list
   */
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  /**
   * The index of the active (focused or highlighted) item in the list.
   * @default 0
   */
  index: number;
  /**
   * Callback invoked when the fallback state changes.
   */
  onFallbackChange?: null | ((fallback: boolean) => void);
  /**
   * The offset to apply to the floating element.
   * @default 0
   */
  offset?: number;
  /**
   * A ref which contains the overflow of the floating element.
   */
  overflowRef?: React.MutableRefObject<SideObject | null>;
  /**
   * An optional ref containing an HTMLElement. This may be used as the
   * scrolling container instead of the floating element — for instance,
   * to position inner elements as direct children without being interfered by
   * scrolling layout.
   */
  scrollRef?: React.MutableRefObject<HTMLElement | null>;
  /**
   * The minimum number of items that should be visible in the list.
   * @default 4
   */
  minItemsVisible?: number;
  /**
   * The threshold for the reference element's overflow in pixels.
   * @default 0
   */
  referenceOverflowThreshold?: number;
}

/**
 * Positions the floating element such that an inner element inside of it is
 * anchored to the reference element.
 * @see https://floating-ui.com/docs/inner
 */
export const inner = (
  props: InnerProps | Derivable<InnerProps>,
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
    } = evaluate(props, state);

    const {
      rects,
      elements: {floating},
    } = state;

    const item = listRef.current[index];

    if (__DEV__) {
      if (!state.placement.startsWith('bottom')) {
        warn(
          '`placement` side must be "bottom" when using the `inner`',
          'middleware.',
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

    const el = scrollRef?.current || floating;

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
          item.offsetHeight *
            Math.min(minItemsVisible, listRef.current.length - 1) -
            1 ||
        refOverflow.top >= -referenceOverflowThreshold ||
        refOverflow.bottom >= -referenceOverflowThreshold
      ) {
        ReactDOM.flushSync(() => onFallbackChange(true));
      } else {
        ReactDOM.flushSync(() => onFallbackChange(false));
      }
    }

    if (overflowRef) {
      overflowRef.current = await detectOverflow(
        getArgsWithCustomFloatingHeight(
          {...nextArgs, y: nextY},
          el.offsetHeight,
        ),
        detectOverflowOptions,
      );
    }

    return {
      y: nextY,
    };
  },
});

export interface UseInnerOffsetProps {
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * A ref which contains the overflow of the floating element.
   */
  overflowRef: React.MutableRefObject<SideObject | null>;
  /**
   * An optional ref containing an HTMLElement. This may be used as the
   * scrolling container instead of the floating element — for instance,
   * to position inner elements as direct children without being interfered by
   * scrolling layout.
   */
  scrollRef?: React.MutableRefObject<HTMLElement | null>;
  /**
   * Callback invoked when the offset changes.
   */
  onChange: (offset: number | ((offset: number) => number)) => void;
}

/**
 * Changes the `inner` middleware's `offset` upon a `wheel` event to
 * expand the floating element's height, revealing more list items.
 * @see https://floating-ui.com/docs/inner
 */
export function useInnerOffset(
  context: FloatingRootContext,
  props: UseInnerOffsetProps,
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
    if (!enabled) return;

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
        ReactDOM.flushSync(() => {
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

  const floating: ElementProps['floating'] = React.useMemo(
    () => ({
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
            ReactDOM.flushSync(() => onChange((d) => d + scrollDiff));
          }
        }

        // [Firefox] Wait for the height change to have been applied.
        requestAnimationFrame(() => {
          prevScrollTopRef.current = el.scrollTop;
        });
      },
    }),
    [elements.floating, onChange, overflowRef, scrollRef],
  );

  return React.useMemo(() => (enabled ? {floating} : {}), [enabled, floating]);
}
