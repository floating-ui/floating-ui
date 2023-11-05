import {stopEvent} from '../utils';
import {MaybeAccessor} from '@solid-primitives/utils';
import {
  Accessor,
  createEffect,
  createMemo,
  mergeProps,
  splitProps,
} from 'solid-js';

import {useFloatingParentNodeId} from '../components/FloatingTree';
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
        typedString: string,
      ) => string | null | undefined);
  resetMs?: MaybeAccessor<number>;
  ignoreKeys?: MaybeAccessor<Array<string>>;
  selectedIndex?: MaybeAccessor<number | null>;
}

/**
 * Provides a matching callback that can be used to focus an item as the user
 * types, often used in tandem with `useListNavigation()`.
 * @see https://floating-ui.com/docs/useTypeahead
 */
export function useTypeahead<RT extends ReferenceType = ReferenceType>(
  context: Accessor<FloatingContext<RT>>,
  props: UseTypeaheadProps,
): Accessor<ElementProps> {
  const [local, rest] = splitProps(props, [
    'onMatch',
    'onTypingChange',
    'findMatch',
  ]);
  const mergedProps = mergeProps(
    {
      listRef: () => [],
      activeIndex: null,
      enabled: true,
      findMatch: null,
      resetMs: 750,
      ignoreKeys: [],
      selectedIndex: null,
    },
    rest,
  ) as Required<
    Omit<UseTypeaheadProps, 'onMatch' | 'onTypingChange' | 'findMatch'>
  >;

  const {listRef, activeIndex, ignoreKeys, enabled, resetMs, selectedIndex} =
    destructure(mergedProps, {normalize: true});
  const {onTypingChange, findMatch, onMatch} = local;

  let timeoutIdRef: number | ReturnType<typeof setTimeout>;
  let stringRef = '';
  let prevIndexRef: number | null = selectedIndex() ?? activeIndex() ?? -1;
  let matchIndexRef: number | null = null;
  const parentId = useFloatingParentNodeId();
  const isNotNested = parentId === null;
  createEffect(() => {
    if (context().open()) {
      clearTimeout(timeoutIdRef);
      matchIndexRef = null;
      stringRef = '';
    }
  });

  createEffect(() => {
    // Sync arrow key navigation but not typeahead navigation.
    if (context().open() && stringRef === '') {
      prevIndexRef = selectedIndex() ?? activeIndex() ?? -1;
    }
  });

  function setTypingChange(value: boolean) {
    if (context().dataRef.typing !== value) {
      context().dataRef.typing = value;
      onTypingChange?.(value);
    }
  }
  function getMatchingIndex(
    list: Array<string | null>,
    orderedList: Array<string | null>,
    string: string,
  ) {
    const str = findMatch
      ? findMatch(orderedList, string)
      : orderedList.find(
          (text) =>
            text?.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) === 0,
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

    if (context().open() && event.key !== ' ') {
      setTypingChange(true);
      stopEvent(event);
    }

    // Bail out if the list contains a word like "llama" or "aaron". TODO
    // allow it in this case, too.
    const allowRapidSuccessionOfFirstLetter = listContent().every((text) =>
      text
        ? text[0]?.toLocaleLowerCase() !== text[1]?.toLocaleLowerCase()
        : true,
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
      stringRef,
    );

    if (index !== -1) {
      if (event.key === ' ') {
        stopEvent(event);
      }
      onMatch?.(index);
      matchIndexRef = index;
    } else if (event.key !== ' ') {
      //no match
      stringRef = '';
      isNotNested && setTypingChange(false);
    }
  }

  return createMemo(() => {
    if (!enabled()) return {};
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
  });
}
