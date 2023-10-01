import {stopEvent} from '@floating-ui/react/utils';
import * as React from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {useEffectEvent} from './utils/useEffectEvent';
import {useLatestRef} from './utils/useLatestRef';

export interface UseTypeaheadProps {
  listRef: React.MutableRefObject<Array<string | null>>;
  activeIndex: number | null;
  onMatch?: (index: number) => void;
  onTypingChange?: (isTyping: boolean) => void;
  enabled?: boolean;
  findMatch?:
    | null
    | ((
        list: Array<string | null>,
        typedString: string
      ) => string | null | undefined);
  resetMs?: number;
  ignoreKeys?: Array<string>;
  selectedIndex?: number | null;
}

/**
 * Provides a matching callback that can be used to focus an item as the user
 * types, often used in tandem with `useListNavigation()`.
 * @see https://floating-ui.com/docs/useTypeahead
 */
export function useTypeahead<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseTypeaheadProps
): ElementProps {
  const {open, dataRef} = context;
  const {
    listRef,
    activeIndex,
    onMatch: unstable_onMatch,
    onTypingChange: unstable_onTypingChange,
    enabled = true,
    findMatch = null,
    resetMs = 750,
    ignoreKeys = [],
    selectedIndex = null,
  } = props;

  const timeoutIdRef = React.useRef<any>();
  const stringRef = React.useRef('');
  const prevIndexRef = React.useRef<number | null>(
    selectedIndex ?? activeIndex ?? -1
  );
  const matchIndexRef = React.useRef<number | null>(null);

  const onMatch = useEffectEvent(unstable_onMatch);
  const onTypingChange = useEffectEvent(unstable_onTypingChange);

  const findMatchRef = useLatestRef(findMatch);
  const ignoreKeysRef = useLatestRef(ignoreKeys);

  useLayoutEffect(() => {
    if (open) {
      clearTimeout(timeoutIdRef.current);
      matchIndexRef.current = null;
      stringRef.current = '';
    }
  }, [open]);

  useLayoutEffect(() => {
    // Sync arrow key navigation but not typeahead navigation.
    if (open && stringRef.current === '') {
      prevIndexRef.current = selectedIndex ?? activeIndex ?? -1;
    }
  }, [open, selectedIndex, activeIndex]);

  return React.useMemo(() => {
    if (!enabled) {
      return {};
    }

    function setTypingChange(value: boolean) {
      if (value) {
        if (!dataRef.current.typing) {
          dataRef.current.typing = value;
          onTypingChange(value);
        }
      } else {
        if (dataRef.current.typing) {
          dataRef.current.typing = value;
          onTypingChange(value);
        }
      }
    }

    function getMatchingIndex(
      list: Array<string | null>,
      orderedList: Array<string | null>,
      string: string
    ) {
      const str = findMatchRef.current
        ? findMatchRef.current(orderedList, string)
        : orderedList.find(
            (text) =>
              text?.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) ===
              0
          );

      return str ? list.indexOf(str) : -1;
    }

    function onKeyDown(event: React.KeyboardEvent) {
      const listContent = listRef.current;

      if (stringRef.current.length > 0 && stringRef.current[0] !== ' ') {
        if (
          getMatchingIndex(listContent, listContent, stringRef.current) === -1
        ) {
          setTypingChange(false);
        } else if (event.key === ' ') {
          stopEvent(event);
        }
      }

      if (
        listContent == null ||
        ignoreKeysRef.current.includes(event.key) ||
        // Character key.
        event.key.length !== 1 ||
        // Modifier key.
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      if (open && event.key !== ' ') {
        stopEvent(event);
        setTypingChange(true);
      }

      // Bail out if the list contains a word like "llama" or "aaron". TODO:
      // allow it in this case, too.
      const allowRapidSuccessionOfFirstLetter = listContent.every((text) =>
        text
          ? text[0]?.toLocaleLowerCase() !== text[1]?.toLocaleLowerCase()
          : true
      );

      // Allows the user to cycle through items that start with the same letter
      // in rapid succession.
      if (
        allowRapidSuccessionOfFirstLetter &&
        stringRef.current === event.key
      ) {
        stringRef.current = '';
        prevIndexRef.current = matchIndexRef.current;
      }

      stringRef.current += event.key;
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(() => {
        stringRef.current = '';
        prevIndexRef.current = matchIndexRef.current;
        setTypingChange(false);
      }, resetMs);

      const prevIndex = prevIndexRef.current;

      const index = getMatchingIndex(
        listContent,
        [
          ...listContent.slice((prevIndex || 0) + 1),
          ...listContent.slice(0, (prevIndex || 0) + 1),
        ],
        stringRef.current
      );

      if (index !== -1) {
        onMatch(index);
        matchIndexRef.current = index;
      } else if (event.key !== ' ') {
        stringRef.current = '';
        setTypingChange(false);
      }
    }

    return {
      reference: {onKeyDown},
      floating: {
        onKeyDown,
        onKeyUp(event) {
          if (event.key === ' ') {
            setTypingChange(false);
          }
        },
      },
    };
  }, [
    enabled,
    open,
    dataRef,
    listRef,
    resetMs,
    ignoreKeysRef,
    findMatchRef,
    onMatch,
    onTypingChange,
  ]);
}
