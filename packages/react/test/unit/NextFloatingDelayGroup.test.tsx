import * as React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react';
import {cloneElement, useState} from 'react';
import {vi} from 'vitest';

import {
  NextFloatingDelayGroup,
  useNextDelayGroup,
  useFloating,
  useHover,
  useInteractions,
} from '../../src';

vi.useFakeTimers();

interface Props {
  label: string;
  children: React.JSX.Element;
}

export const Tooltip = ({children, label}: Props) => {
  const [open, setOpen] = useState(false);

  const {x, y, refs, strategy, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const {delayRef} = useNextDelayGroup(context);
  const hover = useHover(context, {delay: () => delayRef.current});
  const {getReferenceProps} = useInteractions([hover]);

  const renderCount = React.useRef(0);
  const renderCountRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    renderCount.current++;
    if (renderCountRef.current) {
      renderCountRef.current.textContent = String(renderCount.current);
    }
  });

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({
          ref: refs.setReference,
          ...children.props,
        }),
      )}
      <span data-testid={`render-count-${label}`} ref={renderCountRef} />
      {open && (
        <div
          data-testid={`floating-${label}`}
          ref={refs.setFloating}
          style={{
            position: strategy,
            top: y ?? '',
            left: x ?? '',
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <NextFloatingDelayGroup delay={{open: 1000, close: 200}}>
      <Tooltip label="one">
        <button data-testid="reference-one" />
      </Tooltip>
      <Tooltip label="two">
        <button data-testid="reference-two" />
      </Tooltip>
      <Tooltip label="three">
        <button data-testid="reference-three" />
      </Tooltip>
    </NextFloatingDelayGroup>
  );
}

test('groups delays correctly', async () => {
  render(<App />);

  fireEvent.mouseEnter(screen.getByTestId('reference-one'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();

  await act(async () => {
    vi.advanceTimersByTime(999);
  });

  expect(screen.queryByTestId('floating-one')).toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('reference-two'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();
  expect(screen.queryByTestId('floating-two')).toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('reference-three'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-two')).not.toBeInTheDocument();
  expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

  fireEvent.mouseLeave(screen.getByTestId('reference-three'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

  await act(async () => {
    vi.advanceTimersByTime(199);
  });

  expect(screen.queryByTestId('floating-three')).not.toBeInTheDocument();
});

test('timeoutMs', async () => {
  function App() {
    return (
      <NextFloatingDelayGroup delay={{open: 1000, close: 100}} timeoutMs={500}>
        <Tooltip label="one">
          <button data-testid="reference-one" />
        </Tooltip>
        <Tooltip label="two">
          <button data-testid="reference-two" />
        </Tooltip>
        <Tooltip label="three">
          <button data-testid="reference-three" />
        </Tooltip>
      </NextFloatingDelayGroup>
    );
  }

  render(<App />);

  fireEvent.mouseEnter(screen.getByTestId('reference-one'));

  await act(async () => {
    vi.advanceTimersByTime(1000);
  });

  fireEvent.mouseLeave(screen.getByTestId('reference-one'));

  expect(screen.queryByTestId('floating-one')).toBeInTheDocument();

  await act(async () => {
    vi.advanceTimersByTime(499);
  });

  expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('reference-two'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-two')).toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('reference-three'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-two')).not.toBeInTheDocument();
  expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

  fireEvent.mouseLeave(screen.getByTestId('reference-three'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

  await act(async () => {
    vi.advanceTimersByTime(99);
  });

  expect(screen.queryByTestId('floating-three')).not.toBeInTheDocument();
});

it('does not re-render unrelated consumers', async () => {
  function App() {
    return (
      <NextFloatingDelayGroup delay={{open: 1000, close: 100}} timeoutMs={500}>
        <Tooltip label="one">
          <button data-testid="reference-one" />
        </Tooltip>
        <Tooltip label="two">
          <button data-testid="reference-two" />
        </Tooltip>
        <Tooltip label="three">
          <button data-testid="reference-three" />
        </Tooltip>
      </NextFloatingDelayGroup>
    );
  }

  render(<App />);

  fireEvent.mouseEnter(screen.getByTestId('reference-one'));

  await act(async () => {
    vi.advanceTimersByTime(1000);
  });

  fireEvent.mouseLeave(screen.getByTestId('reference-one'));

  expect(screen.queryByTestId('floating-one')).toBeInTheDocument();

  await act(async () => {
    vi.advanceTimersByTime(499);
  });

  expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('reference-two'));

  await act(async () => {
    vi.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-two')).toBeInTheDocument();
  expect(screen.queryByTestId('render-count-one')).toHaveTextContent('8');
  expect(screen.queryByTestId('render-count-two')).toHaveTextContent('5');
  expect(screen.queryByTestId('render-count-three')).toHaveTextContent('2');
});
