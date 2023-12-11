import {MaybeAccessor} from '@solid-primitives/utils';
import {
  Accessor,
  createMemo,
  createSignal,
  JSX,
  mergeProps,
  ParentComponent,
  Setter,
  Show,
  splitProps,
  untrack,
} from 'solid-js';

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
import {destructure} from '../utils/destructure';
import {enqueueFocus} from '../utils/enqueueFocus';
import {
  createFloatingListContext,
  FloatingList,
  useListItem,
} from './FloatingList';

type CompositeContextProps = {
  activeIndex: Accessor<number>;
  onNavigate(index: number): void;
};

type RenderProp =
  | (() => JSX.Element)
  | ((
      props: Accessor<Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'>>,
    ) => JSX.Element);

interface CompositeProps {
  render?: RenderProp;
  orientation?: MaybeAccessor<'horizontal' | 'vertical' | 'both'>;
  loop?: MaybeAccessor<boolean>;
  cols?: MaybeAccessor<number>;
  disabledIndices?: MaybeAccessor<number[]>;
  activeIndex?: Accessor<number>;
  onNavigate?: Setter<number>;
}

const horizontalKeys = [ARROW_LEFT, ARROW_RIGHT];
const verticalKeys = [ARROW_UP, ARROW_DOWN];
const allKeys = [...horizontalKeys, ...verticalKeys];

export const Composite: ParentComponent<
  JSX.HTMLAttributes<HTMLElement> & CompositeProps
> = (props) => {
  const [internalActiveIndex, internalSetActiveIndex] = createSignal(0);
  const [_, local, compositeProps] = splitProps(
    props,
    ['children'],
    [
      'orientation',
      'loop',
      'cols',
      'activeIndex',
      'onNavigate',
      'disabledIndices',
    ],
  );
  const mergedProps = mergeProps(
    {
      orientation: 'both',
      loop: true,
      cols: 1,
      activeIndex: internalActiveIndex,
      onNavigate: internalSetActiveIndex,
    } as Required<
      Pick<
        CompositeProps,
        'orientation' | 'loop' | 'cols' | 'activeIndex' | 'onNavigate'
      >
    >,
    local,
  );

  const {orientation, loop, cols, disabledIndices, activeIndex, onNavigate} =
    destructure(mergedProps, {normalize: true});

  const listContext = createFloatingListContext<CompositeContextProps>({
    activeIndex,
    onNavigate,
  });

  const isGrid = createMemo(() => cols() > 1);

  function handleKeyDown(event: KeyboardEvent) {
    if (!allKeys.includes(event.key)) return;
    const elementsRef = listContext.items();

    const minIndex = getMinIndex(elementsRef, disabledIndices?.());
    const maxIndex = getMaxIndex(elementsRef, disabledIndices?.());
    const prevIndex = activeIndex();

    let nextIndex = activeIndex();

    if (isGrid()) {
      nextIndex = getGridNavigatedIndex(elementsRef, {
        event,
        orientation: orientation(),
        loop: loop(),
        cols: cols(),
        disabledIndices: disabledIndices?.(),
        minIndex,
        maxIndex,
        prevIndex,
      });
    }

    const toEndKeys = {
      horizontal: [ARROW_RIGHT],
      vertical: [ARROW_DOWN],
      both: [ARROW_RIGHT, ARROW_DOWN],
    }[orientation()];

    const toStartKeys = {
      horizontal: [ARROW_LEFT],
      vertical: [ARROW_UP],
      both: [ARROW_LEFT, ARROW_UP],
    }[orientation()];

    const preventedKeys = isGrid()
      ? allKeys
      : {
          horizontal: horizontalKeys,
          vertical: verticalKeys,
          both: allKeys,
        }[orientation()];

    if (
      nextIndex === activeIndex() &&
      [...toEndKeys, ...toStartKeys].includes(event.key)
    ) {
      if (loop() && nextIndex === maxIndex && toEndKeys.includes(event.key)) {
        nextIndex = minIndex;
      } else if (
        loop() &&
        nextIndex === minIndex &&
        toStartKeys.includes(event.key)
      ) {
        nextIndex = maxIndex;
      } else {
        nextIndex = findNonDisabledIndex(elementsRef, {
          startingIndex: nextIndex,
          decrement: toStartKeys.includes(event.key),
          disabledIndices: disabledIndices?.(),
        });
      }
    }

    if (
      nextIndex !== activeIndex() &&
      !isIndexOutOfBounds(elementsRef, nextIndex)
    ) {
      event.stopPropagation();

      if (preventedKeys.includes(event.key)) {
        event.preventDefault();
      }

      onNavigate(nextIndex);

      // Wait for FocusManager `returnFocus` to execute.
      queueMicrotask(() => {
        enqueueFocus(elementsRef[nextIndex]);
      });
    }
  }

  const computedProps = createMemo(() => {
    const orientationRef = orientation();
    return {
      ...compositeProps,
      'aria-orientation':
        orientationRef === 'both' ? undefined : orientationRef,
      onKeyDown(e) {
        typeof compositeProps.onKeyDown === 'function' &&
          compositeProps.onKeyDown(e);
        handleKeyDown(e);
      },
    } as Omit<JSX.HTMLAttributes<HTMLElement>, 'ref'>;
  });

  return (
    <FloatingList context={listContext}>
      <Show
        when={!props.render}
        fallback={
          <>
            {untrack(() => {
              props.render?.(computedProps);
            })}
          </>
        }
      >
        <div {...computedProps()}>{_.children}</div>
      </Show>
    </FloatingList>
  );
};

export const CompositeItem: ParentComponent<
  JSX.HTMLAttributes<HTMLElement | HTMLDivElement> & {
    render?: RenderProp;
  }
> = (props) => {
  const [ref, setRef] = createSignal<HTMLElement | HTMLDivElement | null>(null);
  const [local, itemProps] = splitProps(props, ['render', 'children']);
  const context = useListItem<CompositeContextProps>(ref);

  const isActive = createMemo(
    () => context.activeIndex() === context.getItemIndex(ref()),
  );

  const computedProps = createMemo(() => {
    const index = context.getItemIndex(ref());

    return {
      ...itemProps,
      ref: (el: HTMLElement | HTMLDivElement) => {
        setRef(el);
        typeof itemProps.ref === 'function'
          ? itemProps.ref(el)
          : // eslint-disable-next-line solid/reactivity
            (itemProps.ref = el);
      },
      tabIndex: isActive() ? 0 : -1,
      'data-active': isActive() ? '' : undefined,
      onFocus(
        e: FocusEvent & {
          currentTarget: HTMLElement | HTMLDivElement;
          target: Element;
        },
      ) {
        itemProps.onFocus &&
          typeof itemProps.onFocus === 'function' &&
          itemProps.onFocus(e);
        context.onNavigate(index);
      },
    };
  });

  return (
    <Show
      when={!local.render}
      fallback={<>{untrack(() => local.render?.(computedProps))}</>}
    >
      <div id="test" {...computedProps()}>
        {local.children}
      </div>
    </Show>
  );
};
