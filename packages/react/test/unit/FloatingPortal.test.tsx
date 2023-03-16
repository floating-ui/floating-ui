import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {FloatingPortal, FloatingPortalRoot, useFloating} from '../../src';

function App(props: {root?: HTMLElement | null | string; id?: string}) {
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

test('use document.body as default portal container', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('reference'));
  expect(screen.getByTestId('floating').parentElement?.parentElement).toBe(
    document.body
  );
  cleanup();
});

test('allow to override portal container', () => {
  const id = 'portalContainer';
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', id);
  document.body.appendChild(portalRoot);

  render(
    <FloatingPortalRoot root={document.getElementById(id)}>
      <App />
    </FloatingPortalRoot>
  );
  fireEvent.click(screen.getByTestId('reference'));
  expect(screen.getByTestId('floating').parentElement?.parentElement).toBe(
    portalRoot
  );
  cleanup();
});

test('allow to override portal container with string', () => {
  render(
    <FloatingPortalRoot root={'portalContainer'}>
      <App />
    </FloatingPortalRoot>
  );
  fireEvent.click(screen.getByTestId('reference'));
  expect(
    screen
      .getByTestId('floating')
      .parentElement?.parentElement?.getAttribute('id')
  ).toBe('portalContainer');
  cleanup();
});

test('allow to override portal container with FloatingPortal', () => {
  render(
    <FloatingPortalRoot root={'rootContainer1'}>
      <App root={'portalContainer2'} />
    </FloatingPortalRoot>
  );
  fireEvent.click(screen.getByTestId('reference'));
  expect(
    screen
      .getByTestId('floating')
      .parentElement?.parentElement?.getAttribute('id')
  ).toBe('portalContainer2');
  cleanup();
});
