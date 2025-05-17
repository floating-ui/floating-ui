import {act, cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useRef, useState} from 'react';
import {vi} from 'vitest';

import {useClick, useFloating, useInteractions, useTypeahead} from '../../src';
import type {UseTypeaheadProps} from '../../src/hooks/useTypeahead';
import {Main} from '../visual/components/Menu';

vi.useFakeTimers({shouldAdvanceTime: true});

const useImpl = ({
  addUseClick = false,
  ...props
}: Pick<UseTypeaheadProps, 'onMatch' | 'onTypingChange'> & {
  list?: Array<string>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  addUseClick?: boolean;
}) => {
  const [open, setOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const {refs, context} = useFloating({
    open: props.open ?? open,
    onOpenChange: props.onOpenChange ?? setOpen,
  });
  const listRef = useRef(props.list ?? ['one', 'two', 'three']);
  const typeahead = useTypeahead(context, {
    listRef,
    activeIndex,
    onMatch(index) {
      setActiveIndex(index);
      props.onMatch?.(index);
    },
    onTypingChange: props.onTypingChange,
  });
  const click = useClick(context, {
    enabled: addUseClick,
  });

  const {getReferenceProps, getFloatingProps} = useInteractions([
    typeahead,
    click,
  ]);

  return {
    activeIndex,
    open,
    getReferenceProps: (userProps?: React.HTMLProps<Element>) =>
      getReferenceProps({
        role: 'combobox',
        ...userProps,
        ref: refs.setReference,
      }),
    getFloatingProps: () =>
      getFloatingProps({
        role: 'listbox',
        ref: refs.setFloating,
      }),
  };
};

function Combobox(
  props: Pick<UseTypeaheadProps, 'onMatch' | 'onTypingChange'> & {
    list?: Array<string>;
  },
) {
  const {getReferenceProps, getFloatingProps} = useImpl(props);
  return (
    <>
      <input {...getReferenceProps()} />
      <div {...getFloatingProps()} />
    </>
  );
}

function Select(
  props: Pick<UseTypeaheadProps, 'onMatch' | 'onTypingChange'> & {
    list?: Array<string>;
  },
) {
  const [isOpen, setIsOpen] = useState(false);
  const {getReferenceProps, getFloatingProps} = useImpl({
    ...props,
    open: isOpen,
    onOpenChange: setIsOpen,
    addUseClick: true,
  });
  return (
    <>
      <div tabIndex={0} {...getReferenceProps()} />
      {isOpen && <div {...getFloatingProps()} />}
    </>
  );
}

test('rapidly focuses list items when they start with the same letter', async () => {
  const spy = vi.fn();
  render(<Combobox onMatch={spy} />);

  await userEvent.click(screen.getByRole('combobox'));

  await userEvent.keyboard('t');
  expect(spy).toHaveBeenCalledWith(1);

  await userEvent.keyboard('t');
  expect(spy).toHaveBeenCalledWith(2);

  await userEvent.keyboard('t');
  expect(spy).toHaveBeenCalledWith(1);

  cleanup();
});

test('bails out of rapid focus of first letter if the list contains a string that starts with two of the same letter', async () => {
  const spy = vi.fn();
  render(<Combobox onMatch={spy} list={['apple', 'aaron', 'apricot']} />);

  await userEvent.click(screen.getByRole('combobox'));

  await userEvent.keyboard('a');
  expect(spy).toHaveBeenCalledWith(0);

  await userEvent.keyboard('a');
  expect(spy).toHaveBeenCalledWith(0);

  cleanup();
});

test('starts from the current activeIndex and correctly loops', async () => {
  const spy = vi.fn();
  render(
    <Combobox
      onMatch={spy}
      list={['Toy Story 2', 'Toy Story 3', 'Toy Story 4']}
    />,
  );

  await userEvent.click(screen.getByRole('combobox'));

  await userEvent.keyboard('t');
  await userEvent.keyboard('o');
  await userEvent.keyboard('y');
  expect(spy).toHaveBeenCalledWith(0);

  spy.mockReset();

  await userEvent.keyboard('t');
  await userEvent.keyboard('o');
  await userEvent.keyboard('y');
  expect(spy).not.toHaveBeenCalled();

  vi.advanceTimersByTime(750);

  await userEvent.keyboard('t');
  await userEvent.keyboard('o');
  await userEvent.keyboard('y');
  expect(spy).toHaveBeenCalledWith(1);

  vi.advanceTimersByTime(750);

  await userEvent.keyboard('t');
  await userEvent.keyboard('o');
  await userEvent.keyboard('y');
  expect(spy).toHaveBeenCalledWith(2);

  vi.advanceTimersByTime(750);

  await userEvent.keyboard('t');
  await userEvent.keyboard('o');
  await userEvent.keyboard('y');
  expect(spy).toHaveBeenCalledWith(0);

  cleanup();
});

test('capslock characters continue to match', async () => {
  const spy = vi.fn();
  render(<Combobox onMatch={spy} />);

  userEvent.click(screen.getByRole('combobox'));

  await userEvent.keyboard('{CapsLock}t');
  expect(spy).toHaveBeenCalledWith(1);

  cleanup();
});

function App1(
  props: Pick<UseTypeaheadProps, 'onMatch'> & {list: Array<string>},
) {
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

test('matches when focus is within reference', async () => {
  const spy = vi.fn();
  render(<App1 onMatch={spy} list={['one', 'two', 'three']} />);

  await userEvent.click(screen.getByRole('combobox'));

  await userEvent.keyboard('t');
  expect(spy).toHaveBeenCalledWith(1);

  cleanup();
});

test('matches when focus is within floating', async () => {
  const spy = vi.fn();
  render(<App1 onMatch={spy} list={['one', 'two', 'three']} />);

  await userEvent.click(screen.getByRole('combobox'));

  await userEvent.keyboard('t');
  const option = await screen.findByRole('option', {selected: true});
  expect(option.textContent).toBe('two');
  option.focus();
  expect(option).toHaveFocus();

  await userEvent.keyboard('h');
  expect(
    (await screen.findByRole('option', {selected: true})).textContent,
  ).toBe('three');

  cleanup();
});

test('onTypingChange is called when typing starts or stops', async () => {
  const spy = vi.fn();
  render(<Combobox onTypingChange={spy} list={['one', 'two', 'three']} />);

  act(() => screen.getByRole('combobox').focus());

  await userEvent.keyboard('t');
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith(true);

  vi.advanceTimersByTime(750);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenCalledWith(false);

  cleanup();
});

test('Menu - skips disabled items and opens submenu on space if no match', async () => {
  vi.useRealTimers();

  render(<Main />);

  await userEvent.click(screen.getByText('Edit'));
  await act(async () => {});

  expect(screen.getByRole('menu')).toBeInTheDocument();

  await userEvent.keyboard('c');

  expect(screen.getByText('Copy as')).toHaveFocus();

  await userEvent.keyboard('opy as ');

  expect(screen.getByText('Copy as').getAttribute('aria-expanded')).toBe(
    'false',
  );

  await userEvent.keyboard(' ');

  expect(screen.getByText('Copy as').getAttribute('aria-expanded')).toBe(
    'true',
  );
});

test('Menu - resets once a match is no longer found', async () => {
  vi.useRealTimers();

  render(<Main />);

  await userEvent.click(screen.getByText('Edit'));
  await act(async () => {});

  expect(screen.getByRole('menu')).toBeInTheDocument();

  await userEvent.keyboard('undr');

  expect(screen.getByText('Undo')).toHaveFocus();

  await userEvent.keyboard('r');

  expect(screen.getByText('Redo')).toHaveFocus();
});

test('typing spaces on <div> references does not open the menu', async () => {
  const spy = vi.fn();
  render(<Select onMatch={spy} />);

  vi.useFakeTimers({shouldAdvanceTime: true});

  await userEvent.click(screen.getByRole('combobox'));

  await userEvent.keyboard('h');
  await userEvent.keyboard(' ');

  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

  vi.advanceTimersByTime(750);

  await userEvent.keyboard(' ');
  await act(async () => {});

  expect(screen.queryByRole('listbox')).toBeInTheDocument();
});
