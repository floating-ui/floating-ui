import {useState} from 'react';
import {render, screen, cleanup, fireEvent} from '@testing-library/react';
import {useInteractions, useFloating, useRole} from '../../src';
import type {Props} from '../../src/hooks/useRole';

function App(props: Props & {initiallyOpen?: boolean}) {
  const [open, setOpen] = useState(props.initiallyOpen ?? false);
  const {reference, floating, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useRole(context, props),
  ]);

  return (
    <>
      <button
        {...getReferenceProps({
          ref: reference,
          onClick() {
            setOpen(!open);
          },
        })}
      />
      {open && (
        <div
          {...getFloatingProps({
            ref: floating,
          })}
        />
      )}
    </>
  );
}

describe('tooltip', () => {
  test('has correct role', () => {
    render(<App role="tooltip" initiallyOpen />);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('adds `aria-describedby` upon open and removes it on close', () => {
    render(<App role="tooltip" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button.hasAttribute('aria-describedby')).toBe(true);
    fireEvent.click(button);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    cleanup();
  });
});

describe('dialog', () => {
  test('works', () => {
    render(<App role="tooltip" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button.hasAttribute('aria-describedby')).toBe(true);
    fireEvent.click(button);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    cleanup();
  });
});
