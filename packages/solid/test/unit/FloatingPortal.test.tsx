import '@testing-library/jest-dom';

import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import {createSignal, Show} from 'solid-js';

import {FloatingPortal, useFloating} from '../../src';
import {promiseRequestAnimationFrame} from '../helper';

function App(props: {root?: HTMLElement | null; id?: string}) {
  const [open, setOpen] = createSignal(false);
  const {refs} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  return (
    <>
      <button
        data-testid="reference"
        ref={refs.setReference}
        onClick={() => setOpen((prev) => !prev)}
      />
      <FloatingPortal {...props}>
        <Show when={open()}>
          <div ref={refs.setFloating} data-testid="floating" />
        </Show>
      </FloatingPortal>
    </>
  );
}

test('creates a custom id node', () => {
  render(() => <App id="custom-id" />);
  expect(document.querySelector('#custom-id')).toBeInTheDocument();
  cleanup();
});

test('uses a custom id node as the root', async () => {
  const customRoot = document.createElement('div');
  customRoot.id = 'custom-root';
  document.body.appendChild(customRoot);
  render(() => <App id="custom-root" />);
  fireEvent.click(screen.getByTestId('reference'));
  await promiseRequestAnimationFrame();
  //we need one more parent as SolidJS's Portal renders a div
  expect(
    screen.getByTestId('floating').parentElement?.parentElement?.parentElement,
  ).toBe(customRoot);
  customRoot.remove();
});

test('creates a custom id node as the root', async () => {
  render(() => <App id="custom-id" />);
  fireEvent.click(screen.getByTestId('reference'));
  await Promise.resolve();
  expect(
    screen.getByTestId('floating').parentElement?.parentElement?.parentElement
      ?.id,
  ).toBe('custom-id');
});

test('allows custom roots', async () => {
  const customRoot = document.createElement('div');
  customRoot.id = 'custom-root';
  document.body.appendChild(customRoot);
  render(() => <App root={customRoot} />);
  fireEvent.click(screen.getByTestId('reference'));

  await Promise.resolve();

  const parent = screen.getByTestId('floating').parentElement?.parentElement;
  expect(parent?.hasAttribute('data-floating-ui-portal')).toBe(true);
  expect(parent?.parentElement).toBe(customRoot);
  customRoot.remove();
});

test('allows refs as roots', async () => {
  const el = document.createElement('div');
  document.body.appendChild(el);

  render(() => <App root={el} />);
  fireEvent.click(screen.getByTestId('reference'));
  await Promise.resolve();
  const parent = screen.getByTestId('floating').parentElement?.parentElement;
  expect(parent?.hasAttribute('data-floating-ui-portal')).toBe(true);
  expect(parent?.parentElement).toBe(el);
  document.body.removeChild(el);
});
