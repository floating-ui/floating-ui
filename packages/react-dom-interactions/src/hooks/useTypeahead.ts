import React, {useRef} from 'react';
import useLayoutEffect from 'use-isomorphic-layout-effect';
import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {getDocument} from '../utils/getDocument';
import {stopEvent} from '../utils/stopEvent';

export interface Props {
  listRef: React.MutableRefObject<Array<string | null>>;
  activeIndex: number | null;
  onMatch?: (index: number) => void;
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
export const useTypeahead = <RT extends ReferenceType = ReferenceType>(
  {open, dataRef}: FloatingContext<RT>,
  {
    listRef,
    activeIndex,
    onMatch = () => {},
    enabled = true,
    findMatch = null,
    resetMs = 1000,
    ignoreKeys = [],
    selectedIndex = null,
  }: Props = {
    listRef: {current: []},
    activeIndex: null,
  }
): ElementProps => {
  const timeoutIdRef = useRef<any>();
  const stringRef = useRef('');
  const prevIndexRef = useRef<number | null>(
    selectedIndex ?? activeIndex ?? -1
  );
  const matchIndexRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (open) {
      clearTimeout(timeoutIdRef.current);
      matchIndexRef.current = null;
      stringRef.current = '';
    }
  }, [open]);

  useLayoutEffect(() => {
    // Sync arrow key navigation but not typeahead navigation
    if (open && stringRef.current === '') {
      prevIndexRef.current = selectedIndex ?? activeIndex ?? -1;
    }
  }, [open, selectedIndex, activeIndex]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (
      !event.currentTarget.contains(
        getDocument(event.currentTarget as HTMLElement).activeElement
      )
    ) {
      return;
    }

    if (stringRef.current.length > 0 && stringRef.current[0] !== ' ') {
      dataRef.current.typing = true;

      if (event.key === ' ') {
        stopEvent(event);
      }
    }

    const listContent = listRef.current;

    if (
      listContent == null ||
      [
        'Home',
        'End',
        'Escape',
        'Enter',
        'Tab',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        ...ignoreKeys,
      ].includes(event.key)
    ) {
      return;
    }

    // Bail out if the list contains a word like "llama" or "aaron". TODO:
    // allow it in this case, too.
    const allowRapidSuccessionOfFirstLetter = listContent.every((text) =>
      text
        ? text[0]?.toLocaleLowerCase() !== text[1]?.toLocaleLowerCase()
        : true
    );

    // Allows the user to cycle through items that start with the same letter
    // in rapid succession
    if (allowRapidSuccessionOfFirstLetter && stringRef.current === event.key) {
      stringRef.current = '';
      prevIndexRef.current = matchIndexRef.current;
    }

    stringRef.current += event.key;
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      stringRef.current = '';
      prevIndexRef.current = matchIndexRef.current;
      dataRef.current.typing = false;
    }, resetMs);

    const prevIndex = prevIndexRef.current;

    const orderedList = [
      ...listContent.slice((prevIndex ?? 0) + 1),
      ...listContent.slice(0, (prevIndex ?? 0) + 1),
    ];

    const str = findMatch
      ? findMatch(orderedList, stringRef.current)
      : orderedList.find(
          (text) => text?.toLocaleLowerCase().indexOf(stringRef.current) === 0
        );

    const index = str ? listContent.indexOf(str) : -1;

    if (index !== -1) {
      onMatch(index);
      matchIndexRef.current = index;
    }
  }

  if (!enabled) {
    return {};
  }

  return {
    reference: {onKeyDown},
    floating: {onKeyDown},
  };
};
