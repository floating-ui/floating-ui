import {
  activeElement,
  contains,
  getDocument,
  isMac,
  isSafari,
  isTypeableCombobox,
  isVirtualClick,
  isVirtualPointerEvent,
  stopEvent,
} from '@floating-ui/react/utils';
import {isHTMLElement} from '@floating-ui/utils/dom';
import * as React from 'react';
import useModernLayoutEffect from 'use-isomorphic-layout-effect';

import {
  useFloatingParentNodeId,
  useFloatingTree,
} from '../components/FloatingTree';
import type {Dimensions, ElementProps, FloatingRootContext} from '../types';
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
import {getDeepestNode} from '../utils/getChildren';
import {useEffectEvent} from './utils/useEffectEvent';
import {useLatestRef} from './utils/useLatestRef';
import {warn} from '../utils/log';

let isPreventScrollSupported = false;

function doSwitch(
  orientation: UseListNavigationProps['orientation'],
  vertical: boolean,
  horizontal: boolean,
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
  orientation: UseListNavigationProps['orientation'],
) {
  const vertical = key === ARROW_UP || key === ARROW_DOWN;
  const horizontal = key === ARROW_LEFT || key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal);
}

function isMainOrientationToEndKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean,
) {
  const vertical = key === ARROW_DOWN;
  const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  return (
    doSwitch(orientation, vertical, horizontal) ||
    key === 'Enter' ||
    key === ' ' ||
    key === ''
  );
}

function isCrossOrientationOpenKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean,
) {
  const vertical = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  const horizontal = key === ARROW_DOWN;
  return doSwitch(orientation, vertical, horizontal);
}

function isCrossOrientationCloseKey(
  key: string,
  orientation: UseListNavigationProps['orientation'],
  rtl: boolean,
) {
  const vertical = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
  const horizontal = key === ARROW_UP;
  return doSwitch(orientation, vertical, horizontal);
}

export interface UseListNavigationProps {
  /**
   * A ref that holds an array of list items.
   * @default empty list
   */
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  /**
   * The index of the currently active (focused or highlighted) item, which may
   * or may not be selected.
   * @default null
   */
  activeIndex: number | null;
  /**
   * A callback that is called when the user navigates to a new active item,
   * passed in a new `activeIndex`.
   */
  onNavigate?: (activeIndex: number | null) => void;
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * The currently selected item index, which may or may not be active.
   * @default null
   */
  selectedIndex?: number | null;
  /**
   * Whether to focus the item upon opening the floating element. 'auto' infers
   * what to do based on the input type (keyboard vs. pointer), while a boolean
   * value will force the value.
   * @default 'auto'
   */
  focusItemOnOpen?: boolean | 'auto';
  /**
   * Whether hovering an item synchronizes the focus.
   * @default true
   */
  focusItemOnHover?: boolean;
  /**
   * Whether pressing an arrow key on the navigation’s main axis opens the
   * floating element.
   * @default true
   */
  openOnArrowKeyDown?: boolean;
  /**
   * By default elements with either a `disabled` or `aria-disabled` attribute
   * are skipped in the list navigation — however, this requires the items to
   * be rendered.
   * This prop allows you to manually specify indices which should be disabled,
   * overriding the default logic.
   * For Windows-style select menus, where the menu does not open when
   * navigating via arrow keys, specify an empty array.
   * @default undefined
   */
  disabledIndices?: Array<number>;
  /**
   * Determines whether focus can escape the list, such that nothing is selected
   * after navigating beyond the boundary of the list. In some
   * autocomplete/combobox components, this may be desired, as screen
   * readers will return to the input.
   * `loop` must be `true`.
   * @default false
   */
  allowEscape?: boolean;
  /**
   * Determines whether focus should loop around when navigating past the first
   * or last item.
   * @default false
   */
  loop?: boolean;
  /**
   * If the list is nested within another one (e.g. a nested submenu), the
   * navigation semantics change.
   * @default false
   */
  nested?: boolean;
  /**
   * Whether the direction of the floating element’s navigation is in RTL
   * layout.
   * @default false
   */
  rtl?: boolean;
  /**
   * Whether the focus is virtual (using `aria-activedescendant`).
   * Use this if you need focus to remain on the reference element
   * (such as an input), but allow arrow keys to navigate list items.
   * This is common in autocomplete listbox components.
   * Your virtually-focused list items must have a unique `id` set on them.
   * If you’re using a component role with the `useRole()` Hook, then an `id` is
   * generated automatically.
   * @default false
   */
  virtual?: boolean;
  /**
   * The orientation in which navigation occurs.
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /**
   * Specifies how many columns the list has (i.e., it’s a grid). Use an
   * orientation of 'horizontal' (e.g. for an emoji picker/date picker, where
   * pressing ArrowRight or ArrowLeft can change rows), or 'both' (where the
   * current row cannot be escaped with ArrowRight or ArrowLeft, only ArrowUp
   * and ArrowDown).
   * @default 1
   */
  cols?: number;
  /**
   * Whether to scroll the active item into view when navigating. The default
   * value uses nearest options.
   */
  scrollItemIntoView?: boolean | ScrollIntoViewOptions;
  /**
   * When using virtual focus management, this holds a ref to the
   * virtually-focused item. This allows nested virtual navigation to be
   * enabled, and lets you know when a nested element is virtually focused from
   * the root reference handling the events. Requires `FloatingTree` to be
   * setup.
   */
  virtualItemRef?: React.MutableRefObject<HTMLElement | null>;
  /**
   * Only for `cols > 1`, specify sizes for grid items.
   * `{ width: 2, height: 2 }` means an item is 2 columns wide and 2 rows tall.
   */
  itemSizes?: Dimensions[];
  /**
   * Only relevant for `cols > 1` and items with different sizes, specify if
   * the grid is dense (as defined in the CSS spec for `grid-auto-flow`).
   * @default false
   */
  dense?: boolean;
}

/**
 * Adds arrow key-based navigation of a list of items, either using real DOM
 * focus or virtual focus.
 * @see https://floating-ui.com/docs/useListNavigation
 */
export function useListNavigation(
  context: FloatingRootContext,
  props: UseListNavigationProps,
): ElementProps {
  const {open, onOpenChange, elements} = context;
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
    virtualItemRef,
    itemSizes,
    dense = false,
  } = props;

  if (__DEV__) {
    if (allowEscape) {
      if (!loop) {
        warn('`useListNavigation` looping must be enabled to allow escaping.');
      }

      if (!virtual) {
        warn('`useListNavigation` must be virtual to allow escaping.');
      }
    }

    if (orientation === 'vertical' && cols > 1) {
      warn(
        'In grid list navigation mode (`cols` > 1), the `orientation` should',
        'be either "horizontal" or "both".',
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
  const previousMountedRef = React.useRef(!!elements.floating);
  const forceSyncFocus = React.useRef(false);
  const forceScrollIntoViewRef = React.useRef(false);

  const disabledIndicesRef = useLatestRef(disabledIndices);
  const latestOpenRef = useLatestRef(open);
  const scrollItemIntoViewRef = useLatestRef(scrollItemIntoView);
  const floatingRef = useLatestRef(elements.floating);
  const selectedIndexRef = useLatestRef(selectedIndex);

  const [activeId, setActiveId] = React.useState<string | undefined>();
  const [virtualId, setVirtualId] = React.useState<string | undefined>();

  const focusItem = useEffectEvent(
    (
      listRef: React.MutableRefObject<Array<HTMLElement | null>>,
      indexRef: React.MutableRefObject<number>,
      forceScrollIntoView = false,
    ) => {
      function runFocus(item: HTMLElement) {
        if (virtual) {
          setActiveId(item.id);
          tree?.events.emit('virtualfocus', item);
          if (virtualItemRef) {
            virtualItemRef.current = item;
          }
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
      }

      const initialItem = listRef.current[indexRef.current];

      if (initialItem) {
        runFocus(initialItem);
      }

      requestAnimationFrame(() => {
        const waitedItem = listRef.current[indexRef.current] || initialItem;

        if (!waitedItem) return;

        if (!initialItem) {
          runFocus(waitedItem);
        }

        const scrollIntoViewOptions = scrollItemIntoViewRef.current;
        const shouldScrollIntoView =
          scrollIntoViewOptions &&
          item &&
          (forceScrollIntoView || !isPointerModalityRef.current);

        if (shouldScrollIntoView) {
          // JSDOM doesn't support `.scrollIntoView()` but it's widely supported
          // by all browsers.
          waitedItem.scrollIntoView?.(
            typeof scrollIntoViewOptions === 'boolean'
              ? {block: 'nearest', inline: 'nearest'}
              : scrollIntoViewOptions,
          );
        }
      });
    },
  );

  useModernLayoutEffect(() => {
    document.createElement('div').focus({
      get preventScroll() {
        isPreventScrollSupported = true;
        return false;
      },
    });
  }, []);

  // Sync `selectedIndex` to be the `activeIndex` upon opening the floating
  // element. Also, reset `activeIndex` upon closing the floating element.
  useModernLayoutEffect(() => {
    if (!enabled) return;

    if (open && elements.floating) {
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        // Regardless of the pointer modality, we want to ensure the selected
        // item comes into view when the floating element is opened.
        forceScrollIntoViewRef.current = true;
        indexRef.current = selectedIndex;
        onNavigate(selectedIndex);
      }
    } else if (previousMountedRef.current) {
      // Since the user can specify `onNavigate` conditionally
      // (onNavigate: open ? setActiveIndex : setSelectedIndex),
      // we store and call the previous function.
      indexRef.current = -1;
      previousOnNavigateRef.current(null);
    }
  }, [enabled, open, elements.floating, selectedIndex, onNavigate]);

  // Sync `activeIndex` to be the focused item while the floating element is
  // open.
  useModernLayoutEffect(() => {
    if (!enabled) return;

    if (open && elements.floating) {
      if (activeIndex == null) {
        forceSyncFocus.current = false;

        if (selectedIndexRef.current != null) {
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
    elements.floating,
    activeIndex,
    selectedIndexRef,
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
  useModernLayoutEffect(() => {
    if (
      !enabled ||
      elements.floating ||
      !tree ||
      virtual ||
      !previousMountedRef.current
    ) {
      return;
    }

    const nodes = tree.nodesRef.current;
    const parent = nodes.find((node) => node.id === parentId)?.context?.elements
      .floating;
    const activeEl = activeElement(getDocument(elements.floating));
    const treeContainsActiveEl = nodes.some(
      (node) =>
        node.context && contains(node.context.elements.floating, activeEl),
    );

    if (parent && !treeContainsActiveEl && isPointerModalityRef.current) {
      parent.focus({preventScroll: true});
    }
  }, [enabled, elements.floating, tree, parentId, virtual]);

  useModernLayoutEffect(() => {
    if (!enabled) return;
    if (!tree) return;
    if (!virtual) return;
    if (parentId) return;

    function handleVirtualFocus(item: HTMLElement) {
      setVirtualId(item.id);

      if (virtualItemRef) {
        virtualItemRef.current = item;
      }
    }

    tree.events.on('virtualfocus', handleVirtualFocus);
    return () => {
      tree.events.off('virtualfocus', handleVirtualFocus);
    };
  }, [enabled, tree, virtual, parentId, virtualItemRef]);

  useModernLayoutEffect(() => {
    previousOnNavigateRef.current = onNavigate;
    previousMountedRef.current = !!elements.floating;
  });

  useModernLayoutEffect(() => {
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
            enqueueFocus(floatingRef.current, {preventScroll: true});
          }
        },
      }),
    };

    return props;
  }, [
    open,
    floatingRef,
    focusItem,
    focusItemOnHover,
    listRef,
    onNavigate,
    virtual,
  ]);

  const commonOnKeyDown = useEffectEvent((event: React.KeyboardEvent) => {
    isPointerModalityRef.current = false;
    forceSyncFocus.current = true;

    // If the floating element is animating out, ignore navigation. Otherwise,
    // the `activeIndex` gets set to 0 despite not being open so the next time
    // the user ArrowDowns, the first item won't be focused.
    if (!latestOpenRef.current && event.currentTarget === floatingRef.current) {
      return;
    }

    if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
      stopEvent(event);
      onOpenChange(false, event.nativeEvent, 'list-navigation');

      if (isHTMLElement(elements.domReference) && !virtual) {
        elements.domReference.focus();
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
      const sizes =
        itemSizes ||
        Array.from({length: listRef.current.length}, () => ({
          width: 1,
          height: 1,
        }));
      // To calculate movements on the grid, we use hypothetical cell indices
      // as if every item was 1x1, then convert back to real indices.
      const cellMap = buildCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex(
        (index) =>
          index != null && !isDisabled(listRef.current, index, disabledIndices),
      );
      // last enabled index
      const maxGridIndex = cellMap.reduce(
        (foundIndex: number, index, cellIndex) =>
          index != null && !isDisabled(listRef.current, index, disabledIndices)
            ? cellIndex
            : foundIndex,
        -1,
      );
      indexRef.current = cellMap[
        getGridNavigatedIndex(
          {
            current: cellMap.map((itemIndex) =>
              itemIndex != null ? listRef.current[itemIndex] : null,
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
                  listRef.current.map((_, index) =>
                    isDisabled(listRef.current, index) ? index : undefined,
                  )),
                undefined,
              ],
              cellMap,
            ),
            minIndex: minGridIndex,
            maxIndex: maxGridIndex,
            prevIndex: getCellIndexOfCorner(
              indexRef.current > maxIndex ? minIndex : indexRef.current,
              sizes,
              cellMap,
              cols,
              // use a corner matching the edge closest to the direction
              // we're moving in so we don't end up in the same item. Prefer
              // top/left over bottom/right.
              event.key === ARROW_DOWN
                ? 'bl'
                : event.key === ARROW_RIGHT
                  ? 'tr'
                  : 'tl',
            ),
            stopEvent: true,
          },
        )
      ] as number; // navigated cell will never be nullish

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
        activeElement(event.currentTarget.ownerDocument) === event.currentTarget
      ) {
        indexRef.current = isMainOrientationToEndKey(
          event.key,
          orientation,
          rtl,
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
            }),
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
            }),
          );
        }
      }

      if (isIndexOutOfBounds(listRef, indexRef.current)) {
        onNavigate(null);
      } else {
        onNavigate(indexRef.current);
      }
    }
  });

  const ariaActiveDescendantProp = React.useMemo(() => {
    return (
      virtual &&
      open &&
      hasActiveIndex && {
        'aria-activedescendant': virtualId || activeId,
      }
    );
  }, [virtual, open, hasActiveIndex, virtualId, activeId]);

  const floating: ElementProps['floating'] = React.useMemo(() => {
    return {
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ...(!isTypeableCombobox(elements.domReference) &&
        ariaActiveDescendantProp),
      onKeyDown: commonOnKeyDown,
      onPointerMove() {
        isPointerModalityRef.current = true;
      },
    };
  }, [
    ariaActiveDescendantProp,
    commonOnKeyDown,
    elements.domReference,
    orientation,
  ]);

  const reference: ElementProps['reference'] = React.useMemo(() => {
    const disabledIndices = disabledIndicesRef.current;
    const activeItem = listRef.current.find((item) => item?.id === activeId);

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

    return {
      ...ariaActiveDescendantProp,
      onKeyDown(event) {
        isPointerModalityRef.current = false;

        const isArrowKey = event.key.indexOf('Arrow') === 0;
        const isCrossOpenKey = isCrossOrientationOpenKey(
          event.key,
          orientation,
          rtl,
        );
        const isCrossCloseKey = isCrossOrientationCloseKey(
          event.key,
          orientation,
          rtl,
        );
        const isMainKey = isMainOrientationKey(event.key, orientation);
        const isNavigationKey =
          (nested ? isCrossOpenKey : isMainKey) ||
          event.key === 'Enter' ||
          event.key.trim() === '';

        if (virtual && open) {
          const rootNode = tree?.nodesRef.current.find(
            (node) => node.parentId == null,
          );

          const deepestNode =
            tree && rootNode
              ? getDeepestNode(tree.nodesRef.current, rootNode.id)
              : null;

          if (isArrowKey && deepestNode && virtualItemRef) {
            const eventObject = new KeyboardEvent('keydown', {
              key: event.key,
              bubbles: true,
            });

            if (isCrossOpenKey || isCrossCloseKey) {
              const isCurrentTarget =
                deepestNode.context?.elements.domReference ===
                event.currentTarget;
              const dispatchItem =
                isCrossCloseKey && !isCurrentTarget
                  ? deepestNode.context?.elements.domReference
                  : isCrossOpenKey
                    ? activeItem
                    : null;

              if (dispatchItem) {
                stopEvent(event);
                dispatchItem.dispatchEvent(eventObject);
                setVirtualId(undefined);
              }
            }

            if (isMainKey && deepestNode.context) {
              if (
                deepestNode.context.open &&
                deepestNode.parentId &&
                event.currentTarget !==
                  deepestNode.context.elements.domReference
              ) {
                stopEvent(event);
                deepestNode.context.elements.domReference?.dispatchEvent(
                  eventObject,
                );
                return;
              }
            }
          }

          return commonOnKeyDown(event);
        }

        // If a floating element should not open on arrow key down, avoid
        // setting `activeIndex` while it's closed.
        if (!open && !openOnArrowKeyDown && isArrowKey) {
          return;
        }

        if (isNavigationKey) {
          keyRef.current = nested && isMainKey ? null : event.key;
        }

        if (nested) {
          if (isCrossOpenKey) {
            stopEvent(event);

            if (open) {
              indexRef.current = getMinIndex(listRef, disabledIndices);
              onNavigate(indexRef.current);
            } else {
              onOpenChange(true, event.nativeEvent, 'list-navigation');
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
            onOpenChange(true, event.nativeEvent, 'list-navigation');
          } else {
            commonOnKeyDown(event);
          }

          if (open) {
            onNavigate(indexRef.current);
          }
        }
      },
      onFocus() {
        if (open && !virtual) {
          onNavigate(null);
        }
      },
      onPointerDown: checkVirtualPointer,
      onMouseDown: checkVirtualMouse,
      onClick: checkVirtualMouse,
    };
  }, [
    activeId,
    ariaActiveDescendantProp,
    commonOnKeyDown,
    disabledIndicesRef,
    focusItemOnOpen,
    listRef,
    nested,
    onNavigate,
    onOpenChange,
    open,
    openOnArrowKeyDown,
    orientation,
    rtl,
    selectedIndex,
    tree,
    virtual,
    virtualItemRef,
  ]);

  return React.useMemo(
    () => (enabled ? {reference, floating, item} : {}),
    [enabled, reference, floating, item],
  );
}
