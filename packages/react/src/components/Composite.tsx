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

const CompositeContext = React.createContext<{
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}>({
  activeIndex: 0,
  setActiveIndex: () => {},
});

type RenderProp =
  | JSX.Element
  | ((props: React.HTMLProps<HTMLElement>) => JSX.Element);

interface CompositeProps {
  render?: RenderProp;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  cols?: number;
  disabledIndices?: number[];
}

const horizontalKeys = ['ArrowLeft', 'ArrowRight'];
const verticalKeys = ['ArrowUp', 'ArrowDown'];
const allKeys = [...horizontalKeys, ...verticalKeys];

export const Composite = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement> & CompositeProps
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

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!allKeys.includes(event.key)) return;

    const minIndex = getMinIndex(elementsRef, disabledIndices);
    const maxIndex = getMaxIndex(elementsRef, disabledIndices);
    const prevIndex = activeIndex;

    let nextIndex = activeIndex;

    // Grid navigation.
    if (cols > 1) {
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

      if (orientation === 'both') {
        setActiveIndex(nextIndex);
        return;
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

    if (
      nextIndex === activeIndex &&
      [...toEndKeys, ...toStartKeys].includes(event.key)
    ) {
      if (nextIndex === maxIndex && toEndKeys.includes(event.key)) {
        nextIndex = minIndex;
      } else if (nextIndex === minIndex && toStartKeys.includes(event.key)) {
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

      if (horizontalKeys.includes(event.key)) {
        event.preventDefault();
      }

      setActiveIndex(nextIndex);

      // Wait for FocusManager `returnFocus` to execute.
      queueMicrotask(() => {
        enqueueFocus(elementsRef.current[nextIndex]);
      });
    }
  }

  const computedProps = {
    ...props,
    ...renderElementProps,
    ref: forwardedRef,
    onKeyDown(e: React.KeyboardEvent<any>) {
      props.onKeyDown?.(e);
      renderElementProps.onKeyDown?.(e);
      handleKeyDown(e);
    },
  };

  let jsx = null;
  if (typeof render === 'function') {
    jsx = render(computedProps);
  } else if (render) {
    jsx = React.cloneElement(render, computedProps);
  } else {
    jsx = <span {...computedProps} />;
  }

  return (
    <CompositeContext.Provider value={contextValue}>
      <FloatingList elementsRef={elementsRef}>{jsx}</FloatingList>
    </CompositeContext.Provider>
  );
});

export const CompositeItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLElement> & {render?: RenderProp}
>(function CompositeItem({render, ...props}, forwardedRef) {
  const renderElementProps =
    render && typeof render !== 'function' ? render.props : {};

  const {activeIndex, setActiveIndex} = React.useContext(CompositeContext);
  const {ref, index} = useListItem();
  const mergedRef = useMergeRefs([ref, forwardedRef, renderElementProps.ref]);

  const computedProps = {
    ...props,
    ...renderElementProps,
    ref: mergedRef,
    tabIndex: activeIndex === index ? 0 : -1,
    'data-active': activeIndex === index ? '' : undefined,
    onFocus(e: React.FocusEvent<any>) {
      props.onFocus?.(e);
      renderElementProps.onFocus?.(e);
      setActiveIndex(index);
    },
  };

  let jsx = null;
  if (typeof render === 'function') {
    jsx = render(computedProps);
  } else if (render) {
    jsx = React.cloneElement(render, computedProps);
  } else {
    jsx = <span {...computedProps} />;
  }

  return jsx;
});
