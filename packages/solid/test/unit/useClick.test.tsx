// import '@testing-library/jest-dom';

import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import {createEffect, createSignal, mergeProps, Show} from 'solid-js';
import {Dynamic} from 'solid-js/web';
import {vi} from 'vitest';

import {useClick, useFloating, useHover, useInteractions} from '../../src';
import type {UseClickProps} from '../../src/hooks/useClick';
import {promiseRequestAnimationFrame} from '../helper';

function App(
  p: UseClickProps & {
    button?: boolean;
    typeable?: boolean;
    initialOpen?: boolean;
  },
) {
  const props = mergeProps(
    {
      button: true,
      typeable: false,
      initialOpen: false,
    },
    p,
  );
  const [open, setOpen] = createSignal(!!props.initialOpen);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context, props),
  ]);

  const tag = props.typeable ? 'input' : props.button ? 'button' : 'div';

  return (
    <>
      <Dynamic
        component={tag}
        ref={refs.setReference}
        {...getReferenceProps()}
        data-testid="reference"
      />
      <Show when={open()}>
        <div role="tooltip" {...getFloatingProps()} ref={refs.setFloating} />
      </Show>
    </>
  );
}

describe('default', () => {
  test('changes `open` state to `true` after click', async () => {
    render(() => <App />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('changes `open` state to `false` after two clicks', () => {
    render(() => <App />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

describe('mousedown `event` prop', () => {
  test('changes `open` state to `true` after click', () => {
    render(() => <App event="mousedown" />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('changes `open` state to `false` after two clicks', () => {
    render(() => <App event="mousedown" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

describe('`toggle` prop', () => {
  test('changes `open` state to `true` after click', () => {
    render(() => <App toggle={false} />);
    const button = screen.getByRole('button');

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state remains `true` after two clicks', () => {
    render(() => <App toggle={false} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state remains `true` after two clicks with `mousedown`', () => {
    render(() => <App toggle={false} event="mousedown" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();

    cleanup();
  });

  test('`open` state becomes `false` after clicking when initially open', () => {
    render(() => <App initialOpen={true} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    cleanup();
  });
});

describe('non-buttons', () => {
  test('adds Enter keydown', () => {
    render(() => <App button={false} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: 'Enter'});

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('adds Space keyup', () => {
    render(() => <App button={false} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: ' '});
    fireEvent.keyUp(button, {key: ' '});

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('typeable reference does not receive space key handler', async () => {
    render(() => <App typeable={true} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: ' '});
    fireEvent.keyUp(button, {key: ' '});

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('typeable reference does receive Enter key handler', async () => {
    render(() => <App typeable={true} />);

    const button = screen.getByTestId('reference');
    fireEvent.keyDown(button, {key: 'Enter'});

    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });
});

test('ignores Space keydown on another element then keyup on the button', async () => {
  render(() => <App />);
  await promiseRequestAnimationFrame();

  const button = screen.getByRole('button');
  fireEvent.keyDown(document.body, {key: ' '});
  fireEvent.keyUp(button, {key: ' '});

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('with useHover does not close on mouseleave after click', async () => {
  function App() {
    const [open, setOpen] = createSignal(false);
    const {refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
    });
    const {getReferenceProps, getFloatingProps} = useInteractions([
      useHover(context),
      useClick(context),
    ]);
    // createEffect(() => console.log(context().dataRef.openEvent));
    return (
      <>
        <button
          {...getReferenceProps({ref: refs.setReference})}
          ref={refs.setReference}
          data-testid="reference"
        />
        <Show when={open()}>
          <div role="tooltip" ref={refs.setFloating} {...getFloatingProps()} />
        </Show>
      </>
    );
  }

  render(() => <App />);

  const button = screen.getByTestId('reference');
  fireEvent.mouseEnter(button);
  fireEvent.click(button);
  fireEvent.mouseLeave(button);
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  cleanup();
});
