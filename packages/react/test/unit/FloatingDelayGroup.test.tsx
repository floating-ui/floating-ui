import {cloneElement, useState} from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {
  useFloating,
  useInteractions,
  useHover,
  useDelayGroupContext,
  useDelayGroup,
  FloatingDelayGroup,
} from '../../src';
import {act} from '@testing-library/react-hooks';

jest.useFakeTimers();

interface Props {
  label: string;
  children: JSX.Element;
}

export const Tooltip = ({children, label}: Props) => {
  const {delay, setCurrentId} = useDelayGroupContext();
  const [open, setOpen] = useState(false);

  const {x, y, reference, floating, strategy, context} = useFloating({
    open,
    onOpenChange(open) {
      setOpen(open);
      open && setCurrentId(label);
    },
  });

  const {getReferenceProps} = useInteractions([
    useHover(context, {delay}),
    useDelayGroup(context, {id: label}),
  ]);

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({
          ref: reference,
          ...children.props,
        })
      )}
      {open && (
        <div
          data-testid={`floating-${label}`}
          ref={floating}
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
    <FloatingDelayGroup delay={{open: 1000, close: 200}}>
      <Tooltip label="one">
        <button data-testid="reference-one" />
      </Tooltip>
      <Tooltip label="two">
        <button data-testid="reference-two" />
      </Tooltip>
      <Tooltip label="three">
        <button data-testid="reference-three" />
      </Tooltip>
    </FloatingDelayGroup>
  );
}

test('groups delays correctly', async () => {
  render(<App />);

  fireEvent.mouseEnter(screen.getByTestId('reference-one'));

  await act(async () => {
    jest.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(999);
  });

  expect(screen.queryByTestId('floating-one')).toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('reference-two'));

  await act(async () => {
    jest.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-one')).not.toBeInTheDocument();
  expect(screen.queryByTestId('floating-two')).toBeInTheDocument();

  fireEvent.mouseEnter(screen.getByTestId('reference-three'));

  await act(async () => {
    jest.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-two')).not.toBeInTheDocument();
  expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

  fireEvent.mouseLeave(screen.getByTestId('reference-three'));

  await act(async () => {
    jest.advanceTimersByTime(1);
  });

  expect(screen.queryByTestId('floating-three')).toBeInTheDocument();

  await act(async () => {
    jest.advanceTimersByTime(199);
  });

  expect(screen.queryByTestId('floating-three')).not.toBeInTheDocument();
});
