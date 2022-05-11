import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import {useFloatingParentNodeId, useFloatingTree} from '../FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {getDocument} from '../utils/getDocument';
import {activeElement} from '../utils/activeElement';
import {isHTMLElement} from '../utils/is';
import {stopEvent} from '../utils/stopEvent';
import {useLatestRef} from '../utils/useLatestRef';
import {usePrevious} from '../utils/usePrevious';

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

function findNonDisabledIndex(
  listRef: React.MutableRefObject<Array<HTMLElement | null>>,
  {startingIndex = -1, decrement = false} = {}
): number {
  const list = listRef.current;

  let index = startingIndex;
  do {
    index = index + (decrement ? -1 : 1);
  } while (
    index >= 0 &&
    index <= list.length - 1 &&
    (list[index] == null ||
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

function getMinIndex(listRef: Props['listRef']) {
  return findNonDisabledIndex(listRef);
}

function getMaxIndex(listRef: Props['listRef']) {
  return findNonDisabledIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
  });
}

export interface Props {
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  activeIndex: number | null;
  onNavigate: (index: number | null) => void;
  enabled?: boolean;
  selectedIndex?: number | null;
  focusItemOnOpen?: boolean | 'auto';
  focusItemOnHover?: boolean;
  allowEscape?: boolean;
  loop?: boolean;
  nested?: boolean;
  rtl?: boolean;
  virtual?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'both';
}

/**
 * Adds focus-managed indexed navigation via arrow keys to a list of items
 * within the floating element.
 * @see https://floating-ui.com/docs/useListNavigation
 */
export const useListNavigation = <RT extends ReferenceType = ReferenceType>(
  {open, onOpenChange, refs}: FloatingContext<RT>,
  {
    listRef,
    activeIndex,
    onNavigate,
    enabled = true,
    selectedIndex = null,
    allowEscape = false,
    loop = false,
    nested = false,
    rtl = false,
    virtual = false,
    focusItemOnOpen = 'auto',
    focusItemOnHover = true,
    orientation = 'vertical',
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
  }

  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();
  const previousOpen = usePrevious(open);

  const focusItemOnOpenRef = React.useRef(
    focusItemOnOpen === 'auto' ? false : focusItemOnOpen
  );
  const indexRef = React.useRef(selectedIndex ?? -1);
  const keyRef = React.useRef('');
  const onNavigateRef = useLatestRef(onNavigate);
  const blockPointerLeaveRef = React.useRef(false);
  const frameRef = React.useRef(-1);

  const [activeId, setActiveId] = React.useState<string | undefined>();

  const focusItem = React.useCallback(
    (
      listRef: React.MutableRefObject<Array<HTMLElement | null>>,
      indexRef: React.MutableRefObject<number>
    ) => {
      // `pointerDown` clicks occur before `focus`, so the button will steal the
      // focus unless we wait a frame.
      frameRef.current = requestAnimationFrame(() => {
        if (virtual) {
          setActiveId(listRef.current[indexRef.current]?.id);
        } else {
          listRef.current[indexRef.current]?.focus({preventScroll: true});
        }
      });
    },
    [virtual]
  );

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (selectedIndex != null) {
      indexRef.current = selectedIndex;
    }

    if (!previousOpen && open && focusItemOnOpenRef.current) {
      onNavigateRef.current(indexRef.current);
      focusItem(listRef, indexRef);
    }
  }, [
    open,
    previousOpen,
    selectedIndex,
    listRef,
    onNavigateRef,
    focusItem,
    enabled,
  ]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (open) {
      if (activeIndex == null) {
        if (
          (!previousOpen &&
            focusItemOnOpenRef.current &&
            selectedIndex == null) ||
          allowEscape
        ) {
          if (!allowEscape && !virtual) {
            indexRef.current =
              isMainOrientationToEndKey(keyRef.current, orientation, rtl) ||
              nested
                ? getMinIndex(listRef)
                : getMaxIndex(listRef);
          }
          onNavigateRef.current(activeIndex);
          focusItem(listRef, indexRef);
        }
      } else if (activeIndex >= 0 && activeIndex < listRef.current.length) {
        indexRef.current = activeIndex;
        onNavigateRef.current(activeIndex);
        focusItem(listRef, indexRef);
      }
    }
  }, [
    open,
    previousOpen,
    activeIndex,
    selectedIndex,
    nested,
    listRef,
    onNavigateRef,
    focusItem,
    enabled,
    allowEscape,
    orientation,
    rtl,
    virtual,
  ]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (
      !open &&
      previousOpen &&
      selectedIndex != null &&
      isHTMLElement(refs.reference.current)
    ) {
      refs.reference.current.focus();
    }
  }, [refs.reference, selectedIndex, open, previousOpen, enabled]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (!open) {
      indexRef.current = selectedIndex ?? activeIndex ?? -1;
      onNavigateRef.current(null);
      cancelAnimationFrame(frameRef.current);
    }
  }, [open, selectedIndex, activeIndex, enabled, onNavigateRef]);

  // Ensure the parent floating element has focus when a nested child closes
  // to allow arrow key navigation to work after the pointer leaves the child.
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (!open && previousOpen) {
      const parentFloating = tree?.nodesRef.current.find(
        (node) => node.id === parentId
      )?.context?.refs.floating.current;

      if (
        parentFloating &&
        !parentFloating.contains(activeElement(getDocument(parentFloating)))
      ) {
        parentFloating.focus({preventScroll: true});
      }
    }
  }, [enabled, open, previousOpen, tree, parentId]);

  useLayoutEffect(() => {
    if (focusItemOnOpen === 'auto') {
      focusItemOnOpenRef.current = false;
    }
    keyRef.current = '';
  });

  function onFloatingKeyDown(event: React.KeyboardEvent) {
    blockPointerLeaveRef.current = true;

    if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl)) {
      stopEvent(event);
      onOpenChange(false);

      if (isHTMLElement(refs.reference.current)) {
        refs.reference.current.focus();
      }

      return;
    }

    const currentIndex = indexRef.current;
    const minIndex = getMinIndex(listRef);
    const maxIndex = getMaxIndex(listRef);

    if (event.key === 'Home') {
      indexRef.current = minIndex;
      onNavigate(indexRef.current);
    }

    if (event.key === 'End') {
      indexRef.current = maxIndex;
      onNavigate(indexRef.current);
    }

    if (isMainOrientationKey(event.key, orientation)) {
      stopEvent(event);

      if (
        !virtual &&
        activeElement(event.currentTarget.ownerDocument) === event.currentTarget
      ) {
        indexRef.current =
          selectedIndex ??
          (isMainOrientationToEndKey(event.key, orientation, rtl)
            ? minIndex
            : maxIndex);
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
                });
        } else {
          indexRef.current = Math.min(
            maxIndex,
            findNonDisabledIndex(listRef, {
              startingIndex: currentIndex,
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
                });
        } else {
          indexRef.current = Math.max(
            minIndex,
            findNonDisabledIndex(listRef, {
              startingIndex: currentIndex,
              decrement: true,
            })
          );
        }
      }

      onNavigate(indexRef.current);
    }
  }

  if (!enabled) {
    return {};
  }

  return {
    reference: {
      ...(virtual &&
        open &&
        activeIndex != null && {
          'aria-activedescendant': activeId,
        }),
      onKeyDown(event) {
        blockPointerLeaveRef.current = true;

        if (virtual && open) {
          return onFloatingKeyDown(event);
        }

        if (focusItemOnOpen === 'auto') {
          focusItemOnOpenRef.current = true;
        }

        keyRef.current = event.key;

        if (nested) {
          if (isCrossOrientationOpenKey(event.key, orientation, rtl)) {
            stopEvent(event);

            if (open) {
              indexRef.current = getMinIndex(listRef);
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
          onOpenChange(true);

          if (open) {
            onNavigate(indexRef.current);
          }
        }

        if (virtual && !open) {
          onFloatingKeyDown(event);
        }
      },
    },
    floating: {
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ...(virtual &&
        activeIndex != null && {
          'aria-activedescendant': activeId,
        }),
      onKeyDown: onFloatingKeyDown,
      onPointerMove() {
        blockPointerLeaveRef.current = false;
      },
    },
    item: {
      onFocus({currentTarget}) {
        const index = listRef.current.indexOf(currentTarget);
        if (index !== -1) {
          onNavigate(index);
        }
      },
      onClick: ({currentTarget}) => currentTarget.focus({preventScroll: true}), // Safari
      ...(focusItemOnHover && {
        onMouseMove({currentTarget}) {
          const target = currentTarget as HTMLButtonElement | null;
          if (target) {
            const index = listRef.current.indexOf(target);
            if (index !== -1) {
              onNavigate(index);
            }
          }
        },
        onMouseLeave() {
          if (!blockPointerLeaveRef.current) {
            onNavigate(null);
            if (!virtual) {
              refs.floating.current?.focus({preventScroll: true});
            } else {
              indexRef.current = -1;
              focusItem(listRef, indexRef);
            }
          }
        },
      }),
    },
  };
};
