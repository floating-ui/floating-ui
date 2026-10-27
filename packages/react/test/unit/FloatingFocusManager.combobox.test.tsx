import * as React from 'react';
import {act, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, test, vi} from 'vitest';
import {
  FloatingFocusManager,
  FloatingPortal,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from '../../src';

function Combobox({useFocusHook = false}: {useFocusHook?: boolean}) {
  const [open, setOpen] = React.useState(false);
  const {refs, context} = useFloating({open, onOpenChange: setOpen});
  const focus = useFocus(context, {enabled: useFocusHook});
  const dismiss = useDismiss(context);
  const role = useRole(context, {role: 'combobox'});
  const {getReferenceProps, getFloatingProps} = useInteractions([
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <input
        ref={refs.setReference}
        {...getReferenceProps({
          onFocus: useFocusHook ? undefined : () => setOpen(true),
        })}
      />
      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} initialFocus={-1}>
            <div ref={refs.setFloating} {...getFloatingProps()}>
              <div>Group label</div>
              <div role="option" aria-selected="false">
                Option
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
      <div>Outside</div>
      <button>Outside button</button>
    </>
  );
}

afterEach(() => vi.restoreAllMocks());

test.each([false, true])(
  'dismisses on the first outside press after clicking a group label (useFocus=%s)',
  async (useFocusHook) => {
    // Match browsers that support preventScroll; jsdom does not read it.
    const originalFocus = HTMLElement.prototype.focus;
    vi.spyOn(HTMLElement.prototype, 'focus').mockImplementation(function (
      this: HTMLElement,
      options,
    ) {
      void options?.preventScroll;
      originalFocus.call(this, options);
    });

    render(<Combobox useFocusHook={useFocusHook} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Group label'));
    expect(screen.getByRole('combobox')).not.toHaveFocus();

    await userEvent.click(screen.getByText('Outside'));
    await act(async () => {});

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).not.toHaveFocus();
  },
);

test.each([false, true])(
  'preserves outside button focus (useFocus=%s)',
  async (useFocusHook) => {
    render(<Combobox useFocusHook={useFocusHook} />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByText('Group label'));
    await userEvent.click(screen.getByText('Outside button'));

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByText('Outside button')).toHaveFocus();
    });
  },
);

test('returns focus after Escape with useFocus', async () => {
  render(<Combobox useFocusHook />);
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.click(screen.getByText('Group label'));
  await userEvent.keyboard('{Escape}');
  await act(async () => {});

  expect(screen.getByRole('combobox')).toHaveFocus();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});
