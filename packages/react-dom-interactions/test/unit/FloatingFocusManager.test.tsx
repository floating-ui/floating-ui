import {cloneElement, useRef, useState} from 'react';
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FloatingFocusManager,
  FloatingNode,
  FloatingTree,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInteractions,
  FloatingPortal,
} from '../../src';
import {Props} from '../../src/FloatingFocusManager';

function App(
  props: Partial<Omit<Props, 'initialFocus'> & {initialFocus?: 'two' | number}>
) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const {reference, floating, context} = useFloating({
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
      {open && (
        <FloatingFocusManager
          {...props}
          initialFocus={props.initialFocus === 'two' ? ref : props.initialFocus}
          context={context}
        >
          <div role="dialog" ref={floating} data-testid="floating">
            <button data-testid="one">close</button>
            <button data-testid="two" ref={ref}>
              confirm
            </button>
            <button data-testid="three" onClick={() => setOpen(false)}>
              x
            </button>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

describe('initialFocus', () => {
  test('number', () => {
    const {rerender} = render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    expect(screen.getByTestId('one')).toHaveFocus();

    rerender(<App initialFocus={1} />);
    expect(screen.getByTestId('two')).toHaveFocus();

    rerender(<App initialFocus={2} />);
    expect(screen.getByTestId('three')).toHaveFocus();

    cleanup();
  });

  test('ref', () => {
    render(<App initialFocus="two" />);
    fireEvent.click(screen.getByTestId('reference'));
    expect(screen.getByTestId('two')).toHaveFocus();

    cleanup();
  });
});

describe('returnFocus', () => {
  test('true', () => {
    render(<App />);

    screen.getByTestId('reference').focus();
    fireEvent.click(screen.getByTestId('reference'));
    expect(screen.getByTestId('one')).toHaveFocus();

    fireEvent.click(screen.getByTestId('three'));
    expect(screen.getByTestId('reference')).toHaveFocus();

    cleanup();
  });

  test('false', () => {
    render(<App returnFocus={false} />);

    screen.getByTestId('reference').focus();
    fireEvent.click(screen.getByTestId('reference'));
    expect(screen.getByTestId('one')).toHaveFocus();

    fireEvent.click(screen.getByTestId('three'));
    expect(screen.getByTestId('reference')).not.toHaveFocus();

    cleanup();
  });

  test('always returns to the reference for nested elements', async () => {
    interface Props {
      open?: boolean;
      render: (props: {close: () => void}) => React.ReactNode;
      children: JSX.Element;
    }

    const Dialog = ({render, open: passedOpen = false, children}: Props) => {
      const [open, setOpen] = useState(passedOpen);
      const nodeId = useFloatingNodeId();

      const {reference, floating, context} = useFloating({
        open,
        onOpenChange: setOpen,
        nodeId,
      });

      const {getReferenceProps, getFloatingProps} = useInteractions([
        useClick(context),
        useDismiss(context, {bubbles: false}),
      ]);

      return (
        <FloatingNode id={nodeId}>
          {cloneElement(
            children,
            getReferenceProps({ref: reference, ...children.props})
          )}
          <FloatingPortal>
            {open && (
              <FloatingFocusManager context={context}>
                <div {...getFloatingProps({ref: floating})}>
                  {render({
                    close: () => setOpen(false),
                  })}
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
        </FloatingNode>
      );
    };

    const NestedDialog: React.FC<Props> = (props) => {
      const parentId = useFloatingParentNodeId();

      if (parentId == null) {
        return (
          <FloatingTree>
            <Dialog {...props} />
          </FloatingTree>
        );
      }

      return <Dialog {...props} />;
    };

    render(
      <NestedDialog
        render={({close}) => (
          <>
            <NestedDialog
              render={({close}) => (
                <button onClick={close} data-testid="close-nested-dialog" />
              )}
            >
              <button data-testid="open-nested-dialog" />
            </NestedDialog>
            <button onClick={close} data-testid="close-dialog" />
          </>
        )}
      >
        <button data-testid="open-dialog" />
      </NestedDialog>
    );

    await userEvent.click(screen.getByTestId('open-dialog'));
    await userEvent.click(screen.getByTestId('open-nested-dialog'));

    expect(screen.queryByTestId('close-nested-dialog')).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByTestId('close-nested-dialog')).not.toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByTestId('close-dialog')).not.toBeInTheDocument();
  });
});

describe('endGuard', () => {
  test('true', async () => {
    render(<App endGuard={true} />);

    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(document.body).not.toHaveFocus();
  });

  test('false', async () => {
    render(<App endGuard={false} />);

    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(document.body).toHaveFocus();
  });
});

describe('endGuard', () => {
  test('true', async () => {
    render(<App endGuard={true} />);

    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(document.body).not.toHaveFocus();
  });

  test('false', async () => {
    render(<App endGuard={false} />);

    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(document.body).toHaveFocus();
  });
});

describe('preventTabbing', () => {
  test('true', async () => {
    render(<App preventTabbing={true} />);

    const prevEl = document.activeElement;
    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();

    expect(prevEl).toBe(document.activeElement);
  });

  test('false', async () => {
    render(<App preventTabbing={false} />);

    const prevEl = document.activeElement;
    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();

    expect(prevEl).not.toBe(document.activeElement);
  });
});

describe('modal', () => {
  test('true', async () => {
    render(<App modal={true} />);

    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();
    expect(screen.getByTestId('two')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('one')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('two')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('one')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('one')).toHaveFocus();

    cleanup();
  });

  test('false', async () => {
    render(<App modal={false} />);

    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();
    expect(screen.getByTestId('two')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab();

    // Focus leaving the floating element closes it.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    cleanup();
  });

  test('false — shift tabbing does not trap focus when reference is in order', async () => {
    render(<App modal={false} order={['reference', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));

    await userEvent.tab();
    await userEvent.tab({shift: true});
    await userEvent.tab({shift: true});

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    cleanup();
  });

  test('true - comboboxes hide all other nodes', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {reference, floating, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <input
            role="combobox"
            data-testid="reference"
            ref={reference}
            onFocus={() => setOpen(true)}
          />
          <button data-testid="btn-1" />
          <button data-testid="btn-2" />
          {open && (
            <FloatingFocusManager
              context={context}
              modal={true}
              order={['reference']}
            >
              <div role="listbox" ref={floating} data-testid="floating" />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.focus(screen.getByTestId('reference'));
    expect(screen.getByTestId('reference')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-2')).toHaveAttribute('aria-hidden');

    cleanup();
  });

  test('false - comboboxes do not hide all other nodes', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {reference, floating, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <input
            role="combobox"
            data-testid="reference"
            ref={reference}
            onFocus={() => setOpen(true)}
          />
          <button data-testid="btn-1" />
          <button data-testid="btn-2" />
          {open && (
            <FloatingFocusManager context={context} modal={false}>
              <div role="listbox" ref={floating} data-testid="floating" />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.focus(screen.getByTestId('reference'));
    expect(screen.getByTestId('reference')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');

    cleanup();
  });
});

describe('order', () => {
  test('[reference, content]', async () => {
    render(<App order={['reference', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));
    expect(screen.getByTestId('reference')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('one')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('two')).toHaveFocus();

    cleanup();
  });

  test('[floating, content]', async () => {
    render(<App order={['floating', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));
    expect(screen.getByTestId('floating')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('one')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('two')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('floating')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('two')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('one')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('floating')).toHaveFocus();

    cleanup();
  });

  test('[reference, floating, content]', async () => {
    render(<App order={['reference', 'floating', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));

    expect(screen.getByTestId('reference')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('floating')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('one')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('two')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('reference')).toHaveFocus();

    await userEvent.tab({shift: true});
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab({shift: true});
    await userEvent.tab({shift: true});
    await userEvent.tab({shift: true});
    await userEvent.tab({shift: true});

    expect(screen.getByTestId('reference')).toHaveFocus();

    cleanup();
  });
});
