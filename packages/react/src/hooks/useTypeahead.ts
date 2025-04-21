import * as React from 'react';
import {
  useEffectEvent,
  useLatestRef,
  useModernLayoutEffect,
  stopEvent,
} from '@floating-ui/react/utils';

import type {ElementProps, FloatingRootContext} from '../types';
import {clearTimeoutIfSet} from '../utils/clearTimeoutIfSet';

export interface UseTypeaheadProps {
  /**
   * A ref which contains an array of strings whose indices match the HTML
   * elements of the list.
   * @default empty list
   */
  listRef: React.MutableRefObject<Array<string | null>>;
  /**
   * The index of the active (focused or highlighted) item in the list.
   * @default null
   */
  activeIndex: number | null;
  /**
   * Callback invoked with the matching index if found as the user types.
   */
  onMatch?: (index: number) => void;
  /**
   * Callback invoked with the typing state as the user types.
   */
  onTypingChange?: (isTyping: boolean) => void;
  /**
   * Whether the Hook is enabled, including all internal Effects and event
   * handlers.
   * @default true
   */
  enabled?: boolean;
  /**
   * A function that returns the matching string from the list.
   * @default lowercase-finder
   */
  findMatch?:
    | null
    | ((
        list: Array<string | null>,
        typedString: string,
      ) => string | null | undefined);
  /**
   * The number of milliseconds to wait before resetting the typed string.
   * @default 750
   */
  resetMs?: number;
  /**
   * An array of keys to ignore when typing.
   * @default []
   */
  ignoreKeys?: Array<string>;
  /**
   * The index of the selected item in the list, if available.
   * @default null
   */
  selectedIndex?: number | null;
}

/**
 * Provides a matching callback that can be used to focus an item as the user
 * types, often used in tandem with `useListNavigation()`.
 * @see https://floating-ui.com/docs/useTypeahead
 */
export function useTypeahead(
  context: FloatingRootContext,
  props: UseTypeaheadProps,
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

  const timeoutIdRef = React.useRef(-1);
  const stringRef = React.useRef('');
  const prevIndexRef = React.useRef<number | null>(
    selectedIndex ?? activeIndex ?? -1,
  );
  const matchIndexRef = React.useRef<number | null>(null);

  const onMatch = useEffectEvent(unstable_onMatch);
  const onTypingChange = useEffectEvent(unstable_onTypingChange);

  const findMatchRef = useLatestRef(findMatch);
  const ignoreKeysRef = useLatestRef(ignoreKeys);

  useModernLayoutEffect(() => {
    if (open) {
      clearTimeoutIfSet(timeoutIdRef);
      matchIndexRef.current = null;
      stringRef.current = '';
    }
  }, [open]);

  useModernLayoutEffect(() => {
    // Sync arrow key navigation but not typeahead navigation.
    if (open && stringRef.current === '') {
      prevIndexRef.current = selectedIndex ?? activeIndex ?? -1;
    }
  }, [open, selectedIndex, activeIndex]);

  const setTypingChange = useEffectEvent((value: boolean) => {
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
  });

  const onKeyDown = useEffectEvent((event: React.KeyboardEvent) => {
    function getMatchingIndex(
      list: Array<string | null>,
      orderedList: Array<string | null>,
      string: string,
    ) {
      const str = findMatchRef.current
        ? findMatchRef.current(orderedList, string)
        : orderedList.find(
            (text) =>
              text?.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) ===
              0,
          );

      return str ? list.indexOf(str) : -1;
    }

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
        : true,
    );

    // Allows the user to cycle through items that start with the same letter
    // in rapid succession.
    if (allowRapidSuccessionOfFirstLetter && stringRef.current === event.key) {
      stringRef.current = '';
      prevIndexRef.current = matchIndexRef.current;
    }

    stringRef.current += event.key;
    clearTimeoutIfSet(timeoutIdRef);
    timeoutIdRef.current = window.setTimeout(() => {
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
      stringRef.current,
    );

    if (index !== -1) {
      onMatch(index);
      matchIndexRef.current = index;
    } else if (event.key !== ' ') {
      stringRef.current = '';
      setTypingChange(false);
    }
  });

  const reference: ElementProps['reference'] = React.useMemo(
    () => ({onKeyDown}),
    [onKeyDown],
  );

  const floating: ElementProps['floating'] = React.useMemo(() => {
    return {
      onKeyDown,
      onKeyUp(event) {
        if (event.key === ' ') {
          setTypingChange(false);
        }
      },
    };
  }, [onKeyDown, setTypingChange]);

  return React.useMemo(
    () => (enabled ? {reference, floating} : {}),
    [enabled, reference, floating],
  );
}
