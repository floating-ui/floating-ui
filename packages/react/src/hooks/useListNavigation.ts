import * as React from 'react';
import {flushSync} from 'react-dom';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {activeElement} from '../utils/activeElement';
import {contains} from '../utils/contains';
import {enqueueFocus} from '../utils/enqueueFocus';
import {getDocument} from '../utils/getDocument';
import {
  isHTMLElement,
  isMac,
  isSafari,
  isVirtualClick,
  isVirtualPointerEvent,
} from '../utils/is';
import {stopEvent} from '../utils/stopEvent';
import {useEvent} from './utils/useEvent';
import {useLatestRef} from './utils/useLatestRef';

let isPreventScrollSupported = false;

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

function isDifferentRow(index: number, cols: number, prevRow: number) {
  return Math.floor(index / cols) !== prevRow;
}

function isIndexOutOfBounds(
  listRef: React.MutableRefObject<Array<HTMLElement | null>>,
  index: number
) {
  return index < 0 || index >= listRef.current.length;
}

function findNonDisabledIndex(
  listRef: React.MutableRefObject<Array<HTMLElement | null>>,
  {
    startingIndex = -1,
    decrement = false,
    disabledIndices,
    amount = 1,
  }: {
    startingIndex?: number;
    decrement?: boolean;
    disabledIndices?: Array<number>;
    amount?: number;
  } = {}
): number {
  const list = listRef.current;

  let index = startingIndex;
  do {
    index = index + (decrement ? -amount : amount);
  } while (
    index >= 0 &&
    index <= list.length - 1 &&
    (disabledIndices
      ? disabledIndices.includes(index)
      : list[index] == null ||
        list[index]?.hasAttribute('disabled') ||
        list[index]?.getAttribute('aria-disabled') === 'true')
  );

  return index;
}

function doSwitch(
  orientation: Props['orientation'],
  vertical: boolean,
  horizontal: boolean
) {
  switch (orientation) {
    case 'vertical':
      return vertical;
    case 'horizontal':
      return horizontal;
    default:
      return vertical || horizontal;
  }
}

function isMainOrientationKey(key: string, orientation: Props['orientation']) {
  const vertical = key === ARROW_UP || key === ARROW_DOWN;
  const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal);
}

function isMainOrientationToEndKey(
  key: string,
  orientation: Props['orientation'],
  rtl: boolean
) {
  const vertical = key === ARROW_DOWN;
  const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  return (
    doSwitch(orientation, vertical, horizontal) ||
    key === 'Enter' ||
    key == ' ' ||
    key === ''
  );
}

function isCrossOrientationOpenKey(
  key: string,
  orientation: Props['orientation'],
  rtl: boolean
) {
  const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  const horizontal = key === ARROW_DOWN;
  return doSwitch(orientation, vertical, horizontal);
}

function isCrossOrientationCloseKey(
  key: string,
  orientation: Props['orientation'],
  rtl: boolean
) {
  const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
  const horizontal = key === ARROW_UP;
  return doSwitch(orientation, vertical, horizontal);
}

function getMinIndex(
  listRef: Props['listRef'],
  disabledIndices: Array<number> | undefined
) {
  return findNonDisabledIndex(listRef, {disabledIndices});
}

function getMaxIndex(
  listRef: Props['listRef'],
  disabledIndices: Array<number> | undefined
) {
  return findNonDisabledIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices,
  });
}

export interface Props {
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  activeIndex: number | null;
  onNavigate?: (index: number | null) => void;
  enabled?: boolean;
  selectedIndex?: number | null;
  focusItemOnOpen?: boolean | 'auto';
  focusItemOnHover?: boolean;
  openOnArrowKeyDown?: boolean;
  disabledIndices?: Array<number>;
  allowEscape?: boolean;
  loop?: boolean;
  nested?: boolean;
  rtl?: boolean;
  virtual?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'both';
  cols?: number;
  scrollItemIntoView?: boolean | ScrollIntoViewOptions;
}

/**
 * Adds focus-managed indexed navigation via arrow keys to a list of items
 * within the floating element.
 * @see https://floating-ui.com/docs/useListNavigation
 */
export const useListNavigation = <RT extends ReferenceType = ReferenceType>(
  {open, onOpenChange, elements: {domReference, floating}}: FloatingContext<RT>,
  {
    listRef,
    activeIndex,
    onNavigate: unstable_onNavigate = () => {},
    enabled = true,
    selectedIndex = null,
    allowEscape = false,
    loop = false,
    nested = false,
    rtl = false,
    virtual = false,
    focusItemOnOpen = 'auto',
    focusItemOnHover = true,
    openOnArrowKeyDown = true,
    disabledIndices = undefined,
    orientation = 'vertical',
    cols = 1,
    scrollItemIntoView = true,
  }: Props = {
    listRef: {current: []},
    activeIndex: null,
    onNavigate: () => {},
  }
): ElementProps => {
  if (__DEV__) {
    if (allowEscape) {
      if (!loop) {
        console.warn(
          [
            'Floating UI: `useListNavigation` looping must be enabled to allow',
            'escaping.',
          ].join(' ')
        );
      }

      if (!virtual) {
        console.warn(
          [
            'Floating UI: `useListNavigation` must be virtual to allow',
            'escaping.',
          ].join(' ')
        );
      }
    }

    if (orientation === 'vertical' && cols > 1) {
      console.warn(
        [
          'Floating UI: In grid list navigation mode (`cols` > 1), the',
          '`orientation` should be either "horizontal" or "both".',
        ].join(' ')
      );
    }
  }

  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();

  const onNavigate = useEvent(unstable_onNavigate);

  const focusItemOnOpenRef = React.useRef(focusItemOnOpen);
  const indexRef = React.useRef(selectedIndex ?? -1);
  const keyRef = React.useRef<null | string>(null);
  const isPointerModalityRef = React.useRef(true);
  const previousOnNavigateRef = React.useRef(onNavigate);
  const previousOpenRef = React.useRef(open);
  const forceSyncFocus = React.useRef(false);

  const disabledIndicesRef = useLatestRef(disabledIndices);
  const latestOpenRef = useLatestRef(open);
  const scrollItemIntoViewRef = useLatestRef(scrollItemIntoView);

  const [activeId, setActiveId] = React.useState<string | undefined>();

  const focusItem = React.useCallback(
    (
      listRef: React.MutableRefObject<Array<HTMLElement | null>>,
      indexRef: React.MutableRefObject<number>,
      forceScrollIntoView = false
    ) => {
      const item = listRef.current[indexRef.current];

      if (virtual) {
        setActiveId(item?.id);
      } else {
        enqueueFocus(item, {
          preventScroll: true,
          // Mac Safari does not move the virtual cursor unless the focus call
          // is sync. However, for the very first focus call, we need to wait
          // for the position to be ready in order to prevent unwanted
          // scrolling. This means the virtual cursor will not move to the first
          // item when first opening the floating element, but will on
          // subsequent calls. `preventScroll` is supported in modern Safari,
          // so we can use that instead.
          // iOS Safari must be async or the first item will not be focused.
          sync:
            isMac() && isSafari()
              ? isPreventScrollSupported || forceSyncFocus.current
              : false,
        });
      }

      requestAnimationFrame(() => {
        const scrollIntoViewOptions = scrollItemIntoViewRef.current;
        const shouldScrollIntoView =
          scrollIntoViewOptions &&
          item &&
          (forceScrollIntoView ? true : !isPointerModalityRef.current);

        if (shouldScrollIntoView) {
          // JSDOM doesn't support `.scrollIntoView()` but it's widely supported
          // by all browsers.
          item.scrollIntoView?.(
            typeof scrollIntoViewOptions === 'boolean'
              ? {block: 'nearest', inline: 'nearest'}
              : scrollIntoViewOptions
          );
        }
      });
    },
    [virtual, scrollItemIntoViewRef]
  );

  useLayoutEffect(() => {
    document.createElement('div').focus({
      get preventScroll() {
        isPreventScrollSupported = true;
        return false;
      },
    });
  }, []);

  // Sync `selectedIndex` to be the `activeIndex` upon opening the floating
  // element. Also, reset `activeIndex` upon closing the floating element.
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (open) {
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        onNavigate(selectedIndex);
      }
    } else if (previousOpenRef.current) {
      // Since the user can specify `onNavigate` conditionally
      // (onNavigate: open ? setActiveIndex : setSelectedIndex),
      // we store and call the previous function.
      indexRef.current = -1;
      previousOnNavigateRef.current(null);
    }
  }, [enabled, open, selectedIndex, onNavigate]);

  // Sync `activeIndex` to be the focused item while the floating element is
  // open.
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (open) {
      if (activeIndex == null) {
        forceSyncFocus.current = false;

        if (selectedIndex != null) {
          return;
        }

        // Reset while the floating element was open (e.g. the list changed).
        if (previousOpenRef.current) {
          indexRef.current = -1;
          focusItem(listRef, indexRef);
        }

        // Initial sync.
        if (
          !previousOpenRef.current &&
          focusItemOnOpenRef.current &&
          (keyRef.current != null ||
            (focusItemOnOpenRef.current === true && keyRef.current == null))
        ) {
          indexRef.current =
            keyRef.current == null ||
            isMainOrientationToEndKey(keyRef.current, orientation, rtl) ||
            nested
              ? getMinIndex(listRef, disabledIndicesRef.current)
              : getMaxIndex(listRef, disabledIndicesRef.current);

          onNavigate(indexRef.current);
        }
      } else if (!isIndexOutOfBounds(listRef, activeIndex)) {
        indexRef.current = activeIndex;
        focusItem(listRef, indexRef, activeIndex === selectedIndex);
      }
    }
  }, [
    enabled,
    open,
    activeIndex,
    selectedIndex,
    nested,
    listRef,
    orientation,
    rtl,
    onNavigate,
    focusItem,
    disabledIndicesRef,
  ]);

  // Ensure the parent floating element has focus when a nested child closes
  // to allow arrow key navigation to work after the pointer leaves the child.
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (previousOpenRef.current && !open) {
      const parentFloating = tree?.nodesRef.current.find(
        (node) => node.id === parentId
      )?.context?.elements.floating;

      if (
        parentFloating &&
        !contains(parentFloating, activeElement(getDocument(parentFloating)))
      ) {
        parentFloating.focus({preventScroll: true});
      }
    }
  }, [enabled, open, tree, parentId]);

  useLayoutEffect(() => {
    keyRef.current = null;
    previousOnNavigateRef.current = onNavigate;
    previousOpenRef.current = open;
  });

  return React.useMemo(() => {
    if (!enabled) {
      return {};
    }

    const disabledIndices = disabledIndicesRef.current;

    function onKeyDown(event: React.KeyboardEvent) {
      isPointerModalityRef.current = false;
      forceSyncFocus.current = true;

      // If the floating element is animating out, ignore navigation. Otherwise,
      // the `activeIndex` gets set to 0 despite not being open so the next time
      // the user ArrowDowns, the first item won't be focused.
      if (!latestOpenRef.current && event.currentTarget === floating) {
        return;
      }

      if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
        stopEvent(event);
        onOpenChange(false);

        if (isHTMLElement(domReference)) {
          domReference.focus();
        }

        return;
      }

      const currentIndex = indexRef.current;
      const minIndex = getMinIndex(listRef, disabledIndices);
      const maxIndex = getMaxIndex(listRef, disabledIndices);

      if (event.key === 'Home') {
        indexRef.current = minIndex;
        onNavigate(indexRef.current);
      }

      if (event.key === 'End') {
        indexRef.current = maxIndex;
        onNavigate(indexRef.current);
      }

      // Grid navigation.
      if (cols > 1) {
        const prevIndex = indexRef.current;

        if (event.key === ARROW_UP) {
          stopEvent(event);

          if (prevIndex === -1) {
            indexRef.current = maxIndex;
          } else {
            indexRef.current = findNonDisabledIndex(listRef, {
              startingIndex: prevIndex,
              amount: cols,
              decrement: true,
              disabledIndices,
            });

            if (loop && (prevIndex - cols < minIndex || indexRef.current < 0)) {
              const col = prevIndex % cols;
              const maxCol = maxIndex % cols;
              const offset = maxIndex - (maxCol - col);

              if (maxCol === col) {
                indexRef.current = maxIndex;
              } else {
                indexRef.current = maxCol > col ? offset : offset - cols;
              }
            }
          }

          if (isIndexOutOfBounds(listRef, indexRef.current)) {
            indexRef.current = prevIndex;
          }

          onNavigate(indexRef.current);
        }

        if (event.key === ARROW_DOWN) {
          stopEvent(event);

          if (prevIndex === -1) {
            indexRef.current = minIndex;
          } else {
            indexRef.current = findNonDisabledIndex(listRef, {
              startingIndex: prevIndex,
              amount: cols,
              disabledIndices,
            });

            if (loop && prevIndex + cols > maxIndex) {
              indexRef.current = findNonDisabledIndex(listRef, {
                startingIndex: (prevIndex % cols) - cols,
                amount: cols,
                disabledIndices,
              });
            }
          }

          if (isIndexOutOfBounds(listRef, indexRef.current)) {
            indexRef.current = prevIndex;
          }

          onNavigate(indexRef.current);
        }

        // Remains on the same row/column.
        if (orientation === 'both') {
          const prevRow = Math.floor(prevIndex / cols);

          if (event.key === ARROW_RIGHT) {
            stopEvent(event);

            if (prevIndex % cols !== cols - 1) {
              indexRef.current = findNonDisabledIndex(listRef, {
                startingIndex: prevIndex,
                disabledIndices,
              });

              if (loop && isDifferentRow(indexRef.current, cols, prevRow)) {
                indexRef.current = findNonDisabledIndex(listRef, {
                  startingIndex: prevIndex - (prevIndex % cols) - 1,
                  disabledIndices,
                });
              }
            } else if (loop) {
              indexRef.current = findNonDisabledIndex(listRef, {
                startingIndex: prevIndex - (prevIndex % cols) - 1,
                disabledIndices,
              });
            }

            if (isDifferentRow(indexRef.current, cols, prevRow)) {
              indexRef.current = prevIndex;
            }
          }

          if (event.key === ARROW_LEFT) {
            stopEvent(event);

            if (prevIndex % cols !== 0) {
              indexRef.current = findNonDisabledIndex(listRef, {
                startingIndex: prevIndex,
                disabledIndices,
                decrement: true,
              });

              if (loop && isDifferentRow(indexRef.current, cols, prevRow)) {
                indexRef.current = findNonDisabledIndex(listRef, {
                  startingIndex: prevIndex + (cols - (prevIndex % cols)),
                  decrement: true,
                  disabledIndices,
                });
              }
            } else if (loop) {
              indexRef.current = findNonDisabledIndex(listRef, {
                startingIndex: prevIndex + (cols - (prevIndex % cols)),
                decrement: true,
                disabledIndices,
              });
            }

            if (isDifferentRow(indexRef.current, cols, prevRow)) {
              indexRef.current = prevIndex;
            }
          }

          const lastRow = Math.floor(maxIndex / cols) === prevRow;

          if (isIndexOutOfBounds(listRef, indexRef.current)) {
            if (loop && lastRow) {
              indexRef.current =
                event.key === ARROW_LEFT
                  ? maxIndex
                  : findNonDisabledIndex(listRef, {
                      startingIndex: prevIndex - (prevIndex % cols) - 1,
                      disabledIndices,
                    });
            } else {
              indexRef.current = prevIndex;
            }
          }

          onNavigate(indexRef.current);
          return;
        }
      }

      if (isMainOrientationKey(event.key, orientation)) {
        stopEvent(event);

        // Reset the index if no item is focused.
        if (
          open &&
          !virtual &&
          activeElement(event.currentTarget.ownerDocument) ===
            event.currentTarget
        ) {
          indexRef.current = isMainOrientationToEndKey(
            event.key,
            orientation,
            rtl
          )
            ? minIndex
            : maxIndex;
          onNavigate(indexRef.current);
          return;
        }

        if (isMainOrientationToEndKey(event.key, orientation, rtl)) {
          if (loop) {
            indexRef.current =
              currentIndex >= maxIndex
                ? allowEscape && currentIndex !== listRef.current.length
                  ? -1
                  : minIndex
                : findNonDisabledIndex(listRef, {
                    startingIndex: currentIndex,
                    disabledIndices,
                  });
          } else {
            indexRef.current = Math.min(
              maxIndex,
              findNonDisabledIndex(listRef, {
                startingIndex: currentIndex,
                disabledIndices,
              })
            );
          }
        } else {
          if (loop) {
            indexRef.current =
              currentIndex <= minIndex
                ? allowEscape && currentIndex !== -1
                  ? listRef.current.length
                  : maxIndex
                : findNonDisabledIndex(listRef, {
                    startingIndex: currentIndex,
                    decrement: true,
                    disabledIndices,
                  });
          } else {
            indexRef.current = Math.max(
              minIndex,
              findNonDisabledIndex(listRef, {
                startingIndex: currentIndex,
                decrement: true,
                disabledIndices,
              })
            );
          }
        }

        if (isIndexOutOfBounds(listRef, indexRef.current)) {
          onNavigate(null);
        } else {
          onNavigate(indexRef.current);
        }
      }
    }

    function checkVirtualMouse(event: React.PointerEvent) {
      if (focusItemOnOpen === 'auto' && isVirtualClick(event.nativeEvent)) {
        focusItemOnOpenRef.current = true;
      }
    }

    function checkVirtualPointer(event: React.PointerEvent) {
      // `pointerdown` fires first, reset the state then perform the checks.
      focusItemOnOpenRef.current = focusItemOnOpen;
      if (
        focusItemOnOpen === 'auto' &&
        isVirtualPointerEvent(event.nativeEvent)
      ) {
        focusItemOnOpenRef.current = true;
      }
    }

    function syncCurrentTarget(currentTarget: HTMLElement | null) {
      const index = listRef.current.indexOf(currentTarget);
      if (index !== -1 && activeIndex !== index) {
        onNavigate(index);
      }
    }

    return {
      reference: {
        ...(virtual &&
          open &&
          activeIndex != null && {
            'aria-activedescendant': activeId,
          }),
        onKeyDown(event) {
          isPointerModalityRef.current = false;
          const isArrowKey = event.key.indexOf('Arrow') === 0;

          if (virtual && open) {
            return onKeyDown(event);
          }

          // If a floating element should not open on arrow key down, avoid
          // setting `activeIndex` while it's closed.
          if (!open && !openOnArrowKeyDown && isArrowKey) {
            return;
          }

          const isNavigationKey =
            isArrowKey ||
            event.key === 'Enter' ||
            event.key === ' ' ||
            event.key === '';

          if (isNavigationKey) {
            keyRef.current = event.key;
          }

          if (nested) {
            if (isCrossOrientationOpenKey(event.key, orientation, rtl)) {
              stopEvent(event);

              if (open) {
                indexRef.current = getMinIndex(listRef, disabledIndices);
                onNavigate(indexRef.current);
              } else {
                onOpenChange(true);
              }
            }

            return;
          }

          if (isMainOrientationKey(event.key, orientation)) {
            if (selectedIndex != null) {
              indexRef.current = selectedIndex;
            }

            stopEvent(event);

            if (!open && openOnArrowKeyDown) {
              onOpenChange(true);
            } else {
              onKeyDown(event);
            }

            if (open) {
              onNavigate(indexRef.current);
            }
          }
        },
        onFocus() {
          if (open) {
            onNavigate(null);
          }
        },
        onPointerDown: checkVirtualPointer,
        onMouseDown: checkVirtualMouse,
        onClick: checkVirtualMouse,
      },
      floating: {
        'aria-orientation': orientation === 'both' ? undefined : orientation,
        ...(virtual &&
          activeIndex != null && {
            'aria-activedescendant': activeId,
          }),
        onKeyDown,
        onPointerMove() {
          isPointerModalityRef.current = true;
        },
      },
      item: {
        onFocus({currentTarget}) {
          syncCurrentTarget(currentTarget);
        },
        onClick: ({currentTarget}) =>
          currentTarget.focus({preventScroll: true}), // Safari
        ...(focusItemOnHover && {
          onMouseMove({currentTarget}) {
            syncCurrentTarget(currentTarget);
          },
          onPointerLeave() {
            if (!isPointerModalityRef.current) {
              return;
            }

            indexRef.current = -1;
            focusItem(listRef, indexRef);

            // Virtual cursor with VoiceOver on iOS needs this to be flushed
            // synchronously or there is a glitch that prevents nested
            // submenus from being accessible.
            flushSync(() => onNavigate(null));

            if (!virtual) {
              // This also needs to be sync to prevent fast mouse movements
              // from leaving behind a stale active item when landing on a
              // disabled button item.
              floating?.focus({preventScroll: true});
            }
          },
        }),
      },
    };
  }, [
    domReference,
    floating,
    activeId,
    disabledIndicesRef,
    latestOpenRef,
    listRef,
    enabled,
    orientation,
    rtl,
    virtual,
    open,
    activeIndex,
    nested,
    selectedIndex,
    openOnArrowKeyDown,
    focusItemOnHover,
    allowEscape,
    cols,
    loop,
    focusItemOnOpen,
    focusItem,
    onNavigate,
    onOpenChange,
  ]);
};
