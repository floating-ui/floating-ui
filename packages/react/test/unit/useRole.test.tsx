import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {useFloating, useId, useInteractions, useRole} from '../../src';
import type {UseRoleProps} from '../../src/hooks/useRole';

function App({
  initiallyOpen = false,
  ...props
}: UseRoleProps & {initiallyOpen?: boolean}) {
  const [open, setOpen] = useState(initiallyOpen);
  const {refs, context} = useFloating({
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
          ref: refs.setReference,
          onClick() {
            setOpen(!open);
          },
        })}
      />
      {open && (
        <div
          {...getFloatingProps({
            ref: refs.setFloating,
          })}
        />
      )}
    </>
  );
}

function AppWithExternalRef(props: UseRoleProps & {initiallyOpen?: boolean}) {
  const [open, setOpen] = useState(props.initiallyOpen ?? false);
  const nodeId = useId();
  const {refs, context} = useFloating({
    nodeId,
    open,
    onOpenChange: setOpen,
  });
  // External ref can use it's own set of interactions hooks, but share context
  const {getFloatingProps} = useInteractions([useRole(context, props)]);
  const {getReferenceProps} = useInteractions([useRole(context, props)]);

  return (
    <>
      <button
        {...getReferenceProps({
          ref: refs.setReference,
          onClick() {
            setOpen(!open);
          },
        })}
      />
      {open && (
        <div
          {...getFloatingProps({
            ref: refs.setFloating,
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

  test('sets correct aria attributes based on the open state', () => {
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
  test('sets correct aria attributes based on the open state', () => {
    render(<App role="dialog" />);

    const button = screen.getByRole('button');

    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    expect(button.getAttribute('aria-controls')).toBe(
      screen.getByRole('dialog').getAttribute('id')
    );
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    cleanup();
  });

  test('sets correct aria attributes with external ref, multiple useRole calls', () => {
    render(<AppWithExternalRef role="dialog" />);

    const button = screen.getByRole('button');

    expect(button.getAttribute('aria-haspopup')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    expect(button.getAttribute('aria-controls')).toBe(
      screen.getByRole('dialog').getAttribute('id')
    );
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    cleanup();
  });
});

describe('menu', () => {
  test('sets correct aria attributes based on the open state', () => {
    render(<App role="menu" />);

    const button = screen.getByRole('button');

    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);

    expect(screen.queryByRole('menu')).toBeInTheDocument();
    expect(button.getAttribute('id')).toBe(
      screen.getByRole('menu').getAttribute('aria-labelledby')
    );
    expect(button.getAttribute('aria-controls')).toBe(
      screen.getByRole('menu').getAttribute('id')
    );
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    cleanup();
  });
});

describe('listbox', () => {
  test('sets correct aria attributes based on the open state', () => {
    render(<App role="listbox" />);

    const button = screen.getByRole('combobox');

    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);

    expect(screen.queryByRole('listbox')).toBeInTheDocument();
    expect(button.getAttribute('aria-controls')).toBe(
      screen.getByRole('listbox').getAttribute('id')
    );
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(button);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    cleanup();
  });
});
