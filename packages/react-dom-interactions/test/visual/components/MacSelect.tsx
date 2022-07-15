import {
  useFloating,
  flip,
  size,
  autoUpdate,
  SideObject,
  useInteractions,
  inner,
  useInnerOffset,
  useClick,
  useListNavigation,
  useDismiss,
  useRole,
  useTypeahead,
  FloatingFocusManager,
  FloatingOverlay,
  offset,
  shift,
} from '@floating-ui/react-dom-interactions';
import {useCallback, useLayoutEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';

import './MacSelect.css';

const fruits = [
  '🍒 Cherry',
  '🍓 Strawberry',
  '🍇 Grape',
  '🍎 Apple',
  '🍉 Watermelon',
  '🍑 Peach',
  '🍊 Orange',
  '🍋 Lemon',
  '🍍 Pineapple',
  '🍌 Banana',
  '🥑 Avocado',
  '🍏 Green Apple',
  '🍈 Melon',
  '🍐 Pear',
  '🥝 Kiwifruit',
  '🥭 Mango',
  '🥥 Coconut',
  '🍅 Tomato',
  '🫐 Blueberry',
];

const getParts = (fruitString: string) => ({
  emoji: fruitString.slice(0, 3),
  text: fruitString.slice(3),
});

function ScrollArrow({
  open,
  dir,
  floatingRef,
  arrowRef,
  scrollTop,
  onScroll,
  onHide,
}: {
  open: boolean;
  dir: 'up' | 'down';
  floatingRef: React.MutableRefObject<HTMLElement | null>;
  arrowRef: React.MutableRefObject<HTMLElement | null>;
  scrollTop: number;
  onScroll: (amount: number) => void;
  onHide: () => void;
}) {
  const {x, y, reference, floating, strategy, update, refs} = useFloating({
    strategy: 'fixed',
    placement: dir === 'up' ? 'top' : 'bottom',
    middleware: [offset(({rects}) => -rects.floating.height)],
    whileElementsMounted: (...args) =>
      autoUpdate(...args, {animationFrame: true}),
  });

  const [element, setElement] = useState<HTMLElement | null>(null);
  const frameRef = useRef<any>();
  const statusRef = useRef<'idle' | 'active'>('idle');
  // Padding for .scrollTop for when to show the scroll arrow
  const SCROLL_ARROW_PADDING = 10;

  useLayoutEffect(() => {
    if (open) {
      setElement(floatingRef.current);
      reference(floatingRef.current);
      requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(frameRef.current);
    }
  }, [open, floatingRef, reference, update]);

  useLayoutEffect(() => {
    if (refs.floating.current == null && statusRef.current === 'active') {
      onHide();
    }
    // Assuming `onHide` does not change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTop, refs]);

  useLayoutEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handlePointerEnter = () => {
    statusRef.current = 'active';
    let prevNow = Date.now();

    function frame() {
      if (element) {
        const currentNow = Date.now();
        const msElapsed = currentNow - prevNow;
        prevNow = currentNow;

        const pixelsToScroll = msElapsed / 2;

        const remainingPixels =
          dir === 'up'
            ? element.scrollTop
            : element.scrollHeight - element.clientHeight - element.scrollTop;

        const scrollRemaining =
          dir === 'up'
            ? element.scrollTop - pixelsToScroll > 0
            : element.scrollTop + pixelsToScroll <
              element.scrollHeight - element.clientHeight;

        onScroll(
          dir === 'up'
            ? Math.min(pixelsToScroll, remainingPixels)
            : Math.max(-pixelsToScroll, -remainingPixels)
        );

        if (scrollRemaining) {
          frameRef.current = requestAnimationFrame(frame);
        }
      }
    }

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(frame);
  };

  const handlePointerLeave = () => {
    statusRef.current = 'idle';
    cancelAnimationFrame(frameRef.current);
  };

  const floatingCallback = useCallback(
    (node: HTMLElement | null) => {
      floating(node);
      arrowRef.current = node;
    },
    [arrowRef, floating]
  );

  if (!element) {
    return null;
  }

  if (
    (dir === 'up' && scrollTop < SCROLL_ARROW_PADDING) ||
    (dir === 'down' &&
      scrollTop >
        element.scrollHeight - element.clientHeight - SCROLL_ARROW_PADDING)
  ) {
    return null;
  }

  return (
    <div
      className="MacSelect-ScrollArrow"
      data-dir={dir}
      ref={floatingCallback}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        width: element.offsetWidth - 2,
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
      }}
    >
      {dir === 'up' ? '▲' : '▼'}
    </div>
  );
}

export function Main() {
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const listContentRef = useRef<Array<string | null>>([]);
  const overflowRef = useRef<null | SideObject>(null);
  const allowSelectRef = useRef(false);
  const allowMouseUpRef = useRef(true);
  const selectTimeoutRef = useRef<any>();
  const upArrowRef = useRef<HTMLDivElement | null>(null);
  const downArrowRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [fallback, setFallback] = useState(false);
  const [innerOffset, setInnerOffset] = useState(0);
  const [controlledScrolling, setControlledScrolling] = useState(false);
  const [touch, setTouch] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [blockSelection, setBlockSelection] = useState(false);

  const {x, y, reference, floating, strategy, context, refs} = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: fallback
      ? [
          offset(5),
          ...[
            touch ? shift({crossAxis: true, padding: 10}) : flip({padding: 10}),
          ],
          size({
            apply({elements, availableHeight}) {
              Object.assign(elements.floating.style, {
                maxHeight: `${availableHeight}px`,
              });
            },
            padding: 10,
          }),
        ]
      : [
          inner({
            listRef,
            overflowRef,
            index: selectedIndex,
            offset: innerOffset,
            onFallbackChange: setFallback,
            padding: 10,
            minItemsVisible: touch ? 10 : 4,
            referenceOverflowThreshold: 20,
          }),
          offset({crossAxis: -4}),
        ],
  });

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    useClick(context, {pointerDown: true}),
    useDismiss(context, {outsidePointerDown: false}),
    useRole(context, {role: 'listbox'}),
    useInnerOffset(context, {
      enabled: !fallback,
      onChange: setInnerOffset,
      overflowRef,
    }),
    useListNavigation(context, {
      listRef,
      activeIndex,
      selectedIndex,
      onNavigate: setActiveIndex,
    }),
    useTypeahead(context, {
      listRef: listContentRef,
      activeIndex,
      onMatch: open ? setActiveIndex : setSelectedIndex,
    }),
  ]);

  useLayoutEffect(() => {
    if (open) {
      selectTimeoutRef.current = setTimeout(() => {
        allowSelectRef.current = true;
      }, 300);

      return () => {
        clearTimeout(selectTimeoutRef.current);
      };
    } else {
      allowSelectRef.current = false;
      allowMouseUpRef.current = true;
      setInnerOffset(0);
      setFallback(false);
      setBlockSelection(false);
    }
  }, [open]);

  // Replacement for `useDismiss` as the arrows are outside of the floating
  // element DOM tree.
  useLayoutEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        !refs.floating.current?.contains(target) &&
        !upArrowRef.current?.contains(target) &&
        !downArrowRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('pointerdown', onPointerDown);
      return () => {
        document.removeEventListener('pointerdown', onPointerDown);
      };
    }
  }, [open, refs]);

  // Scroll the `activeIndex` item into view only in "controlledScrolling"
  // (keyboard nav) mode.
  useLayoutEffect(() => {
    if (open && controlledScrolling) {
      requestAnimationFrame(() => {
        if (activeIndex != null) {
          listRef.current[activeIndex]?.scrollIntoView({block: 'nearest'});
        }
      });
    }

    setScrollTop(refs.floating.current?.scrollTop ?? 0);
  }, [open, refs, controlledScrolling, activeIndex]);

  // Scroll the `selectedIndex` into view upon opening the floating element.
  useLayoutEffect(() => {
    if (open && fallback) {
      requestAnimationFrame(() => {
        if (selectedIndex != null) {
          listRef.current[selectedIndex]?.scrollIntoView({block: 'nearest'});
        }
      });
    }
  }, [open, fallback, selectedIndex]);

  // Unset the height limiting for fallback mode. This gets executed prior to
  // the positioning call.
  useLayoutEffect(() => {
    if (refs.floating.current && fallback) {
      refs.floating.current.style.maxHeight = '';
    }
  }, [refs, fallback]);

  const handleArrowScroll = (amount: number) => {
    if (fallback) {
      if (refs.floating.current) {
        refs.floating.current.scrollTop -= amount;
        flushSync(() => setScrollTop(refs.floating.current?.scrollTop ?? 0));
      }
    } else {
      flushSync(() => setInnerOffset((value) => value - amount));
    }
  };

  const handleArrowHide = () => {
    if (touch) {
      clearTimeout(selectTimeoutRef.current);
      setBlockSelection(true);
      selectTimeoutRef.current = setTimeout(() => {
        setBlockSelection(false);
      }, 400);
    }
  };

  const {emoji, text} = getParts(fruits[selectedIndex]);

  return (
    <>
      <h1>Inner</h1>
      <p>
        Anchors to an element inside the floating element. Once the user has
        scrolled the floating element, it will no longer anchor to the item
        inside of it.
      </p>
      <div className="container" style={{width: 350}}>
        <div className="scroll" style={{position: 'relative'}}>
          <button
            ref={reference}
            className="MacSelect-button"
            {...getReferenceProps({
              onTouchStart() {
                setTouch(true);
              },
              onPointerMove({pointerType}) {
                if (pointerType === 'mouse') {
                  setTouch(false);
                }
              },
            })}
          >
            <span aria-hidden="true">{emoji}</span>
            <span>{text}</span>
          </button>
          {open && (
            <FloatingOverlay lockScroll={!touch} style={{zIndex: 1}}>
              <FloatingFocusManager context={context} preventTabbing>
                <div
                  ref={floating}
                  className="MacSelect"
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                  }}
                  {...getFloatingProps({
                    onScroll({currentTarget}) {
                      // In React 18, the ScrollArrows need to synchronously
                      // know this value to prevent painting at the wrong
                      // time.
                      flushSync(() => setScrollTop(currentTarget.scrollTop));
                    },
                    onKeyDown() {
                      setControlledScrolling(true);
                    },
                    onPointerMove() {
                      setControlledScrolling(false);
                    },
                    onContextMenu(e) {
                      e.preventDefault();
                    },
                  })}
                >
                  {fruits.map((fruit, i) => {
                    const {emoji, text} = getParts(fruit);
                    return (
                      <button
                        key={fruit}
                        // Prevent immediate selection on touch devices when
                        // pressing the ScrollArrows
                        disabled={blockSelection}
                        aria-selected={selectedIndex === i}
                        role="option"
                        style={{
                          background:
                            activeIndex === i
                              ? 'rgba(0,200,255,0.2)'
                              : i === selectedIndex
                              ? 'rgba(0,0,50,0.05)'
                              : 'transparent',
                          fontWeight: i === selectedIndex ? 'bold' : '',
                        }}
                        ref={(node) => {
                          listRef.current[i] = node;
                          listContentRef.current[i] = text;
                        }}
                        {...getItemProps({
                          onTouchStart() {
                            allowSelectRef.current = true;
                            allowMouseUpRef.current = false;
                          },
                          onKeyDown() {
                            allowSelectRef.current = true;
                          },
                          onClick() {
                            if (allowSelectRef.current) {
                              setSelectedIndex(i);
                              setOpen(false);
                            }
                          },
                          onMouseUp() {
                            if (!allowMouseUpRef.current) {
                              return;
                            }

                            if (allowSelectRef.current) {
                              setSelectedIndex(i);
                              setOpen(false);
                            }

                            // On touch devices, prevent the element from
                            // immediately closing `onClick` by deferring it
                            clearTimeout(selectTimeoutRef.current);
                            selectTimeoutRef.current = setTimeout(() => {
                              allowSelectRef.current = true;
                            });
                          },
                        })}
                      >
                        <span aria-hidden="true">{emoji}</span>
                        <span>{text}</span>
                      </button>
                    );
                  })}
                </div>
              </FloatingFocusManager>
              {(['up', 'down'] as Array<'up' | 'down'>).map((dir) => (
                <ScrollArrow
                  key={dir}
                  dir={dir}
                  scrollTop={scrollTop}
                  arrowRef={dir === 'up' ? upArrowRef : downArrowRef}
                  floatingRef={refs.floating}
                  open={open}
                  onScroll={handleArrowScroll}
                  onHide={handleArrowHide}
                />
              ))}
            </FloatingOverlay>
          )}
        </div>
      </div>
    </>
  );
}
