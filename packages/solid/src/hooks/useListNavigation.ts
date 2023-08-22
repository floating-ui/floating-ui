import {isHTMLElement} from '@floating-ui/utils/dom';
import {
  activeElement,
  contains,
  getDocument,
  isMac,
  isSafari,
  isVirtualClick,
  isVirtualPointerEvent,
  stopEvent,
} from '@floating-ui/utils/react';
import {destructure} from '@solid-primitives/destructure';
import {
  Accessor,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onMount,
} from 'solid-js';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {enqueueFocus} from '../utils/enqueueFocus';
// import {useEffectEvent} from './utils/useEffectEvent';
// import {useLatestRef} from './utils/useLatestRef';

let isPreventScrollSupported = false;

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

function isDifferentRow(index: number, cols: number, prevRow: number) {
  return Math.floor(index / cols) !== prevRow;
}

function isIndexOutOfBounds(listRef: Array<HTMLElement | null>, index: number) {
  return index < 0 || index >= listRef.length;
}

function findNonDisabledIndex(
  listRef: Array<HTMLElement | null>,
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
  const list = listRef;

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
  orientation: UseListNavigationProps['orientation'],
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

function isMainOrientationKey(
  key: string,
  orientation: UseListNavigationProps['orientation']
) {
  const vertical = key === ARROW_UP || key === ARROW_DOWN;
  const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal);
}

function isMainOrientationToEndKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
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
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean
) {
  const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  const horizontal = key === ARROW_DOWN;
  return doSwitch(orientation, vertical, horizontal);
}

function isCrossOrientationCloseKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean
) {
  const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
  const horizontal = key === ARROW_UP;
  return doSwitch(orientation, vertical, horizontal);
}

function getMinIndex(
  listRef: UseListNavigationProps['listRef'],
  disabledIndices: Array<number> | undefined
) {
  return findNonDisabledIndex(listRef, {disabledIndices});
}

function getMaxIndex(
  listRef: UseListNavigationProps['listRef'],
  disabledIndices: Array<number> | undefined
) {
  return findNonDisabledIndex(listRef, {
    decrement: true,
    startingIndex: listRef.length,
    disabledIndices,
  });
}

export interface UseListNavigationProps {
  listRef: Array<HTMLElement | null>;
  activeIndex: Accessor<number | null>;
  onNavigate?: (index: number | null) => void;
  enabled?: boolean;
  selectedIndex?: Accessor<number | null>;
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
 * Adds arrow key-based navigation of a list of items, either using real DOM
 * focus or virtual focus.
 * @see https://floating-ui.com/docs/useListNavigation
 */
export function useListNavigation<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseListNavigationProps
): ElementProps {
  const {
    open,
    onOpenChange,
    refs,
    // elements: {domReference, floating},
  } = context;
  const mergedProps = mergeProps(
    {
      onNavigate: (index: number | null) => {},
      enabled: true,
      selectedIndex: () => null,
      allowEscape: false,
      loop: false,
      nested: false,
      rtl: false,
      virtual: false,
      focusItemOnOpen: 'auto',
      focusItemOnHover: true,
      openOnArrowKeyDown: true,
      disabledIndices: undefined,
      orientation: 'vertical',
      cols: 1,
      scrollItemIntoView: true,
    } as UseListNavigationProps &
      Required<Omit<UseListNavigationProps, 'disabledIndices'>>,
    props
  );
  const {
    listRef,
    onNavigate: unstable_onNavigate,
    enabled,

    allowEscape,
    loop,
    nested,
    rtl,
    virtual,
    focusItemOnOpen,
    focusItemOnHover,
    openOnArrowKeyDown,
    disabledIndices,
    cols,
    scrollItemIntoView,
  } = destructure(mergedProps);
  const {selectedIndex, activeIndex} = mergedProps;

  if (!import.meta.env.PROD) {
    if (allowEscape()) {
      if (!loop()) {
        console.warn(
          [
            'Floating UI: `useListNavigation` looping must be enabled to allow',
            'escaping.',
          ].join(' ')
        );
      }

      if (!virtual()) {
        console.warn(
          [
            'Floating UI: `useListNavigation` must be virtual to allow',
            'escaping.',
          ].join(' ')
        );
      }
    }

    if (props.orientation === 'vertical' && cols() > 1) {
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

  const onNavigate = unstable_onNavigate();

  let focusItemOnOpenRef = focusItemOnOpen();
  let indexRef = selectedIndex() ?? activeIndex() ?? -1;
  let keyRef: null | string = null;
  let isPointerModalityRef = true;
  // let previousOnNavigateRef = onNavigate;
  let previousMountedRef = !!refs.floating();
  let forceSyncFocus = false;
  let forceScrollIntoViewRef = false;

  // const scrollItemIntoViewRef = scrollItemIntoView;

  const [activeId, setActiveId] = createSignal<string | undefined>();

  const focusItem = (
    listRef: Array<HTMLElement | null>,
    indexRef: number,
    forceScrollIntoView = false
  ) => {
    const item = listRef[indexRef];

    if (!item) return;

    if (virtual()) {
      setActiveId(item.id);
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
            ? isPreventScrollSupported || forceSyncFocus
            : false,
      });
    }

    requestAnimationFrame(() => {
      const scrollIntoViewOptions = scrollItemIntoView();
      const shouldScrollIntoView =
        scrollIntoViewOptions &&
        item &&
        (forceScrollIntoView || !isPointerModalityRef);

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
  };

  onMount(() => {
    document.createElement('div').focus({
      get preventScroll() {
        isPreventScrollSupported = true;
        return false;
      },
    });
  });

  // Sync `selectedIndex` to be the `activeIndex` upon opening the floating
  // element. Also, reset `activeIndex` upon closing the floating element.
  createEffect(() => {
    if (!enabled()) {
      return;
    }

    if (open() && refs.floating()) {
      const currentSelectedIndex = selectedIndex();

      if (focusItemOnOpen() && currentSelectedIndex != null) {
        // Regardless of the pointer modality, we want to ensure the selected
        // item comes into view when the floating element is opened.
        forceScrollIntoViewRef = true;

        onNavigate(currentSelectedIndex);
      }
    } else if (previousMountedRef) {
      // Since the user can specify `onNavigate` conditionally
      // (onNavigate: open ? setActiveIndex : setSelectedIndex),
      // we store and call the previous function.
      indexRef = -1;

      onNavigate(null);
    }
  });

  // Sync `activeIndex` to be the focused item while the floating element is
  // open.
  createEffect(() => {
    if (!enabled()) {
      //Added virtual as condition because it caused an infinite loop
      return;
    }

    if (open() && refs.floating()) {
      const currentActiveIndex = activeIndex();
      if (currentActiveIndex == null) {
        forceSyncFocus = false;

        if (selectedIndex() != null) {
          return;
        }

        // Reset while the floating element was open (e.g. the list changed).
        if (previousMountedRef) {
          indexRef = -1;
          !virtual() && focusItem(listRef(), indexRef);
        }

        // Initial sync.
        if (
          !previousMountedRef &&
          focusItemOnOpen() &&
          (keyRef != null || (focusItemOnOpen() === true && keyRef == null))
        ) {
          let runs = 0;
          const waitForListPopulated = () => {
            if (listRef()[0] == null) {
              // Avoid letting the browser paint if possible on the first try,
              // otherwise use rAF. Don't try more than twice, since something
              // is wrong otherwise.
              if (runs < 2) {
                const scheduler = runs ? requestAnimationFrame : queueMicrotask;
                scheduler(waitForListPopulated);
              }
              runs++;
            } else {
              indexRef =
                keyRef == null ||
                isMainOrientationToEndKey(keyRef, props.orientation, rtl()) ||
                nested()
                  ? getMinIndex(listRef(), disabledIndices?.())
                  : getMaxIndex(listRef(), disabledIndices?.());
              keyRef = null;
              onNavigate(indexRef);
            }
          };

          waitForListPopulated();
        }
      } else if (!isIndexOutOfBounds(listRef(), currentActiveIndex)) {
        indexRef = currentActiveIndex;
        !virtual() && focusItem(listRef(), indexRef, forceScrollIntoViewRef);
        forceScrollIntoViewRef = false;
      }
    }
  });

  // Ensure the parent floating element has focus when a nested child closes
  // to allow arrow key navigation to work after the pointer leaves the child.
  createEffect(() => {
    if (!enabled()) return;

    if (previousMountedRef && !refs.floating() && tree()) {
      const nodes = tree().nodesRef;
      const parent = nodes
        .find((node) => node.id === parentId)
        ?.context?.refs.floating();
      const activeEl = activeElement(getDocument(refs.floating()));
      const treeContainsActiveEl = nodes.some(
        (node) =>
          node.context && contains(node.context.refs.floating(), activeEl)
      );

      if (parent && !treeContainsActiveEl) {
        parent.focus({preventScroll: true});
      }
    }
  });

  createEffect(() => {
    previousMountedRef = !!refs.floating();
  });

  createEffect(() => {
    if (!open()) {
      keyRef = null;
    }
  });

  const item = createMemo(() => {
    function syncCurrentTarget(currentTarget: HTMLElement | null) {
      if (!open()) return;
      const index = listRef().indexOf(currentTarget);

      if (index !== -1) {
        onNavigate(index);
      }
    }

    const props: ElementProps['item'] = {
      onFocus({currentTarget}) {
        syncCurrentTarget(currentTarget);
      },
      onClick: ({currentTarget}) => {
        currentTarget.focus({preventScroll: true}); // Safari
        syncCurrentTarget(currentTarget);
      },
      ...(focusItemOnHover() && {
        onMouseMove({currentTarget}) {
          syncCurrentTarget(currentTarget);
        },
        onPointerLeave({pointerType}) {
          if (!isPointerModalityRef || pointerType === 'touch') {
            return;
          }

          indexRef = -1;
          focusItem(listRef(), indexRef);
          onNavigate(null);

          if (!virtual()) {
            enqueueFocus(refs.floating(), {preventScroll: true});
          }
        },
      }),
    };

    return props;
  });

  if (!enabled()) {
    return {};
  }

  // const disabledIndices = disabledIndicesRef;

  function onKeyDown(event: KeyboardEvent) {
    isPointerModalityRef = false;
    forceSyncFocus = true;
    // If the floating element is animating out, ignore navigation. Otherwise,
    // the `activeIndex` gets set to 0 despite not being open so the next time
    // the user ArrowDowns, the first item won't be focused.
    if (!open() && event.currentTarget === refs.floating()) {
      return;
    }

    if (
      nested() &&
      isCrossOrientationCloseKey(event.key, props.orientation, rtl())
    ) {
      stopEvent(event);
      onOpenChange(false, event);
      const domReference = refs.reference();
      if (isHTMLElement(domReference)) {
        domReference.focus();
      }

      return;
    }

    const currentIndex = indexRef;
    const minIndex = getMinIndex(listRef(), disabledIndices?.());
    const maxIndex = getMaxIndex(listRef(), disabledIndices?.());

    if (event.key === 'Home') {
      stopEvent(event);
      indexRef = minIndex;
      onNavigate(indexRef);
    }

    if (event.key === 'End') {
      stopEvent(event);
      indexRef = maxIndex;
      onNavigate(indexRef);
    }

    // Grid navigation.
    if (cols() > 1) {
      const prevIndex = indexRef;

      if (event.key === ARROW_UP) {
        stopEvent(event);

        if (prevIndex === -1) {
          indexRef = maxIndex;
        } else {
          indexRef = findNonDisabledIndex(listRef(), {
            startingIndex: prevIndex,
            amount: cols(),
            decrement: true,
            disabledIndices: disabledIndices?.(),
          });

          if (loop() && (prevIndex - cols() < minIndex || indexRef < 0)) {
            const col = prevIndex % cols();
            const maxCol = maxIndex % cols();
            const offset = maxIndex - (maxCol - col);

            if (maxCol === col) {
              indexRef = maxIndex;
            } else {
              indexRef = maxCol > col ? offset : offset - cols();
            }
          }
        }

        if (isIndexOutOfBounds(listRef(), indexRef)) {
          indexRef = prevIndex;
        }

        onNavigate(indexRef);
      }

      if (event.key === ARROW_DOWN) {
        stopEvent(event);

        if (prevIndex === -1) {
          indexRef = minIndex;
        } else {
          indexRef = findNonDisabledIndex(listRef(), {
            startingIndex: prevIndex,
            amount: cols(),
            disabledIndices: disabledIndices?.(),
          });

          if (loop() && prevIndex + cols() > maxIndex) {
            indexRef = findNonDisabledIndex(listRef(), {
              startingIndex: (prevIndex % cols()) - cols(),
              amount: cols(),
              disabledIndices: disabledIndices?.(),
            });
          }
        }

        if (isIndexOutOfBounds(listRef(), indexRef)) {
          indexRef = prevIndex;
        }

        onNavigate(indexRef);
      }

      // Remains on the same row/column.
      if (props.orientation === 'both') {
        const prevRow = Math.floor(prevIndex / cols());

        if (event.key === ARROW_RIGHT) {
          stopEvent(event);

          if (prevIndex % cols() !== cols() - 1) {
            indexRef = findNonDisabledIndex(listRef(), {
              startingIndex: prevIndex,
              disabledIndices: disabledIndices?.(),
            });

            if (loop() && isDifferentRow(indexRef, cols(), prevRow)) {
              indexRef = findNonDisabledIndex(listRef(), {
                startingIndex: prevIndex - (prevIndex % cols()) - 1,
                disabledIndices: disabledIndices?.(),
              });
            }
          } else if (loop()) {
            indexRef = findNonDisabledIndex(listRef(), {
              startingIndex: prevIndex - (prevIndex % cols()) - 1,
              disabledIndices: disabledIndices?.(),
            });
          }

          if (isDifferentRow(indexRef, cols(), prevRow)) {
            indexRef = prevIndex;
          }
        }

        if (event.key === ARROW_LEFT) {
          stopEvent(event);

          if (prevIndex % cols() !== 0) {
            indexRef = findNonDisabledIndex(listRef(), {
              startingIndex: prevIndex,
              disabledIndices: disabledIndices?.(),
              decrement: true,
            });

            if (loop() && isDifferentRow(indexRef, cols(), prevRow)) {
              indexRef = findNonDisabledIndex(listRef(), {
                startingIndex: prevIndex + (cols() - (prevIndex % cols())),
                decrement: true,
                disabledIndices: disabledIndices?.(),
              });
            }
          } else if (loop()) {
            indexRef = findNonDisabledIndex(listRef(), {
              startingIndex: prevIndex + (cols() - (prevIndex % cols())),
              decrement: true,
              disabledIndices: disabledIndices?.(),
            });
          }

          if (isDifferentRow(indexRef, cols(), prevRow)) {
            indexRef = prevIndex;
          }
        }

        const lastRow = Math.floor(maxIndex / cols()) === prevRow;

        if (isIndexOutOfBounds(listRef(), indexRef)) {
          if (loop() && lastRow) {
            indexRef =
              event.key === ARROW_LEFT
                ? maxIndex
                : findNonDisabledIndex(listRef(), {
                    startingIndex: prevIndex - (prevIndex % cols()) - 1,
                    disabledIndices: disabledIndices?.(),
                  });
          } else {
            indexRef = prevIndex;
          }
        }

        onNavigate(indexRef);
        return;
      }
    }

    if (isMainOrientationKey(event.key, props.orientation)) {
      stopEvent(event);

      // Reset the index if no item is focused.
      const currentEventTargetElement = event.currentTarget as Element;
      if (
        open() &&
        !virtual() &&
        activeElement(currentEventTargetElement?.ownerDocument) ===
          event.currentTarget
      ) {
        indexRef = isMainOrientationToEndKey(
          event.key,
          props.orientation,
          rtl()
        )
          ? minIndex
          : maxIndex;

        onNavigate(indexRef);
        return;
      }

      if (isMainOrientationToEndKey(event.key, props.orientation, rtl())) {
        if (loop()) {
          indexRef =
            currentIndex >= maxIndex
              ? allowEscape() && currentIndex !== listRef().length
                ? -1
                : minIndex
              : findNonDisabledIndex(listRef(), {
                  startingIndex: currentIndex,
                  disabledIndices: disabledIndices?.(),
                });
        } else {
          indexRef = Math.min(
            maxIndex,
            findNonDisabledIndex(listRef(), {
              startingIndex: currentIndex,
              disabledIndices: disabledIndices?.(),
            })
          );
        }
      } else {
        if (loop()) {
          indexRef =
            currentIndex <= minIndex
              ? allowEscape() && currentIndex !== -1
                ? listRef().length
                : maxIndex
              : findNonDisabledIndex(listRef(), {
                  startingIndex: currentIndex,
                  decrement: true,
                  disabledIndices: disabledIndices?.(),
                });
        } else {
          indexRef = Math.max(
            minIndex,
            findNonDisabledIndex(listRef(), {
              startingIndex: currentIndex,
              decrement: true,
              disabledIndices: disabledIndices?.(),
            })
          );
        }
      }

      if (isIndexOutOfBounds(listRef(), indexRef)) {
        onNavigate(null);
      } else {
        onNavigate(indexRef);
      }
    }
  }

  function checkVirtualMouse(event: PointerEvent | MouseEvent) {
    if (focusItemOnOpen() === 'auto' && isVirtualClick(event)) {
      focusItemOnOpenRef = true;
    }
  }

  function checkVirtualPointer(event: PointerEvent) {
    // `pointerdown` fires first, reset the state then perform the checks.
    focusItemOnOpenRef = focusItemOnOpen();
    if (focusItemOnOpen() === 'auto' && isVirtualPointerEvent(event)) {
      focusItemOnOpenRef = true;
    }
  }

  const ariaActiveDescendantProp = createMemo(
    () =>
      virtual() &&
      open() &&
      activeIndex() !== null && {
        'aria-activedescendant': activeId(),
      }
  );

  return {
    reference: {
      ...ariaActiveDescendantProp(),
      onKeyDown(event) {
        isPointerModalityRef = false;
        const isArrowKey = event.key.indexOf('Arrow') === 0;

        if (virtual() && open()) {
          return onKeyDown(event);
        }

        // If a floating element should not open on arrow key down, avoid
        // setting `activeIndex` while it's closed.
        if (!open() && !openOnArrowKeyDown() && isArrowKey) {
          return;
        }

        const isNavigationKey =
          isArrowKey || event.key === 'Enter' || event.key.trim() === '';
        const isMainKey = isMainOrientationKey(event.key, props.orientation);
        const isCrossKey = isCrossOrientationOpenKey(
          event.key,
          props.orientation,
          rtl()
        );

        if (isNavigationKey) {
          keyRef = nested() && isMainKey ? null : event.key;
        }

        if (nested()) {
          if (isCrossKey) {
            stopEvent(event);

            if (open()) {
              indexRef = getMinIndex(listRef(), disabledIndices?.());
              onNavigate(indexRef);
            } else {
              onOpenChange(true, event);
            }
          }

          return;
        }

        if (isMainKey) {
          const currentSelectedIndex = selectedIndex();
          if (currentSelectedIndex != null) {
            indexRef = currentSelectedIndex;
          }

          stopEvent(event);

          if (!open() && openOnArrowKeyDown()) {
            onOpenChange(true, event);
          } else {
            onKeyDown(event);
          }

          if (open()) {
            onNavigate(indexRef);
          }
        }
      },
      onFocus() {
        if (open()) {
          onNavigate(null);
        }
      },
      onPointerDown: checkVirtualPointer,
      onMouseDown: checkVirtualMouse,
      onClick: checkVirtualMouse,
    },
    floating: {
      'aria-orientation':
        props.orientation === 'both' ? undefined : props.orientation,
      ...ariaActiveDescendantProp(),
      onKeyDown,
      onPointerMove() {
        isPointerModalityRef = true;
      },
    },
    item: item(),
  };
}
