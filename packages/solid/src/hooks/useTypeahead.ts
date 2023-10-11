import {stopEvent} from '@floating-ui/utils/react';
import {MaybeAccessor} from '@solid-primitives/utils';
import {Accessor, createEffect, mergeProps} from 'solid-js';

import type {ElementProps, FloatingContext, ReferenceType} from '../types';
import {destructure} from '../utils/destructure';

type ListType = Accessor<Array<string | null>>;
export interface UseTypeaheadProps {
  listRef: ListType;
  activeIndex: MaybeAccessor<number | null>;
  onMatch?: (index: number) => void;
  onTypingChange?: (isTyping: boolean) => void;
  enabled?: MaybeAccessor<boolean>;
  findMatch?:
    | null
    | ((
        list: Array<string | null>,
        typedString: string
      ) => string | null | undefined);
  resetMs?: MaybeAccessor<number>;
  ignoreKeys?: Array<string>;
  selectedIndex?: MaybeAccessor<number | null>;
}

/**
 * Provides a matching callback that can be used to focus an item as the user
 * types, often used in tandem with `useListNavigation()`.
 * @see https://floating-ui.com/docs/useTypeahead
 */
export function useTypeahead<RT extends ReferenceType = ReferenceType>(
  context: FloatingContext<RT>,
  props: UseTypeaheadProps
): Accessor<ElementProps> {
  const mergedProps = mergeProps(
    {
      enabled: true,
      findMatch: null,
      resetMs: 750,
      ignoreKeys: [],
      selectedIndex: null,
    } as Required<
      Pick<
        UseTypeaheadProps,
        'findMatch' | 'resetMs' | 'ignoreKeys' | 'selectedIndex' | 'enabled'
      >
    >,
    props
  );

  const {listRef, activeIndex, ignoreKeys, enabled, resetMs, selectedIndex} =
    destructure(mergedProps, {normalize: true});
  const {
    onMatch,
    onTypingChange,

    findMatch,
  } = mergedProps;

  let timeoutIdRef: number;
  let stringRef = '';
  let prevIndexRef: number | null = selectedIndex() ?? activeIndex() ?? -1;
  let matchIndexRef: number | null = null;

  createEffect(() => {
    if (context.open()) {
      clearTimeout(timeoutIdRef);
      matchIndexRef = null;
      stringRef = '';
    }
  });

  createEffect(() => {
    // Sync arrow key navigation but not typeahead navigation.
    if (context.open() && stringRef === '') {
      prevIndexRef = selectedIndex() ?? activeIndex() ?? -1;
    }
  });

  function setTypingChange(value: boolean) {
    const {dataRef} = context;
    if (value) {
      if (!dataRef.typing) {
        dataRef.typing = value;
        onTypingChange?.(value);
      }
    } else {
      if (dataRef.typing) {
        dataRef.typing = value;
        onTypingChange?.(value);
      }
    }
  }

  function getMatchingIndex(
    list: Array<string | null>,
    orderedList: Array<string | null>,
    string: string
  ) {
    const str = findMatch
      ? findMatch(orderedList, string)
      : orderedList.find(
          (text) =>
            text?.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) === 0
        );

    return str ? list.indexOf(str) : -1;
  }

  function onKeyDown(event: KeyboardEvent) {
    const listContent = listRef;
    if (stringRef.length > 0 && stringRef[0] !== ' ') {
      if (getMatchingIndex(listContent(), listContent(), stringRef) === -1) {
        setTypingChange(false);
      } else if (event.key === ' ') {
        stopEvent(event);
      }
    }

    if (
      listContent() == null ||
      ignoreKeys().includes(event.key) ||
      // Character key.
      event.key.length !== 1 ||
      // Modifier key.
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (context.open() && event.key !== ' ') {
      stopEvent(event);
      setTypingChange(true);
    }

    // Bail out if the list contains a word like "llama" or "aaron". TODO
    // allow it in this case, too.
    const allowRapidSuccessionOfFirstLetter = listContent().every((text) =>
      text
        ? text[0]?.toLocaleLowerCase() !== text[1]?.toLocaleLowerCase()
        : true
    );

    // Allows the user to cycle through items that start with the same letter
    // in rapid succession.
    if (allowRapidSuccessionOfFirstLetter && stringRef === event.key) {
      stringRef = '';
      prevIndexRef = matchIndexRef;
    }

    stringRef += event.key;
    clearTimeout(timeoutIdRef);
    timeoutIdRef = setTimeout(() => {
      stringRef = '';
      prevIndexRef = matchIndexRef;
      setTypingChange(false);
    }, resetMs());

    const prevIndex = prevIndexRef;

    const index = getMatchingIndex(
      listContent(),
      [
        ...listContent().slice((prevIndex || 0) + 1),
        ...listContent().slice(0, (prevIndex || 0) + 1),
      ],
      stringRef
    );

    if (index !== -1) {
      onMatch?.(index);
      matchIndexRef = index;
    } else if (event.key !== ' ') {
      stringRef = '';
      setTypingChange(false);
    }
  }

  return () =>
    !enabled()
      ? {}
      : {
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
}
