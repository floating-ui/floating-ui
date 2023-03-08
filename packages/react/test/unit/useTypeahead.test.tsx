import {act, cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useRef, useState} from 'react';

import {useFloating, useInteractions, useTypeahead} from '../../src';
import type {Props} from '../../src/hooks/useTypeahead';
import {Main} from '../visual/components/Menu';

jest.useFakeTimers();
const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

const useImpl = (
  props: Pick<Props, 'onMatch' | 'onTypingChange'> & {list?: Array<string>}
) => {
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const {reference, floating, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const listRef = useRef(props.list ?? ['one', 'two', 'three']);
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useTypeahead(context, {
      listRef,
      activeIndex,
      onMatch(index) {
        setActiveIndex(index);
        props.onMatch?.(index);
      },
      onTypingChange: props.onTypingChange,
    }),
  ]);
  return {
    activeIndex,
    open,
    getReferenceProps: (userProps?: React.HTMLProps<Element>) =>
      getReferenceProps({
        role: 'combobox',
        ...userProps,
        ref: reference,
      }),
    getFloatingProps: () =>
      getFloatingProps({
        role: 'listbox',
        ref: floating,
      }),
  };
};

function App(
  props: Pick<Props, 'onMatch' | 'onTypingChange'> & {list?: Array<string>}
) {
  const {getReferenceProps, getFloatingProps} = useImpl(props);
  return (
    <>
      <input {...getReferenceProps()} />
      <div {...getFloatingProps()} />
    </>
  );
}

test('rapidly focuses list items when they start with the same letter', async () => {
  const spy = jest.fn();
  render(<App onMatch={spy} />);

  await user.click(screen.getByRole('combobox'));

  await user.keyboard('t');
  expect(spy).toHaveBeenCalledWith(1);

  await user.keyboard('t');
  expect(spy).toHaveBeenCalledWith(2);

  await user.keyboard('t');
  expect(spy).toHaveBeenCalledWith(1);

  cleanup();
});

test('bails out of rapid focus of first letter if the list contains a string that starts with two of the same letter', async () => {
  const spy = jest.fn();
  render(<App onMatch={spy} list={['apple', 'aaron', 'apricot']} />);

  await user.click(screen.getByRole('combobox'));

  await user.keyboard('a');
  expect(spy).toHaveBeenCalledWith(0);

  await user.keyboard('a');
  expect(spy).toHaveBeenCalledWith(0);

  cleanup();
});

test('starts from the current activeIndex and correctly loops', async () => {
  const spy = jest.fn();
  render(
    <App onMatch={spy} list={['Toy Story 2', 'Toy Story 3', 'Toy Story 4']} />
  );

  await user.click(screen.getByRole('combobox'));

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(0);

  spy.mockReset();

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).not.toHaveBeenCalled();

  jest.advanceTimersByTime(750);

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(1);

  jest.advanceTimersByTime(750);

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(2);

  jest.advanceTimersByTime(750);

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(0);

  cleanup();
});

test('capslock characters continue to match', async () => {
  const spy = jest.fn();
  render(<App onMatch={spy} />);

  user.click(screen.getByRole('combobox'));

  await user.keyboard('{CapsLock}t');
  expect(spy).toHaveBeenCalledWith(1);

  cleanup();
});

function App1(props: Pick<Props, 'onMatch'> & {list: Array<string>}) {
  const {getReferenceProps, getFloatingProps, activeIndex, open} =
    useImpl(props);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <div
        {...getReferenceProps({
          onClick: () => inputRef.current?.focus(),
        })}
      >
        <input ref={inputRef} readOnly={true} />
      </div>
      {open && (
        <div {...getFloatingProps()}>
          {props.list.map((value, i) => (
            <div
              key={value}
              role="option"
              tabIndex={i === activeIndex ? 0 : -1}
              aria-selected={i === activeIndex}
            >
              {value}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

test('matches when focus is withing reference', async () => {
  const spy = jest.fn();
  render(<App1 onMatch={spy} list={['one', 'two', 'three']} />);

  await user.click(screen.getByRole('combobox'));

  await user.keyboard('t');
  expect(spy).toHaveBeenCalledWith(1);

  cleanup();
});

test('matches when focus is withing floating', async () => {
  const spy = jest.fn();
  render(<App1 onMatch={spy} list={['one', 'two', 'three']} />);

  await user.click(screen.getByRole('combobox'));

  await user.keyboard('t');
  const option = await screen.findByRole('option', {selected: true});
  expect(option.textContent).toBe('two');
  option.focus();
  expect(option).toHaveFocus();

  await user.keyboard('h');
  expect(
    (await screen.findByRole('option', {selected: true})).textContent
  ).toBe('three');

  cleanup();
});

test('onTypingChange is called when typing starts or stops', async () => {
  const spy = jest.fn();
  render(<App onTypingChange={spy} list={['one', 'two', 'three']} />);

  act(() => screen.getByRole('combobox').focus());

  await user.keyboard('t');
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(true);

  jest.advanceTimersByTime(750);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(false);

  cleanup();
});

test('Menu - skips disabled items and opens submenu on space if no match', async () => {
  jest.useRealTimers();

  render(<Main />);

  await userEvent.click(screen.getByText('Edit'));
  await act(async () => {});

  expect(screen.getByRole('menu')).toBeInTheDocument();

  await userEvent.keyboard('c');

  expect(screen.getByText('Copy as')).toHaveFocus();

  await userEvent.keyboard('opy as ');

  expect(screen.getByText('Copy as').getAttribute('aria-expanded')).toBe(
    'false'
  );

  await userEvent.keyboard(' ');

  expect(screen.getByText('Copy as').getAttribute('aria-expanded')).toBe(
    'true'
  );
});

test('Menu - resets once a match is no longer found', async () => {
  jest.useRealTimers();

  render(<Main />);

  await userEvent.click(screen.getByText('Edit'));
  await act(async () => {});

  expect(screen.getByRole('menu')).toBeInTheDocument();

  await userEvent.keyboard('undr');

  expect(screen.getByText('Undo')).toHaveFocus();

  await userEvent.keyboard('r');

  expect(screen.getByText('Redo')).toHaveFocus();
});
