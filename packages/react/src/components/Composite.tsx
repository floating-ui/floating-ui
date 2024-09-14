import * as React from 'react';

import {useMergeRefs} from '../hooks/useMergeRefs';
import {useEffectEvent} from '../hooks/utils/useEffectEvent';
import type {Dimensions} from '../types';
import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  buildCellMap,
  findNonDisabledIndex,
  getCellIndexOfCorner,
  getCellIndices,
  getGridNavigatedIndex,
  getMaxIndex,
  getMinIndex,
  isDisabled,
  isIndexOutOfBounds,
} from '../utils/composite';
import {enqueueFocus} from '../utils/enqueueFocus';
import {FloatingList, useListItem} from './FloatingList';

function renderJsx(
  render: RenderProp | undefined,
  computedProps: React.HTMLAttributes<HTMLElement>,
) {
  if (typeof render === 'function') {
    return render(computedProps);
  }
  if (render) {
    return React.cloneElement(render, computedProps);
  }
  return <div {...computedProps} />;
}

const CompositeContext = React.createContext<{
  activeIndex: number;
  onNavigate(index: number): void;
}>({
  activeIndex: 0,
  onNavigate: () => {},
});

type RenderProp =
  | React.JSX.Element
  | ((props: React.HTMLAttributes<HTMLElement>) => React.JSX.Element);

export interface CompositeProps {
  /**
   * Determines the element to render.
   * @example
   * ```jsx
   * <Composite render={<ul />} />
   * <Composite render={(htmlProps) => <ul {...htmlProps} />} />
   * ```
   */
  render?: RenderProp;
  /**
   * Determines the orientation of the composite.
   */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /**
   * Determines whether focus should loop around when navigating past the first
   * or last item.
   */
  loop?: boolean;
  /**
   * Determines the number of columns there are in the composite
   * (i.e. it’s a grid).
   */
  cols?: number;
  /**
   * Determines which items are disabled. The `disabled` or `aria-disabled`
   * attributes are used by default.
   */
  disabledIndices?: number[];
  /**
   * Determines which item is active. Used to externally control the active
   * item.
   */
  activeIndex?: number;
  /**
   * Called when the user navigates to a new item. Used to externally control
   * the active item.
   */
  onNavigate?(index: number): void;
  /**
   * Only for `cols > 1`, specify sizes for grid items.
   * `{ width: 2, height: 2 }` means an item is 2 columns wide and 2 rows tall.
   */
  itemSizes?: Dimensions[];
  /**
   * Only relevant for `cols > 1` and items with different sizes, specify if
   * the grid is dense (as defined in the CSS spec for grid-auto-flow).
   */
  dense?: boolean;
}

const horizontalKeys = [ARROW_LEFT, ARROW_RIGHT];
const verticalKeys = [ARROW_UP, ARROW_DOWN];
const allKeys = [...horizontalKeys, ...verticalKeys];

/**
 * Creates a single tab stop whose items are navigated by arrow keys, which
 * provides list navigation outside of floating element contexts.
 *
 * This is useful to enable navigation of a list of items that aren’t part of a
 * floating element. A menubar is an example of a composite, with each reference
 * element being an item.
 * @see https://floating-ui.com/docs/Composite
 */
export const Composite = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & CompositeProps
>(function Composite(props, forwardedRef) {
  const {
    render,
    orientation = 'both',
    loop = true,
    cols = 1,
    disabledIndices,
    activeIndex: externalActiveIndex,
    onNavigate: externalSetActiveIndex,
    itemSizes,
    dense = false,
    ...domProps
  } = props;

  const [internalActiveIndex, internalSetActiveIndex] = React.useState(0);
  const activeIndex = externalActiveIndex ?? internalActiveIndex;
  const onNavigate = useEffectEvent(
    externalSetActiveIndex ?? internalSetActiveIndex,
  );

  const elementsRef = React.useRef<Array<HTMLDivElement | null>>([]);
  const renderElementProps =
    render && typeof render !== 'function' ? render.props : {};
  const contextValue = React.useMemo(
    () => ({activeIndex, onNavigate}),
    [activeIndex, onNavigate],
  );
  const isGrid = cols > 1;

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!allKeys.includes(event.key)) return;

    let nextIndex = activeIndex;
    const minIndex = getMinIndex(elementsRef, disabledIndices);
    const maxIndex = getMaxIndex(elementsRef, disabledIndices);

    if (isGrid) {
      const sizes =
        itemSizes ||
        Array.from({length: elementsRef.current.length}, () => ({
          width: 1,
          height: 1,
        }));
      // To calculate movements on the grid, we use hypothetical cell indices
      // as if every item was 1x1, then convert back to real indices.
      const cellMap = buildCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex(
        (index) =>
          index != null &&
          !isDisabled(elementsRef.current, index, disabledIndices),
      );
      // last enabled index
      const maxGridIndex = cellMap.reduce(
        (foundIndex: number, index, cellIndex) =>
          index != null &&
          !isDisabled(elementsRef.current, index, disabledIndices)
            ? cellIndex
            : foundIndex,
        -1,
      );

      const maybeNextIndex =
        cellMap[
          getGridNavigatedIndex(
            {
              current: cellMap.map((itemIndex) =>
                itemIndex ? elementsRef.current[itemIndex] : null,
              ),
            },
            {
              event,
              orientation,
              loop,
              cols,
              // treat undefined (empty grid spaces) as disabled indices so we
              // don't end up in them
              disabledIndices: getCellIndices(
                [
                  ...(disabledIndices ||
                    elementsRef.current.map((_, index) =>
                      isDisabled(elementsRef.current, index)
                        ? index
                        : undefined,
                    )),
                  undefined,
                ],
                cellMap,
              ),
              minIndex: minGridIndex,
              maxIndex: maxGridIndex,
              prevIndex: getCellIndexOfCorner(
                activeIndex > maxIndex ? minIndex : activeIndex,
                sizes,
                cellMap,
                cols,
                // use a corner matching the edge closest to the direction we're
                // moving in so we don't end up in the same item. Prefer
                // top/left over bottom/right.
                event.key === ARROW_DOWN
                  ? 'bl'
                  : event.key === ARROW_RIGHT
                    ? 'tr'
                    : 'tl',
              ),
            },
          )
        ];

      if (maybeNextIndex != null) {
        nextIndex = maybeNextIndex;
      }
    }

    const toEndKeys = {
      horizontal: [ARROW_RIGHT],
      vertical: [ARROW_DOWN],
      both: [ARROW_RIGHT, ARROW_DOWN],
    }[orientation];

    const toStartKeys = {
      horizontal: [ARROW_LEFT],
      vertical: [ARROW_UP],
      both: [ARROW_LEFT, ARROW_UP],
    }[orientation];

    const preventedKeys = isGrid
      ? allKeys
      : {
          horizontal: horizontalKeys,
          vertical: verticalKeys,
          both: allKeys,
        }[orientation];

    if (
      nextIndex === activeIndex &&
      [...toEndKeys, ...toStartKeys].includes(event.key)
    ) {
      if (loop && nextIndex === maxIndex && toEndKeys.includes(event.key)) {
        nextIndex = minIndex;
      } else if (
        loop &&
        nextIndex === minIndex &&
        toStartKeys.includes(event.key)
      ) {
        nextIndex = maxIndex;
      } else {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: nextIndex,
          decrement: toStartKeys.includes(event.key),
          disabledIndices,
        });
      }
    }

    if (
      nextIndex !== activeIndex &&
      !isIndexOutOfBounds(elementsRef, nextIndex)
    ) {
      event.stopPropagation();

      if (preventedKeys.includes(event.key)) {
        event.preventDefault();
      }

      onNavigate(nextIndex);

      // Wait for FocusManager `returnFocus` to execute.
      queueMicrotask(() => {
        enqueueFocus(elementsRef.current[nextIndex]);
      });
    }
  }

  const computedProps: React.HTMLAttributes<HTMLElement> = {
    ...domProps,
    ...renderElementProps,
    ref: forwardedRef,
    'aria-orientation': orientation === 'both' ? undefined : orientation,
    onKeyDown(e) {
      domProps.onKeyDown?.(e);
      renderElementProps.onKeyDown?.(e);
      handleKeyDown(e);
    },
  };

  return (
    <CompositeContext.Provider value={contextValue}>
      <FloatingList elementsRef={elementsRef}>
        {renderJsx(render, computedProps)}
      </FloatingList>
    </CompositeContext.Provider>
  );
});

export interface CompositeItemProps {
  /**
   * Determines the element to render.
   * @example
   * ```jsx
   * <CompositeItem render={<li />} />
   * <CompositeItem render={(htmlProps) => <li {...htmlProps} />} />
   * ```
   */
  render?: RenderProp;
}

/**
 * @see https://floating-ui.com/docs/Composite
 */
export const CompositeItem = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & CompositeItemProps
>(function CompositeItem(props, forwardedRef) {
  const {render, ...domProps} = props;
  const renderElementProps =
    render && typeof render !== 'function' ? render.props : {};

  const {activeIndex, onNavigate} = React.useContext(CompositeContext);
  const {ref, index} = useListItem();
  const mergedRef = useMergeRefs([ref, forwardedRef, renderElementProps.ref]);
  const isActive = activeIndex === index;

  const computedProps: React.HTMLAttributes<HTMLElement> = {
    ...domProps,
    ...renderElementProps,
    ref: mergedRef,
    tabIndex: isActive ? 0 : -1,
    'data-active': isActive ? '' : undefined,
    onFocus(e) {
      domProps.onFocus?.(e);
      renderElementProps.onFocus?.(e);
      onNavigate(index);
    },
  };

  return renderJsx(render, computedProps);
});
