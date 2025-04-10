import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {useState} from 'react';

import {
  useClick,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from '../../src';
import type {UseRoleProps} from '../../src/hooks/useRole';

function App({
  initiallyOpen = false,
  ...props
}: UseRoleProps & {
  initiallyOpen?: boolean;
  referenceId?: string;
  floatingId?: string;
}) {
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
        ref={refs.setReference}
        {...getReferenceProps({
          ...(props.referenceId && {id: props.referenceId}),
          onClick() {
            setOpen(!open);
          },
        })}
      />
      {open && (
        <div
          ref={refs.setFloating}
          {...getFloatingProps({
            ...(props.floatingId && {id: props.floatingId}),
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

describe('label', () => {
  test('sets correct aria attributes based on the open state', () => {
    const {container} = render(<App role="label" initiallyOpen />);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-labelledby]')).toBeInTheDocument();
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
      screen.getByRole('dialog').getAttribute('id'),
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
      screen.getByRole('dialog').getAttribute('id'),
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
      screen.getByRole('menu').getAttribute('aria-labelledby'),
    );
    expect(button.getAttribute('aria-controls')).toBe(
      screen.getByRole('menu').getAttribute('id'),
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
      screen.getByRole('listbox').getAttribute('id'),
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

describe('select', () => {
  test('sets correct aria attributes based on the open state', () => {
    function Select() {
      const [isOpen, setIsOpen] = useState(false);
      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });
      const {getReferenceProps, getFloatingProps, getItemProps} =
        useInteractions([
          useClick(context),
          useRole(context, {role: 'select'}),
        ]);
      return (
        <>
          <button ref={refs.setReference} {...getReferenceProps()} />
          {isOpen && (
            <div ref={refs.setFloating} {...getFloatingProps()}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  data-testid={`item-${i}`}
                  {...getItemProps({active: i === 2, selected: i === 2})}
                />
              ))}
            </div>
          )}
        </>
      );
    }

    render(<Select />);

    const button = screen.getByRole('combobox');

    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);

    expect(screen.queryByRole('listbox')).toBeInTheDocument();
    expect(button.getAttribute('aria-controls')).toBe(
      screen.getByRole('listbox').getAttribute('id'),
    );
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-autocomplete')).toBe('none');
    expect(screen.getByTestId('item-1').getAttribute('aria-selected')).toBe(
      'false',
    );
    expect(screen.getByTestId('item-2').getAttribute('aria-selected')).toBe(
      'true',
    );

    fireEvent.click(button);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    cleanup();
  });
});

describe('combobox', () => {
  test('sets correct aria attributes based on the open state', () => {
    function Select() {
      const [isOpen, setIsOpen] = useState(false);
      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });
      const {getReferenceProps, getFloatingProps, getItemProps} =
        useInteractions([
          useClick(context),
          useRole(context, {role: 'combobox'}),
        ]);
      return (
        <>
          <input ref={refs.setReference} {...getReferenceProps()} />
          {isOpen && (
            <div ref={refs.setFloating} {...getFloatingProps()}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  data-testid={`item-${i}`}
                  {...getItemProps({active: i === 2, selected: i === 2})}
                />
              ))}
            </div>
          )}
        </>
      );
    }

    render(<Select />);

    const button = screen.getByRole('combobox');

    expect(button.getAttribute('aria-haspopup')).toBe('listbox');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(button);

    expect(screen.queryByRole('listbox')).toBeInTheDocument();
    expect(button.getAttribute('aria-controls')).toBe(
      screen.getByRole('listbox').getAttribute('id'),
    );
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-autocomplete')).toBe('list');
    expect(screen.getByTestId('item-1').getAttribute('aria-selected')).toBe(
      'false',
    );
    expect(screen.getByTestId('item-2').getAttribute('aria-selected')).toBe(
      'true',
    );

    fireEvent.click(button);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(button.hasAttribute('aria-controls')).toBe(false);
    expect(button.hasAttribute('aria-describedby')).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');

    cleanup();
  });
});

it('automatically handles custom id attributes', async () => {
  render(<App role="tooltip" floatingId="test" initiallyOpen />);
  await act(async () => {});
  expect(screen.getByRole('button')).toHaveAttribute(
    'aria-describedby',
    'test',
  );
  expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'test');
});
