import {render} from '@testing-library/react';
import {useEffect, useRef, useState} from 'react';
import {vi} from 'vitest';

import {
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInnerOffset,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '../../src';

test('correctly merges functions', () => {
  const firstInteractionOnClick = vi.fn();
  const secondInteractionOnClick = vi.fn();
  const secondInteractionOnKeyDown = vi.fn();
  const userOnClick = vi.fn();

  function App() {
    const {getReferenceProps} = useInteractions([
      {reference: {onClick: firstInteractionOnClick}},
      {
        reference: {
          onClick: secondInteractionOnClick,
          onKeyDown: secondInteractionOnKeyDown,
        },
      },
    ]);

    const {onClick, onKeyDown} = getReferenceProps({onClick: userOnClick});

    // @ts-expect-error
    onClick();
    // @ts-expect-error
    onKeyDown();

    return null;
  }

  render(<App />);

  expect(firstInteractionOnClick).toHaveBeenCalledTimes(1);
  expect(secondInteractionOnClick).toHaveBeenCalledTimes(1);
  expect(userOnClick).toHaveBeenCalledTimes(1);
  expect(secondInteractionOnKeyDown).toHaveBeenCalledTimes(1);
});

test('does not error with undefined user supplied functions', () => {
  function App() {
    const {getReferenceProps} = useInteractions([{reference: {onClick() {}}}]);
    expect(() =>
      // @ts-expect-error
      getReferenceProps({onClick: undefined}).onClick(),
    ).not.toThrowError();
    return null;
  }

  render(<App />);
});

test('does not break props that start with `on`', () => {
  function App() {
    const {getReferenceProps} = useInteractions([]);

    const props = getReferenceProps({
      // @ts-expect-error
      onlyShowVotes: true,
      onyx: () => {},
    });

    expect(props.onlyShowVotes).toBe(true);
    expect(typeof props.onyx).toBe('function');

    return null;
  }

  render(<App />);
});

test('does not break props that return values', () => {
  function App() {
    const {getReferenceProps} = useInteractions([]);

    const props = getReferenceProps({
      // @ts-expect-error
      onyx: () => 'returned value',
    });

    // @ts-expect-error
    expect(props.onyx()).toBe('returned value');

    return null;
  }

  render(<App />);
});

test('prop getters are memoized', () => {
  function App() {
    const [open, setOpen] = useState(false);
    const [c, setCount] = useState(0);
    c;

    const handleClose = () => () => {};
    handleClose.__options = {blockPointerEvents: true};

    const listRef = useRef([]);
    const overflowRef = useRef({top: 0, left: 0, bottom: 0, right: 0});
    const {context} = useFloating({open, onOpenChange: setOpen});

    // NOTE: if `ref`-related props are not memoized, this will cause
    // an infinite loop as they must be memoized externally (as done by React).
    // Other non-primitives like functions and arrays get memoized by the hooks.
    const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions(
      [
        useHover(context, {handleClose}),
        useFocus(context),
        useClick(context),
        useRole(context),
        useDismiss(context),
        useListNavigation(context, {
          listRef,
          activeIndex: 0,
          onNavigate: () => {},
          disabledIndices: [],
        }),
        useTypeahead(context, {
          listRef,
          activeIndex: 0,
          ignoreKeys: [],
          onMatch: () => {},
          findMatch: () => '',
        }),
        useInnerOffset(context, {
          onChange: () => {},
          overflowRef,
        }),
      ],
    );

    useEffect(() => {
      // Should NOT cause an infinite loop as the prop getters are memoized.
      setCount((c) => c + 1);
    }, [getReferenceProps, getFloatingProps, getItemProps]);

    return null;
  }

  render(<App />);
});
