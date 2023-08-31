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
import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
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
import {useEffectEvent} from './utils/useEffectEvent';
import {useLatestRef} from './utils/useLatestRef';

let isPreventScrollSupported = false;

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

export interface UseListNavigationProps {
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
    elements: {domReference, floating},
  } = context;
  const {
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
  } = props;

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

  const onNavigate = useEffectEvent(unstable_onNavigate);

  const focusItemOnOpenRef = React.useRef(focusItemOnOpen);
  const indexRef = React.useRef(selectedIndex ?? -1);
  const keyRef = React.useRef<null | string>(null);
  const isPointerModalityRef = React.useRef(true);
  const previousOnNavigateRef = React.useRef(onNavigate);
  const previousMountedRef = React.useRef(!!floating);
  const forceSyncFocus = React.useRef(false);
  const forceScrollIntoViewRef = React.useRef(false);

  const disabledIndicesRef = useLatestRef(disabledIndices);
  const latestOpenRef = useLatestRef(open);
  const scrollItemIntoViewRef = useLatestRef(scrollItemIntoView);

  const [activeId, setActiveId] = React.useState<string | undefined>();

  const focusItem = useEffectEvent(
    (
      listRef: React.MutableRefObject<Array<HTMLElement | null>>,
      indexRef: React.MutableRefObject<number>,
      forceScrollIntoView = false
    ) => {
      const item = listRef.current[indexRef.current];

      if (!item) return;

      if (virtual) {
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
              ? isPreventScrollSupported || forceSyncFocus.current
              : false,
        });
      }

      requestAnimationFrame(() => {
        const scrollIntoViewOptions = scrollItemIntoViewRef.current;
        const shouldScrollIntoView =
          scrollIntoViewOptions &&
          item &&
          (forceScrollIntoView || !isPointerModalityRef.current);

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
    }
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

    if (open && floating) {
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        // Regardless of the pointer modality, we want to ensure the selected
        // item comes into view when the floating element is opened.
        forceScrollIntoViewRef.current = true;
        onNavigate(selectedIndex);
      }
    } else if (previousMountedRef.current) {
      // Since the user can specify `onNavigate` conditionally
      // (onNavigate: open ? setActiveIndex : setSelectedIndex),
      // we store and call the previous function.
      indexRef.current = -1;
      previousOnNavigateRef.current(null);
    }
  }, [enabled, open, floating, selectedIndex, onNavigate]);

  // Sync `activeIndex` to be the focused item while the floating element is
  // open.
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (open && floating) {
      if (activeIndex == null) {
        forceSyncFocus.current = false;

        if (selectedIndex != null) {
          return;
        }

        // Reset while the floating element was open (e.g. the list changed).
        if (previousMountedRef.current) {
          indexRef.current = -1;
          focusItem(listRef, indexRef);
        }

        // Initial sync.
        if (
          !previousMountedRef.current &&
          focusItemOnOpenRef.current &&
          (keyRef.current != null ||
            (focusItemOnOpenRef.current === true && keyRef.current == null))
        ) {
          let runs = 0;
          const waitForListPopulated = () => {
            if (listRef.current[0] == null) {
              // Avoid letting the browser paint if possible on the first try,
              // otherwise use rAF. Don't try more than twice, since something
              // is wrong otherwise.
              if (runs < 2) {
                const scheduler = runs ? requestAnimationFrame : queueMicrotask;
                scheduler(waitForListPopulated);
              }
              runs++;
            } else {
              indexRef.current =
                keyRef.current == null ||
                isMainOrientationToEndKey(keyRef.current, orientation, rtl) ||
                nested
                  ? getMinIndex(listRef, disabledIndicesRef.current)
                  : getMaxIndex(listRef, disabledIndicesRef.current);
              keyRef.current = null;
              onNavigate(indexRef.current);
            }
          };

          waitForListPopulated();
        }
      } else if (!isIndexOutOfBounds(listRef, activeIndex)) {
        indexRef.current = activeIndex;
        focusItem(listRef, indexRef, forceScrollIntoViewRef.current);
        forceScrollIntoViewRef.current = false;
      }
    }
  }, [
    enabled,
    open,
    floating,
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

    if (previousMountedRef.current && !floating && tree) {
      const nodes = tree.nodesRef.current;
      const parent = nodes.find((node) => node.id === parentId)?.context
        ?.elements.floating;
      const activeEl = activeElement(getDocument(floating));
      const treeContainsActiveEl = nodes.some(
        (node) =>
          node.context && contains(node.context.elements.floating, activeEl)
      );

      if (parent && !treeContainsActiveEl && isPointerModalityRef.current) {
        parent.focus({preventScroll: true});
      }
    }
  }, [enabled, floating, tree, parentId]);

  useLayoutEffect(() => {
    previousOnNavigateRef.current = onNavigate;
    previousMountedRef.current = !!floating;
  });

  useLayoutEffect(() => {
    if (!open) {
      keyRef.current = null;
    }
  }, [open]);

  const hasActiveIndex = activeIndex != null;

  const item = React.useMemo(() => {
    function syncCurrentTarget(currentTarget: HTMLElement | null) {
      if (!open) return;
      const index = listRef.current.indexOf(currentTarget);
      if (index !== -1) {
        onNavigate(index);
      }
    }

    const props: ElementProps['item'] = {
      onFocus({currentTarget}) {
        syncCurrentTarget(currentTarget);
      },
      onClick: ({currentTarget}) => currentTarget.focus({preventScroll: true}), // Safari
      ...(focusItemOnHover && {
        onMouseMove({currentTarget}) {
          syncCurrentTarget(currentTarget);
        },
        onPointerLeave({pointerType}) {
          if (!isPointerModalityRef.current || pointerType === 'touch') {
            return;
          }

          indexRef.current = -1;
          focusItem(listRef, indexRef);
          onNavigate(null);

          if (!virtual) {
            enqueueFocus(refs.floating.current, {preventScroll: true});
          }
        },
      }),
    };

    return props;
  }, [open, refs, focusItem, focusItemOnHover, listRef, onNavigate, virtual]);

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
      if (
        !latestOpenRef.current &&
        event.currentTarget === refs.floating.current
      ) {
        return;
      }

      if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
        stopEvent(event);
        onOpenChange(false, event.nativeEvent);

        if (isHTMLElement(domReference)) {
          domReference.focus();
        }

        return;
      }

      const currentIndex = indexRef.current;
      const minIndex = getMinIndex(listRef, disabledIndices);
      const maxIndex = getMaxIndex(listRef, disabledIndices);

      if (event.key === 'Home') {
        stopEvent(event);
        indexRef.current = minIndex;
        onNavigate(indexRef.current);
      }

      if (event.key === 'End') {
        stopEvent(event);
        indexRef.current = maxIndex;
        onNavigate(indexRef.current);
      }

      // Grid navigation.
      if (cols > 1) {
        indexRef.current = getGridNavigatedIndex(listRef, {
          event,
          orientation,
          loop,
          cols,
          disabledIndices,
          minIndex,
          maxIndex,
          prevIndex: indexRef.current,
        });

        onNavigate(indexRef.current);

        if (orientation === 'both') {
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

    const ariaActiveDescendantProp = virtual &&
      open &&
      hasActiveIndex && {
        'aria-activedescendant': activeId,
      };

    return {
      reference: {
        ...ariaActiveDescendantProp,
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
            isArrowKey || event.key === 'Enter' || event.key.trim() === '';
          const isMainKey = isMainOrientationKey(event.key, orientation);
          const isCrossKey = isCrossOrientationOpenKey(
            event.key,
            orientation,
            rtl
          );

          if (isNavigationKey) {
            keyRef.current = nested && isMainKey ? null : event.key;
          }

          if (nested) {
            if (isCrossKey) {
              stopEvent(event);

              if (open) {
                indexRef.current = getMinIndex(listRef, disabledIndices);
                onNavigate(indexRef.current);
              } else {
                onOpenChange(true, event.nativeEvent);
              }
            }

            return;
          }

          if (isMainKey) {
            if (selectedIndex != null) {
              indexRef.current = selectedIndex;
            }

            stopEvent(event);

            if (!open && openOnArrowKeyDown) {
              onOpenChange(true, event.nativeEvent);
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
        ...ariaActiveDescendantProp,
        onKeyDown,
        onPointerMove() {
          isPointerModalityRef.current = true;
        },
      },
      item,
    };
  }, [
    domReference,
    refs,
    activeId,
    disabledIndicesRef,
    latestOpenRef,
    listRef,
    enabled,
    orientation,
    rtl,
    virtual,
    open,
    hasActiveIndex,
    nested,
    selectedIndex,
    openOnArrowKeyDown,
    allowEscape,
    cols,
    loop,
    focusItemOnOpen,
    onNavigate,
    onOpenChange,
    item,
  ]);
}
