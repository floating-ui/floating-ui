import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {useClick, useFloating, useHover, useInteractions} from '../../src';
import type {UseClickProps} from '../../src/hooks/useClick';

function App({
  button = true,
  typeable = false,
  initialOpen = false,
  ...props
}: UseClickProps & {
  button?: boolean;
  typeable?: boolean;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context, props),
  ]);

  const Tag = typeable ? 'input' : button ? 'button' : 'div';

  return (
    <>
      <Tag
        {...getReferenceProps({ref: refs.setReference})}
        data-testid="reference"
      />
      {open && (
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
      )}
    </>
  );
}

describe('default', () => {
  test('changes `open` state to `true` after click', () => {
    render(<App />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('changes `open` state to `false` after two clicks', () => {
    render(<App />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

describe('mousedown `event` prop', () => {
  test('changes `open` state to `true` after click', () => {
    render(<App event="mousedown" />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('changes `open` state to `false` after two clicks', () => {
    render(<App event="mousedown" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

describe('`toggle` prop', () => {
  test('changes `open` state to `true` after click', () => {
    render(<App toggle={false} />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state remains `true` after two clicks', () => {
    render(<App toggle={false} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state remains `true` after two clicks with `mousedown`', () => {
    render(<App toggle={false} event="mousedown" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state becomes `false` after clicking when initially open', () => {
    render(<App initialOpen={true} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

describe('non-buttons', () => {
  test('adds Enter keydown', () => {
    render(<App button={false} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: 'Enter'});

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('adds Space keyup', () => {
    render(<App button={false} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: ' '});
    fireEvent.keyUp(button, {key: ' '});

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('typeable reference does not receive space key handler', async () => {
    render(<App typeable={true} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: ' '});
    fireEvent.keyUp(button, {key: ' '});

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('typeable reference does receive Enter key handler', async () => {
    render(<App typeable={true} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: 'Enter'});

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });
});

test('ignores Space keydown on another element then keyup on the button', async () => {
  render(<App />);
  await act(async () => {});

  const button = screen.getByRole('button');
  fireEvent.keyDown(document.body, {key: ' '});
  fireEvent.keyUp(button, {key: ' '});

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('with useHover does not close on mouseleave after click', async () => {
  function App() {
    const [open, setOpen] = useState(false);
    const {refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
    });
    const {getReferenceProps, getFloatingProps} = useInteractions([
      useHover(context),
      useClick(context),
    ]);

    return (
      <>
        <button
          {...getReferenceProps({ref: refs.setReference})}
          data-testid="reference"
        />
        {open && (
          <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
        )}
      </>
    );
  }

  render(<App />);

  const button = screen.getByTestId('reference');
  fireEvent.mouseEnter(button);
  fireEvent.click(button);
  fireEvent.mouseLeave(button);

  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  cleanup();
});

test('reason string', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);
    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange(isOpen, _, reason) {
        setIsOpen(isOpen);
        expect(reason).toBe('click');
      },
    });

    const focus = useClick(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([focus]);

    return (
      <>
        <button ref={refs.setReference} {...getReferenceProps()} />
        {isOpen && (
          <div role="tooltip" ref={refs.setFloating} {...getFloatingProps()} />
        )}
      </>
    );
  }

  render(<App />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  await act(async () => {});
  fireEvent.click(button);
});
