import './MacSelect.css';

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  inner,
  offset,
  shift,
  SideObject,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import {useLayoutEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';

import {FloatingPortal} from '../../../src';

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
// Padding for .scrollTop for when to show the scroll arrow
const SCROLL_ARROW_PADDING = 10;

const shouldShowArrow = (
  scrollRef: React.MutableRefObject<HTMLDivElement | null>,
  dir: 'down' | 'up'
) => {
  if (scrollRef.current) {
    const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
    if (dir === 'up') {
      return scrollTop >= SCROLL_ARROW_PADDING;
    }

    if (dir === 'down') {
      return scrollTop <= scrollHeight - clientHeight - SCROLL_ARROW_PADDING;
    }
  }

  return false;
};

export function ScrollArrow({
  open,
  dir,
  scrollRef,
  scrollTop,
  onScroll,
  innerOffset,
  onHide,
}: {
  open: boolean;
  dir: 'up' | 'down';
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  scrollTop: number;
  innerOffset: number;
  onScroll: (amount: number) => void;
  onHide: () => void;
}) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(-1);
  const statusRef = useRef<'idle' | 'active'>('idle');

  // Updates the visibility state of the arrow when necessary.
  useLayoutEffect(() => {
    if (open) {
      // Wait for the floating element to be positioned, and
      // the item to be scrolled to.
      requestAnimationFrame(() => {
        // Paint arrows immediately in React 18.
        flushSync(() => {
          if (statusRef.current !== 'active') {
            setShow(shouldShowArrow(scrollRef, dir));
          }
        });
      });
    }
  }, [open, innerOffset, scrollTop, scrollRef, dir]);

  // While pressing the scroll arrows on touch devices,
  // prevent selection once they disappear (lift finger)
  useLayoutEffect(() => {
    if (!show && statusRef.current === 'active') {
      onHide();
    }
    // Assuming `onHide` does not change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, scrollTop]);

  useLayoutEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handlePointerEnter = () => {
    statusRef.current = 'active';
    let prevNow = Date.now();

    function frame() {
      if (scrollRef.current) {
        const currentNow = Date.now();
        const msElapsed = currentNow - prevNow;
        prevNow = currentNow;

        const pixelsToScroll = msElapsed / 2;

        const remainingPixels =
          dir === 'up'
            ? scrollRef.current.scrollTop
            : scrollRef.current.scrollHeight -
              scrollRef.current.clientHeight -
              scrollRef.current.scrollTop;

        const scrollRemaining =
          dir === 'up'
            ? scrollRef.current.scrollTop - pixelsToScroll > 0
            : scrollRef.current.scrollTop + pixelsToScroll <
              scrollRef.current.scrollHeight - scrollRef.current.clientHeight;

        onScroll(
          dir === 'up'
            ? Math.min(pixelsToScroll, remainingPixels)
            : Math.max(-pixelsToScroll, -remainingPixels)
        );

        if (scrollRemaining) {
          frameRef.current = requestAnimationFrame(frame);
        } else {
          setShow(shouldShowArrow(scrollRef, dir));
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

  return (
    <div
      className="MacSelect-ScrollArrow"
      data-dir={dir}
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        visibility: show ? 'visible' : 'hidden',
      }}
    >
      {dir === 'up' ? '▲' : '▼'}
    </div>
  );
}

export function Main() {
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const listContentRef = useRef<Array<string | null>>([]);
  const overflowRef = useRef<SideObject>(null);
  const allowSelectRef = useRef(false);
  const allowMouseUpRef = useRef(true);
  const selectTimeoutRef = useRef<any>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(12);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [fallback, setFallback] = useState(false);
  const [innerOffset, setInnerOffset] = useState(0);
  const [touch, setTouch] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [blockSelection, setBlockSelection] = useState(false);

  const {x, y, reference, floating, strategy, context} = useFloating({
    placement: 'bottom-start',
    open,
    onOpenChange: (open) => {
      setOpen(open);
    },
    whileElementsMounted: autoUpdate,
    middleware: fallback
      ? [
          offset(5),
          touch ? shift({crossAxis: true, padding: 10}) : flip({padding: 10}),
          size({
            apply({availableHeight}) {
              Object.assign(scrollRef.current?.style ?? {}, {
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
            scrollRef,
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
    useClick(context, {event: 'mousedown'}),
    useDismiss(context),
    useRole(context, {role: 'listbox'}),
    useInnerOffset(context, {
      enabled: !fallback,
      onChange: setInnerOffset,
      overflowRef,
      scrollRef,
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

  const handleArrowScroll = (amount: number) => {
    if (fallback) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop -= amount;
        flushSync(() => setScrollTop(scrollRef.current?.scrollTop ?? 0));
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
      <h1>MacSelect</h1>
      <p></p>
      <div className="container">
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
        <FloatingPortal>
          {open && (
            <FloatingOverlay lockScroll={!touch} style={{zIndex: 1}}>
              <FloatingFocusManager
                context={context}
                initialFocus={-1}
                modal={false}
              >
                <div
                  ref={floating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                  }}
                >
                  <div
                    className="MacSelect"
                    style={{overflowY: 'auto'}}
                    ref={scrollRef}
                    {...getFloatingProps({
                      onScroll({currentTarget}) {
                        setScrollTop(currentTarget.scrollTop);
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
                          tabIndex={-1}
                          style={{
                            background:
                              activeIndex === i
                                ? 'rgba(0,200,255,0.2)'
                                : i === selectedIndex
                                ? 'rgba(0,0,50,0.05)'
                                : 'transparent',
                            fontWeight: i === selectedIndex ? 'bold' : 'normal',
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
                  {(['up', 'down'] as Array<'up' | 'down'>).map((dir) => (
                    <ScrollArrow
                      key={dir}
                      dir={dir}
                      scrollTop={scrollTop}
                      scrollRef={scrollRef}
                      innerOffset={innerOffset}
                      open={open}
                      onScroll={handleArrowScroll}
                      onHide={handleArrowHide}
                    />
                  ))}
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </FloatingPortal>
      </div>
    </>
  );
}
