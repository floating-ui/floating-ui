import {act, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {Composite, CompositeItem} from '../../src';

function microtask() {
  return act(async () => {});
}

test('controlled mode', async () => {
  function App() {
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <Composite activeIndex={activeIndex} onNavigate={setActiveIndex}>
        <CompositeItem data-testid="1">1</CompositeItem>
        <CompositeItem data-testid="2">2</CompositeItem>
        <CompositeItem data-testid="3">3</CompositeItem>
      </Composite>
    );
  }

  render(<App />);

  screen.getByTestId('1').focus();
  expect(screen.getByTestId('1')).toHaveAttribute('data-active');

  fireEvent.keyDown(screen.getByTestId('1'), {key: 'ArrowDown'});
  await microtask();
  expect(screen.getByTestId('2')).toHaveAttribute('data-active');
  expect(screen.getByTestId('2')).toHaveAttribute('tabindex', '0');
  expect(screen.getByTestId('2')).toHaveFocus();

  fireEvent.keyDown(screen.getByTestId('2'), {key: 'ArrowDown'});
  await microtask();
  expect(screen.getByTestId('3')).toHaveAttribute('data-active');
  expect(screen.getByTestId('3')).toHaveAttribute('tabindex', '0');
  expect(screen.getByTestId('3')).toHaveFocus();

  fireEvent.keyDown(screen.getByTestId('3'), {key: 'ArrowUp'});
  await microtask();
  expect(screen.getByTestId('2')).toHaveAttribute('data-active');
  expect(screen.getByTestId('2')).toHaveAttribute('tabindex', '0');
  expect(screen.getByTestId('2')).toHaveFocus();

  screen.getByTestId('1').focus();
  await microtask();
  expect(screen.getByTestId('1')).toHaveAttribute('data-active');
  expect(screen.getByTestId('1')).toHaveAttribute('tabindex', '0');
});

test('uncontrolled mode', async () => {
  render(
    <Composite>
      <CompositeItem data-testid="1">1</CompositeItem>
      <CompositeItem data-testid="2">2</CompositeItem>
      <CompositeItem data-testid="3">3</CompositeItem>
    </Composite>
  );

  screen.getByTestId('1').focus();
  expect(screen.getByTestId('1')).toHaveAttribute('data-active');

  fireEvent.keyDown(screen.getByTestId('1'), {key: 'ArrowDown'});
  await microtask();
  expect(screen.getByTestId('2')).toHaveAttribute('data-active');
  expect(screen.getByTestId('2')).toHaveAttribute('tabindex', '0');
  expect(screen.getByTestId('2')).toHaveFocus();

  fireEvent.keyDown(screen.getByTestId('2'), {key: 'ArrowDown'});
  await microtask();
  expect(screen.getByTestId('3')).toHaveAttribute('data-active');
  expect(screen.getByTestId('3')).toHaveAttribute('tabindex', '0');
  expect(screen.getByTestId('3')).toHaveFocus();

  fireEvent.keyDown(screen.getByTestId('3'), {key: 'ArrowUp'});
  await microtask();
  expect(screen.getByTestId('2')).toHaveAttribute('data-active');
  expect(screen.getByTestId('2')).toHaveAttribute('tabindex', '0');
  expect(screen.getByTestId('2')).toHaveFocus();

  screen.getByTestId('1').focus();
  await microtask();
  expect(screen.getByTestId('1')).toHaveAttribute('data-active');
  expect(screen.getByTestId('1')).toHaveAttribute('tabindex', '0');
});
