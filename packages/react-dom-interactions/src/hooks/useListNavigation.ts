import React, {MutableRefObject, useCallback, useRef, useState} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import {useFloatingParentNodeId, useFloatingTree} from '../FloatingTree';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {isHTMLElement} from '../utils/is';
import {stopEvent} from '../utils/stopEvent';
import {useLatestRef} from '../utils/useLatestRef';

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';

function findNonDisabledIndex(
  listRef: MutableRefObject<Array<HTMLElement | null>>,
  {startingIndex = -1, decrement = false} = {}
): number {
  const list = getPresentListItems(listRef);

  let index = startingIndex;
  do {
    index = index + (decrement ? -1 : 1);
  } while (
    list[index]?.hasAttribute('disabled') ||
    list[index]?.getAttribute('aria-disabled') === 'true'
  );

  return index === -1 ? 0 : index;
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

function isMainOrientationToStartKey(
  key: string,
  orientation: Props['orientation'],
  rtl: boolean
) {
  const vertical = key === ARROW_UP;
  const horizontal = rtl ? key === ARROW_RIGHT : key === ARROW_LEFT;
  return doSwitch(orientation, vertical, horizontal);
}

function isMainOrientationToEndKey(
  key: string,
  orientation: Props['orientation'],
  rtl: boolean
) {
  const vertical = key === ARROW_DOWN;
  const horizontal = rtl ? key === ARROW_LEFT : key === ARROW_RIGHT;
  return doSwitch(orientation, vertical, horizontal);
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
    startingIndex: getPresentListItems(listRef).length,
  });
}

function getPresentListItems(listRef: Props['listRef']) {
  return listRef.current.filter((item) => item != null) as Array<HTMLElement>;
}

export interface Props {
  listRef: React.MutableRefObject<Array<HTMLElement | null>>;
  activeIndex: number | null;
  onNavigate: (index: number | null) => void;
  enabled?: boolean;
  selectedIndex?: number | null;
  focusItemOnOpen?: boolean | 'auto';
  focusItemOnHover?: boolean;
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
  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree();

  const focusOnOpenRef = useRef(focusItemOnOpen);
  const indexRef = useRef(selectedIndex ?? -1);
  const keyRef = useRef('');
  const initializedRef = useRef(false);
  const onNavigateRef = useLatestRef(onNavigate);
  const blockPointerLeaveRef = useRef(false);

  const [activeId, setActiveId] = useState<string | undefined>();

  const focusItem = useCallback(
    (
      listRef: MutableRefObject<Array<HTMLElement | null>>,
      indexRef: React.MutableRefObject<number>
    ) => {
      if (virtual) {
        setActiveId(getPresentListItems(listRef)[indexRef.current]?.id);
      } else {
        getPresentListItems(listRef)[indexRef.current]?.focus({
          preventScroll: true,
        });
      }
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

    if (open && focusOnOpenRef.current) {
      onNavigateRef.current(indexRef.current);
      focusItem(listRef, indexRef);
    }
  }, [open, selectedIndex, listRef, onNavigateRef, focusItem, enabled]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (open && activeIndex != null) {
      indexRef.current = activeIndex;
      onNavigateRef.current(indexRef.current);
      focusItem(listRef, indexRef);
    }
  }, [
    open,
    activeIndex,
    selectedIndex,
    listRef,
    onNavigateRef,
    focusItem,
    enabled,
    parentId,
    refs.floating,
    tree?.nodesRef,
  ]);

  useLayoutEffect(() => {
    if (selectedIndex != null || !enabled) {
      return;
    }

    if (open) {
      if (
        isMainOrientationKey(keyRef.current, orientation) ||
        (focusOnOpenRef.current &&
          (keyRef.current === ' ' || keyRef.current === 'Enter'))
      ) {
        indexRef.current = isMainOrientationToStartKey(
          keyRef.current,
          orientation,
          rtl
        )
          ? getMaxIndex(listRef)
          : getMinIndex(listRef);
        onNavigateRef.current(indexRef.current);
        focusItem(listRef, indexRef);
      }
    }

    keyRef.current = '';
  }, [
    open,
    listRef,
    selectedIndex,
    onNavigateRef,
    focusItem,
    enabled,
    orientation,
    rtl,
  ]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (!open && initializedRef.current && selectedIndex != null) {
      (refs.reference.current as HTMLElement | null)?.focus();
    }
  }, [refs.reference, selectedIndex, open, enabled]);

  useLayoutEffect(() => {
    initializedRef.current = true;
    return () => {
      initializedRef.current = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    if (!open) {
      if (focusItemOnOpen === 'auto') {
        focusOnOpenRef.current = true;
      }
      indexRef.current = selectedIndex ?? activeIndex ?? -1;
      onNavigateRef.current(null);
    }
  }, [
    open,
    selectedIndex,
    activeIndex,
    enabled,
    focusItemOnOpen,
    onNavigateRef,
  ]);

  function pointerCheck(event: React.PointerEvent) {
    if (focusItemOnOpen === 'auto') {
      // undefined or '' depending on the browser
      focusOnOpenRef.current = !event.pointerType;
    }
  }

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
        event.currentTarget.ownerDocument.activeElement === event.currentTarget
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
              ? minIndex
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
              ? maxIndex
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
        open && {
          'aria-activedescendant': activeId,
        }),
      onPointerEnter: pointerCheck,
      onPointerDown: pointerCheck,
      onKeyDown(event) {
        blockPointerLeaveRef.current = true;

        if (virtual && open) {
          return onFloatingKeyDown(event);
        }

        if (focusItemOnOpen === 'auto') {
          focusOnOpenRef.current = true;
        }

        keyRef.current = event.key;

        if (nested) {
          if (isCrossOrientationOpenKey(event.key, orientation, rtl)) {
            indexRef.current = getMinIndex(listRef);
            stopEvent(event);
            onOpenChange(true);
            onNavigate(indexRef.current);
          }

          return;
        }

        if (isMainOrientationKey(event.key, orientation)) {
          if (selectedIndex == null) {
            indexRef.current = isMainOrientationToEndKey(
              event.key,
              orientation,
              rtl
            )
              ? getMinIndex(listRef)
              : getMaxIndex(listRef);
          } else {
            indexRef.current = selectedIndex;
          }

          stopEvent(event);
          onOpenChange(true);
          onNavigate(indexRef.current);
        }

        if (virtual && !open) {
          onFloatingKeyDown(event);
        }
      },
    },
    floating: {
      'aria-orientation': orientation === 'both' ? undefined : orientation,
      ...(virtual && {
        'aria-activedescendant': activeId,
      }),
      onKeyDown: onFloatingKeyDown,
      onPointerMove() {
        blockPointerLeaveRef.current = false;
      },
    },
    item: {
      onClick: ({currentTarget}) => currentTarget.focus({preventScroll: true}), // Safari
      ...(focusItemOnHover && {
        onPointerMove({currentTarget}) {
          const target = currentTarget as HTMLButtonElement | null;
          if (target) {
            const index = getPresentListItems(listRef).indexOf(target);
            if (index !== -1) {
              onNavigate(index);
            }
          }
        },
        onPointerLeave() {
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
