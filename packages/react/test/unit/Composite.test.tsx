import {act, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {Composite, CompositeItem} from '../../src';

function microtask() {
  return act(async () => {});
}

describe('list', () => {
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

    act(() => screen.getByTestId('1').focus());
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

    act(() => screen.getByTestId('1').focus());
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
      </Composite>,
    );

    act(() => screen.getByTestId('1').focus());
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

    act(() => screen.getByTestId('1').focus());
    await microtask();
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');
    expect(screen.getByTestId('1')).toHaveAttribute('tabindex', '0');
  });
});

describe('grid', () => {
  test('uniform 1x1 items', async () => {
    function App() {
      return (
        // 1 to 9 numpad
        <Composite cols={3}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((i) => (
            <CompositeItem key={i} data-testid={i}>
              {i}
            </CompositeItem>
          ))}
        </Composite>
      );
    }

    render(<App />);

    act(() => screen.getByTestId('1').focus());
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');

    fireEvent.keyDown(screen.getByTestId('1'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('4')).toHaveAttribute('data-active');
    expect(screen.getByTestId('4')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('4')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('4'), {key: 'ArrowRight'});
    await microtask();
    expect(screen.getByTestId('5')).toHaveAttribute('data-active');
    expect(screen.getByTestId('5')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('5')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('5'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('8')).toHaveAttribute('data-active');
    expect(screen.getByTestId('8')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('8')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('8'), {key: 'ArrowLeft'});
    await microtask();
    expect(screen.getByTestId('7')).toHaveAttribute('data-active');
    expect(screen.getByTestId('7')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('7')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('7'), {key: 'ArrowUp'});
    await microtask();
    expect(screen.getByTestId('4')).toHaveAttribute('data-active');
    expect(screen.getByTestId('4')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('4')).toHaveFocus();

    act(() => screen.getByTestId('9').focus());
    await microtask();
    expect(screen.getByTestId('9')).toHaveAttribute('data-active');
    expect(screen.getByTestId('9')).toHaveAttribute('tabindex', '0');
  });

  test('wider item', async () => {
    function App() {
      return (
        // 1 to 9 numpad, but 4, 5 and 6 are one big button
        <Composite
          cols={3}
          itemSizes={[
            {width: 1, height: 1},
            {width: 1, height: 1},
            {width: 1, height: 1},
            {width: 3, height: 1},
            {width: 1, height: 1},
            {width: 1, height: 1},
            {width: 1, height: 1},
          ]}
        >
          {['1', '2', '3', '456', '7', '8', '9'].map((i) => (
            <CompositeItem key={i} data-testid={i}>
              {i}
            </CompositeItem>
          ))}
        </Composite>
      );
    }

    render(<App />);

    act(() => screen.getByTestId('1').focus());
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');

    fireEvent.keyDown(screen.getByTestId('1'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('456')).toHaveAttribute('data-active');
    expect(screen.getByTestId('456')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('456')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('456'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('7')).toHaveAttribute('data-active');
    expect(screen.getByTestId('7')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('7')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('7'), {key: 'ArrowRight'});
    await microtask();
    expect(screen.getByTestId('8')).toHaveAttribute('data-active');
    expect(screen.getByTestId('8')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('8')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('8'), {key: 'ArrowUp'});
    await microtask();
    expect(screen.getByTestId('456')).toHaveAttribute('data-active');
    expect(screen.getByTestId('456')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('456')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('456'), {key: 'ArrowUp'});
    await microtask();
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');
    expect(screen.getByTestId('1')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('1')).toHaveFocus();

    act(() => screen.getByTestId('9').focus());
    await microtask();
    expect(screen.getByTestId('9')).toHaveAttribute('data-active');
    expect(screen.getByTestId('9')).toHaveAttribute('tabindex', '0');
  });

  test('wider and taller item', async () => {
    function App() {
      return (
        // 1 to 9 numpad, but 4, 5, 7 and 8 are one big button
        <Composite
          cols={3}
          itemSizes={[
            {width: 1, height: 1},
            {width: 1, height: 1},
            {width: 1, height: 1},
            {width: 2, height: 2},
            {width: 1, height: 1},
            {width: 1, height: 1},
          ]}
        >
          {['1', '2', '3', '4578', '6', '9'].map((i) => (
            <CompositeItem key={i} data-testid={i}>
              {i}
            </CompositeItem>
          ))}
        </Composite>
      );
    }

    render(<App />);

    act(() => screen.getByTestId('1').focus());
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');

    fireEvent.keyDown(screen.getByTestId('1'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('4578')).toHaveAttribute('data-active');
    expect(screen.getByTestId('4578')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('4578')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('4578'), {key: 'ArrowRight'});
    await microtask();
    expect(screen.getByTestId('6')).toHaveAttribute('data-active');
    expect(screen.getByTestId('6')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('6')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('6'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('9')).toHaveAttribute('data-active');
    expect(screen.getByTestId('9')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('9')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('9'), {key: 'ArrowLeft'});
    await microtask();
    expect(screen.getByTestId('4578')).toHaveAttribute('data-active');
    expect(screen.getByTestId('4578')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('4578')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('4578'), {key: 'ArrowUp'});
    await microtask();
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');
    expect(screen.getByTestId('1')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('1')).toHaveFocus();

    act(() => screen.getByTestId('9').focus());
    await microtask();
    expect(screen.getByTestId('9')).toHaveAttribute('data-active');
    expect(screen.getByTestId('9')).toHaveAttribute('tabindex', '0');
  });

  test('grid flow', async () => {
    function App() {
      return (
        // 1 to 9 numpad, but 2, 3, 5 and 6 are one big button, and so are 7 and 8.
        // 4 is missing
        <Composite
          cols={3}
          itemSizes={[
            {width: 1, height: 1},
            {width: 2, height: 2},
            {width: 2, height: 1},
            {width: 1, height: 1},
          ]}
        >
          {['1', '2356', '78', '9'].map((i) => (
            <CompositeItem key={i} data-testid={i}>
              {i}
            </CompositeItem>
          ))}
        </Composite>
      );
    }

    render(<App />);

    act(() => screen.getByTestId('1').focus());
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');

    fireEvent.keyDown(screen.getByTestId('1'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('78')).toHaveAttribute('data-active');
    expect(screen.getByTestId('78')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('78')).toHaveFocus();
  });

  test('grid flow: dense', async () => {
    function App() {
      return (
        // 1 to 9 numpad, but 2, 3, 5 and 6 are one big button, and so are 7 and 8.
        // 9 is missing
        <Composite
          cols={3}
          itemSizes={[
            {width: 1, height: 1},
            {width: 2, height: 2},
            {width: 2, height: 1},
            {width: 1, height: 1},
          ]}
          dense
        >
          {['1', '2356', '78', '4'].map((i) => (
            <CompositeItem key={i} data-testid={i}>
              {i}
            </CompositeItem>
          ))}
        </Composite>
      );
    }

    render(<App />);

    act(() => screen.getByTestId('1').focus());
    expect(screen.getByTestId('1')).toHaveAttribute('data-active');

    fireEvent.keyDown(screen.getByTestId('1'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('4')).toHaveAttribute('data-active');
    expect(screen.getByTestId('4')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('4')).toHaveFocus();

    fireEvent.keyDown(screen.getByTestId('4'), {key: 'ArrowDown'});
    await microtask();
    expect(screen.getByTestId('78')).toHaveAttribute('data-active');
    expect(screen.getByTestId('78')).toHaveAttribute('tabindex', '0');
    expect(screen.getByTestId('78')).toHaveFocus();
  });
});
