import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
import {
  useFloating,
  offset,
  flip,
  useListNavigation,
  useTypeahead,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  FloatingFocusManager,
  autoUpdate,
  size,
  detectOverflow,
  FloatingPortal,
  FloatingOverlay,
  ContextData,
} from '@floating-ui/react-dom-interactions';

const decades = ['1990s', '2000s', '2010s', '2020s'];
const films = [
  {
    name: 'Toy Story',
    icon: 'https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg',
    decade: '1990s',
  },
  {
    name: 'A Bugs Life',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/cc/A_Bug%27s_Life.jpg',
    decade: '1990s',
  },
  {
    name: 'Toy Story 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/c0/Toy_Story_2.jpg',
    decade: '1990s',
  },
  {
    name: 'Monsters, Inc.',
    icon: 'https://upload.wikimedia.org/wikipedia/en/6/63/Monsters_Inc.JPG',
    decade: '2000s',
  },
  {
    name: 'Finding Nemo',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/29/Finding_Nemo.jpg',
    decade: '2000s',
  },
  {
    name: 'The Incredibles',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/27/The_Incredibles_%282004_animated_feature_film%29.jpg',
    decade: '2000s',
  },
  {
    name: 'Cars',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/34/Cars_2006.jpg',
    decade: '2000s',
  },
  {
    name: 'Ratatouille',
    icon: 'https://upload.wikimedia.org/wikipedia/en/5/50/RatatouillePoster.jpg',
    decade: '2000s',
  },
  {
    name: 'WALL-E',
    icon: 'https://upload.wikimedia.org/wikipedia/en/c/c2/WALL-Eposter.jpg',
    decade: '2000s',
  },
  {
    name: 'Up',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/05/Up_%282009_film%29.jpg',
    decade: '2000s',
  },
  {
    name: 'Cars 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Cars_2_Poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Toy Story 3',
    icon: 'https://upload.wikimedia.org/wikipedia/en/6/69/Toy_Story_3_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Brave',
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/96/Brave_Poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Monsters University',
    icon: 'https://upload.wikimedia.org/wikipedia/en/2/2a/Monsters_University_poster_3.jpg',
    decade: '2010s',
  },
  {
    name: 'Inside Out',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Inside_Out_%282015_film%29_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'The Good Dinosaur',
    icon: 'https://upload.wikimedia.org/wikipedia/en/8/80/The_Good_Dinosaur_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Finding Dory',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Finding_Dory.jpg',
    decade: '2010s',
  },
  {
    name: 'Cars 3',
    icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Cars_3_poster.jpg/220px-Cars_3_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Coco',
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Coco_%282017_film%29_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Incredibles 2',
    icon: 'https://upload.wikimedia.org/wikipedia/en/1/1f/Incredibles_2_%282018_animated_film%29.jpg',
    decade: '2010s',
  },
  {
    name: 'Toy Story 4',
    icon: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Toy_Story_4_poster.jpg',
    decade: '2010s',
  },
  {
    name: 'Onward',
    icon: 'https://upload.wikimedia.org/wikipedia/en/0/03/Onward_poster.jpg',
    decade: '2020s',
  },
  {
    name: 'Soul',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/39/Soul_%282020_film%29_poster.jpg',
    decade: '2020s',
  },
  {
    name: 'Luca',
    icon: 'https://upload.wikimedia.org/wikipedia/en/3/33/Luca_%282021_film%29.png',
    decade: '2020s',
  },
];

export function Main() {
  return (
    <div className="App">
      <div>
        <h1>Floating UI macOS select</h1>
        <Select
          value=""
          render={(selectedIndex) => (
            <div>
              {films[selectedIndex] ? (
                <img
                  className="OptionIcon"
                  alt="Poster"
                  src={films[selectedIndex]?.icon}
                />
              ) : null}
              {films[selectedIndex]?.name ?? 'Select...'}{' '}
            </div>
          )}
          onChange={console.log}
        >
          {decades.map((decade) => (
            <OptionGroup key={decade} label={decade}>
              {films
                .filter((item) => item.decade === decade)
                .map(({name, icon}) => (
                  <Option key={name} value={name}>
                    <div>
                      {icon && (
                        <img className="OptionIcon" alt="Poster" src={icon} />
                      )}{' '}
                      <span>{name}</span>
                    </div>
                  </Option>
                ))}
            </OptionGroup>
          ))}
        </Select>

        <h3>Notes</h3>
        <p>
          <strong style={{color: 'pink'}}>This is an experiment!</strong> The
          macOS select positioning has a ton of nuances and edge cases to
          handle. The code is pretty messy and there are a lot of hacks. In the
          future, Floating UI may export these types of components in a
          (non-hacky/reliable) way.
        </p>

        <p>
          There are several improvements that can be made notably for touch
          devices when the `max-height` changes upon `touchmove`as it lacks
          momentum scrolling that `wheel` has.
        </p>
      </div>
    </div>
  );
}

// Cross browser fixes for pinch-zooming/backdrop-filter 🙄
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
if (isFirefox) {
  document.body.classList.add('firefox');
}
function getVisualOffsetTop() {
  return !/^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    ? visualViewport.offsetTop
    : 0;
}

const WINDOW_PADDING = 8;
const SCROLL_ARROW_VELOCITY = 8;
const SCROLL_ARROW_THRESHOLD = 8;
const MIN_HEIGHT = 80;
const FALLBACK_THRESHOLD = 16;

interface SelectContextValue {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  listRef: React.MutableRefObject<Array<HTMLLIElement | null>>;
  open: boolean;
  setOpen: (open: boolean) => void;
  onChange: (value: string) => void;
  dataRef: React.MutableRefObject<ContextData>;
  getItemProps: (userProps?: React.HTMLProps<HTMLElement>) => any;
  controlledScrolling: boolean;
}

const SelectContext = createContext({} as SelectContextValue);

function getFloatingPadding(floating: HTMLElement | null) {
  if (!floating) {
    return 0;
  }

  return Number(getComputedStyle(floating).paddingLeft?.replace('px', ''));
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 512 512">
      <g
        transform="translate(0,512) scale(0.1,-0.1)"
        fill="currentColor"
        stroke="none"
      >
        <path
          d="M4468 4401 c-36 -10 -88 -31 -115 -46 -32 -18 -446 -425 -1245 -1224
l-1198 -1196 -532 531 c-293 292 -555 546 -581 563 -163 110 -396 111 -563 3
-174 -113 -264 -327 -221 -529 34 -158 -4 -114 824 -944 509 -510 772 -766
808 -788 108 -65 264 -87 389 -55 146 38 67 -37 1582 1478 896 896 1411 1418
1428 1447 52 92 69 156 69 269 0 155 -42 259 -146 363 -127 127 -320 176 -499
128z"
        />
      </g>
    </svg>
  );
}

function Arrow({dir}: {dir: 'down' | 'up'}) {
  return (
    <div
      style={{
        display: 'flex',
        transform: dir === 'up' ? 'rotate(180deg)' : undefined,
      }}
    >
      <svg width={16} height={16} viewBox="0 0 512 512">
        <g
          transform={`translate(0,512) scale(0.1,-0.1)`}
          fill="currentColor"
          stroke="none"
        >
          <path
            d="M783 3543 c-29 -6 -63 -49 -63 -79 0 -15 20 -46 52 -81 29 -32 434
-451 901 -930 834 -858 849 -873 887 -873 38 0 53 15 887 873 467 479 872 898
901 930 59 65 64 91 28 134 l-24 28 -1774 1 c-975 1 -1783 -1 -1795 -3z"
          />
        </g>
      </svg>
    </div>
  );
}

export const Option: React.FC<{
  value: string;
  index?: number;
  children: React.ReactNode;
}> = ({index = 0, value, children}) => {
  const {
    selectedIndex,
    setSelectedIndex,
    listRef,
    open,
    setOpen,
    onChange,
    activeIndex,
    setActiveIndex,
    dataRef,
    getItemProps,
  } = useContext(SelectContext);

  const timeoutRef = useRef<any>();
  const [allowMouseUp, setAllowMouseUp] = useState(false);

  function handleSelect() {
    setSelectedIndex(index);
    onChange(value);
    setOpen(false);
  }

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (open) {
      timeoutRef.current = setTimeout(() => {
        setAllowMouseUp(true);
      }, 500);
    } else {
      setAllowMouseUp(false);
    }
  }, [open, index, setActiveIndex, activeIndex, selectedIndex]);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (
      event.key === 'Enter' ||
      (event.key === ' ' && !dataRef.current.typing)
    ) {
      event.preventDefault();
      handleSelect();
    }
  }

  return (
    <li
      className="Option"
      role="option"
      ref={(node) => (listRef.current[index] = node)}
      tabIndex={-1}
      // activeIndex === index prevents VoiceOver stuttering.
      aria-selected={activeIndex === index && selectedIndex === index}
      data-selected={selectedIndex === index}
      {...getItemProps({
        onClick: allowMouseUp ? handleSelect : undefined,
        onMouseUp: allowMouseUp ? handleSelect : undefined,
        onKeyDown: handleKeyDown,
      })}
    >
      {children} {selectedIndex === index && <CheckIcon />}
    </li>
  );
};

export const OptionGroup: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({children, label}) => {
  return (
    <li className="OptionGroup">
      <div className="OptionGroupLabel">{label}</div>
      <ul>{children}</ul>
    </li>
  );
};

const ScrollArrow: React.FC<{
  dir: 'up' | 'down';
  onScroll: () => void;
  floatingRef: React.MutableRefObject<HTMLElement | null>;
}> = ({dir, onScroll, floatingRef}) => {
  const intervalRef = useRef<any>();
  const loopingRef = useRef(false);

  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    strategy: 'fixed',
    placement: dir === 'up' ? 'top' : 'bottom',
    middleware: [offset(({rects}) => -rects.floating.height)],
  });

  useLayoutEffect(() => {
    reference(floatingRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference, floatingRef.current]);

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return;
    }

    const cleanup = autoUpdate(
      refs.reference.current,
      refs.floating.current,
      update,
      {animationFrame: true}
    );

    return () => {
      clearInterval(intervalRef.current);
      loopingRef.current = false;
      cleanup();
    };
  }, [update, refs.floating, refs.reference]);

  return (
    <div
      ref={floating}
      className="ScrollArrow"
      style={{
        position: strategy,
        left: x ?? '',
        top: y ?? '',
        width: `calc(${(floatingRef.current?.offsetWidth ?? 0) - 2}px)`,
        background: `linear-gradient(to ${
          dir === 'up' ? 'bottom' : 'top'
        }, #29282b 50%, rgba(53, 54, 55, 0.01))`,
      }}
      onPointerMove={() => {
        if (!loopingRef.current) {
          intervalRef.current = setInterval(onScroll, 1000 / 60);
          loopingRef.current = true;
        }
      }}
      onPointerLeave={() => {
        loopingRef.current = false;
        clearInterval(intervalRef.current);
      }}
    >
      {dir === 'up' ? <Arrow dir="up" /> : <Arrow dir="down" />}
    </div>
  );
};

export const Select: React.FC<{
  onChange: (value: string) => void;
  render: (selectedIndex: number) => React.ReactNode;
  value: string;
  children?: React.ReactNode;
}> = ({children, value, render, onChange = () => {}}) => {
  const listItemsRef = useRef<Array<HTMLLIElement | null>>([]);
  const listContentRef = useRef([
    'Select...',
    ...(Children.map(children, (child) =>
      Children.map(
        isValidElement(child) && child.props.children,
        (child) => child.props.value
      )
    ) ?? []),
  ]);

  const [middlewareType, setMiddlewareType] = useState<'align' | 'fallback'>(
    'align'
  );
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(
    Math.max(0, listContentRef.current.indexOf(value))
  );
  const [scrollTop, setScrollTop] = useState(0);
  const [controlledScrolling, setControlledScrolling] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const forceUpdate = useReducer(() => ({}), {})[1];

  const selectedIndexRef = useRef<number | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const prevActiveIndex = usePrevious<number | null>(activeIndex);

  useLayoutEffect(() => {
    selectedIndexRef.current = selectedIndex;
    activeIndexRef.current = activeIndex;
  });

  const {
    x,
    y,
    reference,
    floating,
    strategy,
    context,
    refs,
    middlewareData,
    update,
  } = useFloating({
    open,
    onOpenChange(open) {
      console.trace(open);
      setOpen(open);
    },
    placement: 'bottom',
    middleware:
      middlewareType === 'align'
        ? [
            offset(({rects}) => {
              const index = activeIndexRef.current ?? selectedIndexRef.current;

              if (index == null) {
                return 0;
              }

              const item = listItemsRef.current[index];

              if (item == null) {
                return 0;
              }

              const offsetTop = item.offsetTop;
              const itemHeight = item.offsetHeight;
              const height = rects.reference.height;

              return -offsetTop - height - (itemHeight - height) / 2;
            }),
            // Custom `size` that can handle the opposite direction of the
            // placement
            {
              name: 'size',
              async fn(args) {
                const {
                  elements: {floating},
                  rects: {reference},
                  middlewareData,
                } = args;

                const overflow = await detectOverflow(args, {
                  padding: WINDOW_PADDING,
                });

                const top = Math.max(0, overflow.top);
                const bottom = Math.max(0, overflow.bottom);
                const nextY = args.y + top;

                if (middlewareData.size?.skip) {
                  return {
                    y: nextY,
                    data: {
                      y: middlewareData.size.y,
                    },
                  };
                }

                Object.assign(floating.style, {
                  maxHeight: `${
                    floating.scrollHeight - Math.abs(top + bottom)
                  }px`,
                  minWidth: `${
                    reference.width + getFloatingPadding(floating) * 2
                  }px`,
                });

                return {
                  y: nextY,
                  data: {
                    y: top,
                    skip: true,
                  },
                  reset: {
                    rects: true,
                  },
                };
              },
            },
          ]
        : [
            offset(5),
            flip(),
            size({
              apply({rects, availableHeight, elements}) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                  maxHeight: `${availableHeight}px`,
                });
              },
              padding: WINDOW_PADDING,
            }),
          ],
  });

  const floatingRef = refs.floating;

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context, {pointerDown: true}),
    useRole(context, {role: 'listbox'}),
    useDismiss(context),
    useListNavigation(context, {
      listRef: listItemsRef,
      activeIndex,
      selectedIndex,
      onNavigate: setActiveIndex,
      focusItemOnOpen: middlewareType === 'align',
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      onMatch: open ? setActiveIndex : setSelectedIndex,
      selectedIndex,
      activeIndex,
    }),
  ]);

  const increaseHeight = useCallback(
    (floating: HTMLElement, amount = 0) => {
      if (middlewareType === 'fallback') {
        return;
      }

      const currentMaxHeight = Number(
        floating.style.maxHeight.replace('px', '')
      );
      const currentTop = Number(floating.style.top.replace('px', ''));
      const rect = floating.getBoundingClientRect();
      const rectTop = rect.top;
      const rectBottom = rect.bottom;
      const visualMaxHeight = visualViewport.height - WINDOW_PADDING * 2;

      if (
        amount < 0 &&
        selectedIndexRef.current != null &&
        Math.round(rectBottom) <
          Math.round(
            visualViewport.height + getVisualOffsetTop() - WINDOW_PADDING
          )
      ) {
        floating.style.maxHeight = `${Math.min(
          visualMaxHeight,
          currentMaxHeight - amount
        )}px`;
      }

      if (
        amount > 0 &&
        Math.round(rectTop) >
          Math.round(WINDOW_PADDING - getVisualOffsetTop()) &&
        floating.scrollHeight > floating.offsetHeight
      ) {
        const nextTop = Math.max(
          WINDOW_PADDING + getVisualOffsetTop() + window.scrollY,
          currentTop - amount
        );

        const nextMaxHeight = Math.min(
          visualMaxHeight,
          currentMaxHeight + amount
        );

        Object.assign(floating.style, {
          maxHeight: `${nextMaxHeight}px`,
          top: `${nextTop}px`,
        });

        if (nextTop - WINDOW_PADDING - window.scrollY > getVisualOffsetTop()) {
          floating.scrollTop -=
            nextMaxHeight - currentMaxHeight + getFloatingPadding(floating);
        }

        return currentTop - nextTop;
      }
    },
    [middlewareType]
  );

  const handleScrollArrowChange = (dir: 'up' | 'down') => () => {
    const floating = floatingRef.current;
    const isUp = dir === 'up';
    if (floating) {
      const value = isUp ? -SCROLL_ARROW_VELOCITY : SCROLL_ARROW_VELOCITY;
      const multi =
        (isUp && floating.scrollTop <= SCROLL_ARROW_THRESHOLD * 2) ||
        (!isUp &&
          floating.scrollTop >=
            floating.scrollHeight -
              floating.clientHeight -
              SCROLL_ARROW_THRESHOLD * 2)
          ? 2
          : 1;
      floating.scrollTop +=
        multi * (isUp ? -SCROLL_ARROW_VELOCITY : SCROLL_ARROW_VELOCITY);

      increaseHeight(floating, multi === 2 ? value * 2 : value);
      // Ensure derived data (scroll arrows) is fresh
      forceUpdate();
    }
  };

  const touchPageYRef = useRef<number | null>(null);

  const handleWheel = useCallback(
    (event: WheelEvent | TouchEvent) => {
      const pinching = event.ctrlKey;

      const currentTarget = event.currentTarget as HTMLElement;

      function isWheelEvent(event: any): event is WheelEvent {
        return typeof event.deltaY === 'number';
      }

      function isTouchEvent(event: any): event is TouchEvent {
        return event.touches != null;
      }

      if (
        Math.abs(
          (currentTarget?.offsetHeight ?? 0) -
            (visualViewport.height - WINDOW_PADDING * 2)
        ) > 1 &&
        !pinching
      ) {
        event.preventDefault();
      } else if (isWheelEvent(event) && isFirefox) {
        // Firefox needs this to propagate scrolling
        // during momentum scrolling phase if the
        // height reached its maximum (at boundaries)
        currentTarget.scrollTop += event.deltaY;
      }

      if (!pinching) {
        let delta = 5;

        if (isTouchEvent(event)) {
          const currentPageY = touchPageYRef.current;
          const pageY = event.touches[0]?.pageY;

          if (pageY != null) {
            touchPageYRef.current = pageY;

            if (currentPageY != null) {
              delta = currentPageY - pageY;
            }
          }
        }

        increaseHeight(
          currentTarget,
          isWheelEvent(event) ? event.deltaY : delta
        );
        setScrollTop(currentTarget.scrollTop);
        // Ensure derived data (scroll arrows) is fresh
        forceUpdate();
      }
    },
    [increaseHeight, forceUpdate]
  );

  // Handle `onWheel` event in an effect to remove the `passive` option so we
  // can .preventDefault() it
  useEffect(() => {
    function onTouchEnd() {
      touchPageYRef.current = null;
    }

    const floating = floatingRef.current;
    if (open && floating && middlewareType === 'align') {
      floating.addEventListener('wheel', handleWheel);
      floating.addEventListener('touchmove', handleWheel);
      floating.addEventListener('touchend', onTouchEnd, {passive: true});
      return () => {
        floating.removeEventListener('wheel', handleWheel);
        floating.removeEventListener('touchmove', handleWheel);
        floating.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, [open, floatingRef, handleWheel, middlewareType]);

  // Ensure the menu remains attached to the reference element when resizing.
  useEffect(() => {
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
    };
  }, [update]);

  // Scroll the active or selected item into view when in `controlledScrolling`
  // mode (i.e. arrow key nav).
  useLayoutEffect(() => {
    const floating = floatingRef.current;

    if (open && controlledScrolling && floating) {
      const item =
        activeIndex != null
          ? listItemsRef.current[activeIndex]
          : selectedIndex != null
          ? listItemsRef.current[selectedIndex]
          : null;

      if (item && prevActiveIndex != null) {
        const itemHeight =
          listItemsRef.current[prevActiveIndex]?.offsetHeight ?? 0;

        const floatingHeight = floating.offsetHeight;
        const top = item.offsetTop;
        const bottom = top + itemHeight;

        if (top < floating.scrollTop + 20) {
          const diff = floating.scrollTop - top + 20;
          floating.scrollTop -= diff;

          if (activeIndex != selectedIndex && activeIndex != null) {
            increaseHeight(floating, -diff);
          }
        } else if (bottom > floatingHeight + floating.scrollTop - 20) {
          const diff = bottom - floatingHeight - floating.scrollTop + 20;

          floating.scrollTop += diff;

          if (activeIndex != selectedIndex && activeIndex != null) {
            floating.scrollTop -= increaseHeight(floating, diff) ?? 0;
          }
        }
      }
    }
  }, [
    open,
    controlledScrolling,
    prevActiveIndex,
    activeIndex,
    selectedIndex,
    floatingRef,
    increaseHeight,
  ]);

  // Sync the height and the scrollTop values and device whether to use fallback
  // positioning.
  useLayoutEffect(() => {
    const floating = refs.floating.current;
    const reference = refs.reference.current;

    if (
      open &&
      floating &&
      reference &&
      floating.offsetHeight < floating.scrollHeight
    ) {
      const referenceRect = reference.getBoundingClientRect();

      if (middlewareType === 'fallback') {
        const item = listItemsRef.current[selectedIndex];
        if (item) {
          floating.scrollTop =
            item.offsetTop - floating.clientHeight + referenceRect.height;
        }
        return;
      }

      floating.scrollTop = middlewareData.size?.y;

      const closeToBottom =
        visualViewport.height + getVisualOffsetTop() - referenceRect.bottom <
        FALLBACK_THRESHOLD;
      const closeToTop = referenceRect.top < FALLBACK_THRESHOLD;

      if (floating.offsetHeight < MIN_HEIGHT || closeToTop || closeToBottom) {
        setMiddlewareType('fallback');
      }
    }
  }, [
    open,
    increaseHeight,
    selectedIndex,
    middlewareType,
    refs.floating,
    refs.reference,
    // Always re-run this effect when the position has been computed so the
    // .scrollTop change works with fresh sizing.
    middlewareData,
  ]);

  useLayoutEffect(() => {
    if (open && selectedIndex != null) {
      requestAnimationFrame(() => {
        listItemsRef.current[selectedIndex]?.focus({preventScroll: true});
      });
    }
  }, [listItemsRef, selectedIndex, open]);

  // Wait for scroll position to settle before showing arrows to prevent
  // interference with pointer events.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShowArrows(open);

      if (!open) {
        setScrollTop(0);
        setMiddlewareType('align');
        setActiveIndex(null);
        setControlledScrolling(false);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const showUpArrow = showArrows && scrollTop > SCROLL_ARROW_THRESHOLD;
  const showDownArrow =
    showArrows &&
    floatingRef.current &&
    scrollTop <
      floatingRef.current.scrollHeight -
        floatingRef.current.clientHeight -
        SCROLL_ARROW_THRESHOLD;

  let optionIndex = 0;
  const options = [
    <ul key="default">
      <Option value="default">Select...</Option>
    </ul>,
    ...(Children.map(
      children,
      (child) =>
        isValidElement(child) && (
          <ul
            key={child.props.label}
            role="group"
            aria-labelledby={`floating-ui-select-${child.props.label}`}
          >
            <li
              role="presentation"
              id={`floating-ui-select-${child.props.label}`}
              className="SelectGroupLabel"
              aria-hidden="true"
            >
              {child.props.label}
            </li>
            {Children.map(child.props.children, (child) =>
              cloneElement(child, {index: 1 + optionIndex++})
            )}
          </ul>
        )
    ) ?? []),
  ];

  return (
    <SelectContext.Provider
      value={{
        selectedIndex,
        setSelectedIndex,
        activeIndex,
        setActiveIndex,
        open,
        setOpen,
        onChange,
        listRef: listItemsRef,
        dataRef: context.dataRef,
        getItemProps,
        controlledScrolling,
      }}
    >
      <button
        {...getReferenceProps({
          ref: reference,
          className: 'SelectButton',
          onKeyDown(event) {
            if (
              event.key === 'Enter' ||
              (event.key === ' ' && !context.dataRef.current.typing)
            ) {
              event.preventDefault();
              setOpen(true);
            }
          },
        })}
      >
        {render(selectedIndex - 1)}
        <Arrow dir="down" />
      </button>
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll>
            {showUpArrow && (
              <ScrollArrow
                dir="up"
                floatingRef={floatingRef}
                onScroll={handleScrollArrowChange('up')}
              />
            )}
            <FloatingFocusManager context={context} preventTabbing>
              <div
                {...getFloatingProps({
                  ref: floating,
                  className: 'Select',
                  style: {
                    position: strategy,
                    top: y ?? '',
                    left: x ?? '',
                  },
                  onPointerEnter() {
                    setControlledScrolling(false);
                  },
                  onPointerMove() {
                    setControlledScrolling(false);
                  },
                  onKeyDown() {
                    setControlledScrolling(true);
                  },
                  onScroll(event) {
                    setScrollTop(event.currentTarget.scrollTop);
                  },
                })}
              >
                {options}
              </div>
            </FloatingFocusManager>
            {showDownArrow && (
              <ScrollArrow
                dir="down"
                floatingRef={floatingRef}
                onScroll={handleScrollArrowChange('down')}
              />
            )}
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </SelectContext.Provider>
  );
};
