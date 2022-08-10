import {render, screen, cleanup} from '@testing-library/react';
import {useRef, useState} from 'react';
import userEvent from '@testing-library/user-event';
import {useTypeahead, useFloating, useInteractions} from '../../src';
import type {Props} from '../../src/hooks/useTypeahead';

jest.useFakeTimers();
const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

function App(props: Pick<Props, 'onMatch'> & {list?: Array<string>}) {
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
    }),
  ]);

  return (
    <>
      <input role="combobox" {...getReferenceProps({ref: reference})} />
      <div role="listbox" {...getFloatingProps({ref: floating})} />
    </>
  );
}

test('rapidly focuses list items when they start with the same letter', async () => {
  const spy = jest.fn();
  render(<App onMatch={spy} />);

  const input = screen.getByRole('combobox');
  input.focus();

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

  const input = screen.getByRole('combobox');
  input.focus();

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

  const input = screen.getByRole('combobox');
  input.focus();

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(0);

  spy.mockReset();

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(1);

  jest.advanceTimersByTime(1000);

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(2);

  jest.advanceTimersByTime(1000);

  await user.keyboard('t');
  await user.keyboard('o');
  await user.keyboard('y');
  expect(spy).toHaveBeenCalledWith(0);

  cleanup();
});

test('capslock characters continue to match', async () => {
  const spy = jest.fn();
  render(<App onMatch={spy} />);

  const input = screen.getByRole('combobox');
  input.focus();

  await user.keyboard('{CapsLock}t');
  expect(spy).toHaveBeenCalledWith(1);

  cleanup();
});
