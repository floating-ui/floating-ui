import {useState} from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  useDismiss,
  useInteractions,
  useFloating,
  FloatingPortal,
} from '../../src';
import type {Props} from '../../src/hooks/useDismiss';

function App(props: Props) {
  const [open, setOpen] = useState(true);
  const {reference, floating, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useDismiss(context, props),
  ]);

  return (
    <>
      <button {...getReferenceProps({ref: reference})} />
      {open && <div role="tooltip" {...getFloatingProps({ref: floating})} />}
    </>
  );
}

describe('true', () => {
  test('dismisses with escape key', () => {
    render(<App />);
    fireEvent.keyDown(document.body, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with outside pointer down', async () => {
    render(<App />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with reference pointer down', async () => {
    render(<App referencePointerDown />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with ancestor scroll', async () => {
    render(<App ancestorScroll />);
    fireEvent.scroll(window);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });
});

describe('false', () => {
  test('dismisses with escape key', () => {
    render(<App escapeKey={false} />);
    fireEvent.keyDown(document.body, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with outside pointer down', async () => {
    render(<App outsidePointerDown={false} />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with reference pointer down', async () => {
    render(<App referencePointerDown={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with ancestor scroll', async () => {
    render(<App ancestorScroll={false} />);
    fireEvent.scroll(window);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('does not dismiss when clicking portaled children', async () => {
    function App() {
      const [open, setOpen] = useState(true);
      const {reference, floating, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      const {getReferenceProps, getFloatingProps} = useInteractions([
        useDismiss(context),
      ]);

      return (
        <>
          <button ref={reference} {...getReferenceProps()} />
          {open && (
            <div ref={floating} {...getFloatingProps()}>
              <FloatingPortal>
                <button data-testid="portaled-button" />
              </FloatingPortal>
            </div>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.pointerDown(screen.getByTestId('portaled-button'), {
      bubbles: true,
    });

    expect(screen.queryByTestId('portaled-button')).toBeInTheDocument();

    cleanup();
  });
});
