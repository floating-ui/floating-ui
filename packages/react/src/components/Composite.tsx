import * as React from 'react';

import {useMergeRefs} from '../hooks/useMergeRefs';
import {
  ARROW_DOWN,
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_UP,
  findNonDisabledIndex,
  getGridNavigatedIndex,
  getMaxIndex,
  getMinIndex,
  isIndexOutOfBounds,
} from '../utils/composite';
import {enqueueFocus} from '../utils/enqueueFocus';
import {FloatingList, useListItem} from './FloatingList';

function renderJsx(
  render: RenderProp | undefined,
  computedProps: React.HTMLAttributes<HTMLElement>
) {
  if (typeof render === 'function') {
    return render(computedProps);
  } else if (render) {
    return React.cloneElement(render, computedProps);
  }
  return <div {...computedProps} />;
}

const CompositeContext = React.createContext<{
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}>({
  activeIndex: 0,
  setActiveIndex: () => {},
});

type RenderProp =
  | JSX.Element
  | ((props: React.HTMLAttributes<HTMLElement>) => JSX.Element);

interface CompositeProps {
  render?: RenderProp;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  cols?: number;
  disabledIndices?: number[];
}

const horizontalKeys = [ARROW_LEFT, ARROW_RIGHT];
const verticalKeys = [ARROW_UP, ARROW_DOWN];
const allKeys = [...horizontalKeys, ...verticalKeys];

export const Composite = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & CompositeProps
>(function Composite(
  {
    render,
    orientation = 'both',
    loop = true,
    cols = 1,
    disabledIndices,
    ...props
  },
  forwardedRef
) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const elementsRef = React.useRef<Array<HTMLDivElement | null>>([]);
  const renderElementProps =
    render && typeof render !== 'function' ? render.props : {};
  const contextValue = React.useMemo(
    () => ({activeIndex, setActiveIndex}),
    [activeIndex]
  );
  const isGrid = cols > 1;

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (!allKeys.includes(event.key)) return;

    const minIndex = getMinIndex(elementsRef, disabledIndices);
    const maxIndex = getMaxIndex(elementsRef, disabledIndices);
    const prevIndex = activeIndex;

    let nextIndex = activeIndex;

    if (isGrid) {
      nextIndex = getGridNavigatedIndex(elementsRef, {
        event,
        orientation,
        loop,
        cols,
        disabledIndices,
        minIndex,
        maxIndex,
        prevIndex,
      });
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

      setActiveIndex(nextIndex);

      // Wait for FocusManager `returnFocus` to execute.
      queueMicrotask(() => {
        enqueueFocus(elementsRef.current[nextIndex]);
      });
    }
  }

  const computedProps: React.HTMLAttributes<HTMLElement> = {
    ...props,
    ...renderElementProps,
    ref: forwardedRef,
    'aria-orientation': orientation === 'both' ? undefined : orientation,
    onKeyDown(e) {
      props.onKeyDown?.(e);
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

export const CompositeItem = React.forwardRef<
  HTMLElement,
  React.HTMLProps<HTMLElement> & {render?: RenderProp}
>(function CompositeItem({render, ...props}, forwardedRef) {
  const renderElementProps =
    render && typeof render !== 'function' ? render.props : {};

  const {activeIndex, setActiveIndex} = React.useContext(CompositeContext);
  const {ref, index} = useListItem();
  const mergedRef = useMergeRefs([ref, forwardedRef, renderElementProps.ref]);
  const isActive = activeIndex === index;

  const computedProps: React.HTMLAttributes<HTMLElement> = {
    ...props,
    ...renderElementProps,
    ref: mergedRef,
    tabIndex: isActive ? 0 : -1,
    'data-active': isActive ? '' : undefined,
    onFocus(e) {
      props.onFocus?.(e);
      renderElementProps.onFocus?.(e);
      setActiveIndex(index);
    },
  };

  return renderJsx(render, computedProps);
});
