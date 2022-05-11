import {useState} from 'react';
import {fireEvent, render, screen, cleanup} from '@testing-library/react';
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

test('creates a id="floating-ui-root" node', () => {
  render(<App />);
  expect(document.querySelector('#floating-ui-root')).toBeInTheDocument();
  cleanup();
});

test('creates a id="floating-ui-root" node', () => {
  render(<App id="custom-id" />);
  expect(document.querySelector('#custom-id')).toBeInTheDocument();
  cleanup();
});

test('allows direct roots', () => {
  render(<App root={document.body} />);
  fireEvent.click(screen.getByTestId('reference'));
  expect(screen.getByTestId('floating').parentNode).toBe(document.body);
  cleanup();
});
