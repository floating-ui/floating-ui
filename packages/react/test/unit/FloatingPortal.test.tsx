import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {FloatingPortal, useFloating} from '../../src';

function App(props: {root?: HTMLElement | null; id?: string}) {
  const [open, setOpen] = useState(false);
  const {reference, floating} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  return (
    <>
      <button
        data-testid="reference"
        ref={reference}
        onClick={() => setOpen(!open)}
      />
      <FloatingPortal {...props}>
        {open && <div ref={floating} data-testid="floating" />}
      </FloatingPortal>
    </>
  );
}

test('creates a custom id node', () => {
  render(<App id="custom-id" />);
  expect(document.querySelector('#custom-id')).toBeInTheDocument();
  cleanup();
});

test('allows custom roots', async () => {
  const customRoot = document.createElement('div');
  customRoot.id = 'custom-root';
  document.body.appendChild(customRoot);
  render(<App root={customRoot} />);
  fireEvent.click(screen.getByTestId('reference'));

  await act(async () => {});

  const parent = screen.getByTestId('floating').parentElement;
  expect(parent?.hasAttribute('data-floating-ui-portal')).toBe(true);
  expect(parent?.parentElement).toBe(customRoot);
  customRoot.remove();
});

test('empty id string does not add id attribute', () => {
  render(<App id="" />);
  fireEvent.click(screen.getByTestId('reference'));
  expect(screen.getByTestId('floating').parentElement?.hasAttribute('id')).toBe(
    false
  );
  cleanup();
});
