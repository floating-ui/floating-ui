import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';
import * as React from 'react';

import {FloatingPortal, useFloating} from '../../src';

function App(props: {
  root?: HTMLElement | null | React.MutableRefObject<HTMLElement | null>;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const {refs} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  return (
    <>
      <button
        data-testid="reference"
        ref={refs.setReference}
        onClick={() => setOpen(!open)}
      />
      <FloatingPortal {...props}>
        {open && <div ref={refs.setFloating} data-testid="floating" />}
      </FloatingPortal>
    </>
  );
}

test('creates a custom id node', () => {
  render(<App id="custom-id" />);
  expect(document.querySelector('#custom-id')).toBeInTheDocument();
  cleanup();
});

test('uses a custom id node as the root', async () => {
  const customRoot = document.createElement('div');
  customRoot.id = 'custom-root';
  document.body.appendChild(customRoot);
  render(<App id="custom-root" />);
  fireEvent.click(screen.getByTestId('reference'));
  await act(async () => {});
  expect(screen.getByTestId('floating').parentElement?.parentElement).toBe(
    customRoot,
  );
  customRoot.remove();
});

test('creates a custom id node as the root', async () => {
  render(<App id="custom-id" />);
  fireEvent.click(screen.getByTestId('reference'));
  await act(async () => {});
  expect(screen.getByTestId('floating').parentElement?.parentElement?.id).toBe(
    'custom-id',
  );
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

test('allows refs as roots', async () => {
  const el = document.createElement('div');
  document.body.appendChild(el);
  const ref = {current: el};
  render(<App root={ref} />);
  fireEvent.click(screen.getByTestId('reference'));
  await act(async () => {});
  const parent = screen.getByTestId('floating').parentElement;
  expect(parent?.hasAttribute('data-floating-ui-portal')).toBe(true);
  expect(parent?.parentElement).toBe(el);
  document.body.removeChild(el);
});

test('allows roots to be initially null', async () => {
  function RootApp() {
    const [root, setRoot] = useState<HTMLElement | null>(null);
    const [renderRoot, setRenderRoot] = useState(false);

    React.useEffect(() => {
      setRenderRoot(true);
    }, []);

    return (
      <>
        {renderRoot && <div ref={setRoot} data-testid="root" />}
        <App root={root} />;
      </>
    );
  }

  render(<RootApp />);

  fireEvent.click(screen.getByTestId('reference'));
  await act(async () => {});

  const subRoot = screen.getByTestId('floating').parentElement;
  const root = screen.getByTestId('root');
  expect(root).toBe(subRoot?.parentElement);
});
