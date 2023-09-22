import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {cloneElement, useRef, useState} from 'react';
import {Context as ResponsiveContext} from 'react-responsive';

import {
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInteractions,
  useRole,
} from '../../src';
import {FloatingFocusManagerProps} from '../../src/components/FloatingFocusManager';
import {Main as Drawer} from '../visual/components/Drawer';
import {Main as Navigation} from '../visual/components/Navigation';

function App(
  props: Partial<
    Omit<FloatingFocusManagerProps, 'initialFocus'> & {
      initialFocus?: 'two' | number;
    }
  >
) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const {refs, context} = useFloating({
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
      {open && (
        <FloatingFocusManager
          {...props}
          initialFocus={props.initialFocus === 'two' ? ref : props.initialFocus}
          context={context}
        >
          <div role="dialog" ref={refs.setFloating} data-testid="floating">
            <button data-testid="one">close</button>
            <button data-testid="two" ref={ref}>
              confirm
            </button>
            <button data-testid="three" onClick={() => setOpen(false)}>
              x
            </button>
            {props.children}
          </div>
        </FloatingFocusManager>
      )}
      <div tabIndex={0} data-testid="last">
        x
      </div>
    </>
  );
}

describe('initialFocus', () => {
  test('number', async () => {
    const {rerender} = render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('one')).toHaveFocus();

    rerender(<App initialFocus={1} />);
    expect(screen.getByTestId('two')).not.toHaveFocus();

    rerender(<App initialFocus={2} />);
    expect(screen.getByTestId('three')).not.toHaveFocus();
  });

  test('ref', async () => {
    render(<App initialFocus="two" />);
    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('two')).toHaveFocus();
  });

  test('respects autoFocus', async () => {
    render(
      <App>
        <input autoFocus data-testid="input" />
      </App>
    );
    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});
    expect(screen.getByTestId('input')).toHaveFocus();
  });
});

describe('returnFocus', () => {
  test('true', async () => {
    const {rerender} = render(<App />);

    screen.getByTestId('reference').focus();
    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('one')).toHaveFocus();

    act(() => screen.getByTestId('two').focus());

    rerender(<App returnFocus={false} />);

    expect(screen.getByTestId('two')).toHaveFocus();

    fireEvent.click(screen.getByTestId('three'));
    expect(screen.getByTestId('reference')).not.toHaveFocus();
  });

  test('false', async () => {
    render(<App returnFocus={false} />);

    screen.getByTestId('reference').focus();
    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('one')).toHaveFocus();

    fireEvent.click(screen.getByTestId('three'));
    expect(screen.getByTestId('reference')).not.toHaveFocus();
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

      const {refs, context} = useFloating({
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
            getReferenceProps({ref: refs.setReference, ...children.props})
          )}
          <FloatingPortal>
            {open && (
              <FloatingFocusManager context={context}>
                <div {...getFloatingProps({ref: refs.setFloating})}>
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

describe('guards', () => {
  test('true', async () => {
    render(<App guards={true} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(document.body).not.toHaveFocus();
  });

  test('false', async () => {
    render(<App guards={false} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(document.activeElement).toHaveAttribute('data-floating-ui-inert');
  });
});

describe('modal', () => {
  test('true', async () => {
    render(<App modal={true} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

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
  });

  test('false', async () => {
    render(<App modal={false} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab();
    expect(screen.getByTestId('two')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('three')).toHaveFocus();

    await userEvent.tab();

    // Wait for the setTimeout that wraps onOpenChange(false).
    await act(() => new Promise((resolve) => setTimeout(resolve)));

    // Focus leaving the floating element closes it.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    expect(screen.getByTestId('last')).toHaveFocus();
  });

  test('false — shift tabbing does not trap focus when reference is in order', async () => {
    render(<App modal={false} order={['reference', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab();
    await userEvent.tab({shift: true});
    await userEvent.tab({shift: true});

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  test('true - comboboxes hide all other nodes', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <input
            role="combobox"
            data-testid="reference"
            ref={refs.setReference}
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
              <div
                role="listbox"
                ref={refs.setFloating}
                data-testid="floating"
              />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.focus(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('reference')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-2')).toHaveAttribute('aria-hidden');
  });

  test('false - comboboxes do not hide all other nodes', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <input
            role="combobox"
            data-testid="reference"
            ref={refs.setReference}
            onFocus={() => setOpen(true)}
          />
          <button data-testid="btn-1" />
          <button data-testid="btn-2" />
          {open && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                role="listbox"
                ref={refs.setFloating}
                data-testid="floating"
              />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.focus(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('reference')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');
  });

  test('fallback to floating element when it has no tabbable content', async () => {
    function App() {
      const {refs, context} = useFloating({open: true});
      return (
        <>
          <button data-testid="reference" ref={refs.setReference} />
          <FloatingFocusManager context={context} modal={true}>
            <div ref={refs.setFloating} data-testid="floating" tabIndex={-1} />
          </FloatingFocusManager>
        </>
      );
    }

    render(<App />);
    await act(async () => {});

    expect(screen.getByTestId('floating')).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByTestId('floating')).toHaveFocus();
    await userEvent.tab({shift: true});
    expect(screen.getByTestId('floating')).toHaveFocus();
  });

  test('mixed modality and nesting', async () => {
    interface Props {
      open?: boolean;
      modal?: boolean;
      render: (props: {close: () => void}) => React.ReactNode;
      children?: JSX.Element;
      sideChildren?: JSX.Element;
    }

    const Dialog = ({
      render,
      open: controlledOpen,
      modal = true,
      children,
      sideChildren,
    }: Props) => {
      const [internalOpen, setOpen] = useState(false);
      const nodeId = useFloatingNodeId();
      const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

      const {refs, context} = useFloating({
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
          {children &&
            cloneElement(
              children,
              getReferenceProps({ref: refs.setReference, ...children.props})
            )}
          <FloatingPortal>
            {open && (
              <FloatingFocusManager context={context} modal={modal}>
                <div {...getFloatingProps({ref: refs.setFloating})}>
                  {render({
                    close: () => setOpen(false),
                  })}
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
          {sideChildren}
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

    const App = () => {
      const [sideDialogOpen, setSideDialogOpen] = useState(false);
      return (
        <NestedDialog
          modal={false}
          render={({close}) => (
            <>
              <button onClick={close} data-testid="close-dialog" />
              <button
                onClick={() => setSideDialogOpen(true)}
                data-testid="open-nested-dialog"
              />
            </>
          )}
          sideChildren={
            <NestedDialog
              modal={true}
              open={sideDialogOpen}
              render={({close}) => (
                <button onClick={close} data-testid="close-nested-dialog" />
              )}
            />
          }
        >
          <button data-testid="open-dialog" />
        </NestedDialog>
      );
    };

    render(<App />);

    await userEvent.click(screen.getByTestId('open-dialog'));
    await userEvent.click(screen.getByTestId('open-nested-dialog'));

    expect(screen.queryByTestId('close-dialog')).toBeInTheDocument();
    expect(screen.queryByTestId('close-nested-dialog')).toBeInTheDocument();
  });

  test('true - applies aria-hidden to outside nodes', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);
      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      return (
        <>
          <input
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setIsOpen((v) => !v)}
          />
          <div>
            <div data-testid="aria-live" aria-live="polite" />
            <button data-testid="btn-1" />
            <button data-testid="btn-2" />
          </div>
          {isOpen && (
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} data-testid="floating" />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('reference')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('btn-2')).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(screen.getByTestId('reference'));

    expect(screen.getByTestId('reference')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');
  });

  test('false - does not apply aria-hidden to outside nodes', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);
      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      return (
        <>
          <input
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setIsOpen((v) => !v)}
          />
          <div>
            <div data-testid="aria-live" aria-live="polite" />
            <div data-testid="original" aria-hidden="false" />
            <button data-testid="btn-1" />
            <button data-testid="btn-2" />
          </div>
          {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                role="listbox"
                ref={refs.setFloating}
                data-testid="floating"
              />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('reference')).toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('btn-1')).toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('btn-2')).toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('original')).toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('original')).toHaveAttribute(
      'aria-hidden',
      'false'
    );

    fireEvent.click(screen.getByTestId('reference'));

    expect(screen.getByTestId('reference')).not.toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('original')).not.toHaveAttribute(
      'data-floating-ui-inert'
    );
    expect(screen.getByTestId('original')).toHaveAttribute(
      'aria-hidden',
      'false'
    );
  });
});

describe('disabled', () => {
  test('true -> false', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);
      const [disabled, setDisabled] = useState(true);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      return (
        <>
          <button
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setIsOpen((v) => !v)}
          />
          <button data-testid="toggle" onClick={() => setDisabled((v) => !v)} />
          {isOpen && (
            <FloatingFocusManager context={context} disabled={disabled}>
              <div ref={refs.setFloating} data-testid="floating" />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});
    expect(screen.getByTestId('floating')).not.toHaveFocus();
    fireEvent.click(screen.getByTestId('toggle'));
    await act(async () => {});
    expect(screen.getByTestId('floating')).toHaveFocus();
  });

  test('false', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);
      const [disabled, setDisabled] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const click = useClick(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([click]);

      return (
        <>
          <button
            data-testid="reference"
            ref={refs.setReference}
            {...getReferenceProps()}
          />
          <button data-testid="toggle" onClick={() => setDisabled((v) => !v)} />
          {isOpen && (
            <FloatingFocusManager context={context} disabled={disabled}>
              <div
                ref={refs.setFloating}
                data-testid="floating"
                {...getFloatingProps()}
              />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});
    expect(screen.getByTestId('floating')).toHaveFocus();
  });
});

describe('order', () => {
  test('[reference, content]', async () => {
    render(<App order={['reference', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('reference')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('one')).toHaveFocus();

    await userEvent.tab();
    expect(screen.getByTestId('two')).toHaveFocus();
  });

  test('[floating, content]', async () => {
    render(<App order={['floating', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

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
  });

  test('[reference, floating, content]', async () => {
    render(<App order={['reference', 'floating', 'content']} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

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
  });
});

describe('non-modal + FloatingPortal', () => {
  test('focuses inside element, tabbing out focuses last document element', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <span tabIndex={0} data-testid="first" />
          <button
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setOpen(true)}
          />
          <FloatingPortal>
            {open && (
              <FloatingFocusManager context={context} modal={false}>
                <div data-testid="floating" ref={refs.setFloating}>
                  <span tabIndex={0} data-testid="inside" />
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
          <span tabIndex={0} data-testid="last" />
        </>
      );
    }

    render(<App />);

    await userEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('inside')).toHaveFocus();

    await userEvent.tab();

    expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
    expect(screen.getByTestId('last')).toHaveFocus();
  });

  test('order: [reference, content] focuses reference, then inside, then, last document element', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <span tabIndex={0} data-testid="first" />
          <button
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setOpen(true)}
          />
          <FloatingPortal>
            {open && (
              <FloatingFocusManager
                context={context}
                modal={false}
                order={['reference', 'content']}
              >
                <div data-testid="floating" ref={refs.setFloating}>
                  <span tabIndex={0} data-testid="inside" />
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
          <span tabIndex={0} data-testid="last" />
        </>
      );
    }

    render(<App />);

    await userEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab();

    expect(screen.getByTestId('inside')).toHaveFocus();

    await userEvent.tab();

    expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
    expect(screen.getByTestId('last')).toHaveFocus();
  });

  test('order: [reference, floating, content] focuses reference, then inside, then, last document element', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <span tabIndex={0} data-testid="first" />
          <button
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setOpen(true)}
          />
          <FloatingPortal>
            {open && (
              <FloatingFocusManager
                context={context}
                modal={false}
                order={['reference', 'floating', 'content']}
              >
                <div data-testid="floating" ref={refs.setFloating}>
                  <span tabIndex={0} data-testid="inside" />
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
          <span tabIndex={0} data-testid="last" />
        </>
      );
    }

    render(<App />);

    await userEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab();

    expect(screen.getByTestId('floating')).toHaveFocus();

    await userEvent.tab();

    expect(screen.getByTestId('inside')).toHaveFocus();

    await userEvent.tab();

    expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
    expect(screen.getByTestId('last')).toHaveFocus();
  });

  test('shift+tab', async () => {
    function App() {
      const [open, setOpen] = useState(false);
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      return (
        <>
          <span tabIndex={0} data-testid="first" />
          <button
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setOpen(true)}
          />
          <FloatingPortal>
            {open && (
              <FloatingFocusManager context={context} modal={false}>
                <div data-testid="floating" ref={refs.setFloating}>
                  <span tabIndex={0} data-testid="inside" />
                </div>
              </FloatingFocusManager>
            )}
          </FloatingPortal>
          <span tabIndex={0} data-testid="last" />
        </>
      );
    }

    render(<App />);

    await userEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab({shift: true});

    expect(screen.queryByTestId('floating')).toBeInTheDocument();

    await userEvent.tab({shift: true});

    expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
  });
});

describe('Navigation', () => {
  test('does not focus reference when hovering it', async () => {
    render(<Navigation />);
    await userEvent.hover(screen.getByText('Product'));
    await userEvent.unhover(screen.getByText('Product'));
    expect(screen.getByText('Product')).not.toHaveFocus();
  });

  test('returns focus to reference when floating element was opened by hover but is closed by esc key', async () => {
    render(<Navigation />);
    await userEvent.hover(screen.getByText('Product'));
    await userEvent.keyboard('{Escape}');
    expect(screen.getByText('Product')).toHaveFocus();
  });

  test('returns focus to reference when floating element was opened by hover but is closed by an explicit close button', async () => {
    render(<Navigation />);
    await userEvent.hover(screen.getByText('Product'));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.click(screen.getByText('Close').parentElement!);
    await userEvent.keyboard('{Tab}');
    expect(screen.getByText('Close')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByText('Product')).toHaveFocus();
  });

  test('does not re-open after closing via escape key', async () => {
    render(<Navigation />);
    await userEvent.hover(screen.getByText('Product'));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
  });

  test('closes when unhovering floating element even when focus is inside it', async () => {
    render(<Navigation />);
    await userEvent.hover(screen.getByText('Product'));
    await userEvent.click(screen.getByTestId('subnavigation'));
    await userEvent.unhover(screen.getByTestId('subnavigation'));
    await userEvent.hover(screen.getByText('Product'));
    await userEvent.unhover(screen.getByText('Product'));
    expect(screen.queryByTestId('subnavigation')).not.toBeInTheDocument();
  });
});

describe('Drawer', () => {
  test('does not close when clicking another button outside', async () => {
    render(
      <ResponsiveContext.Provider value={{width: 1600}}>
        <Drawer />
      </ResponsiveContext.Provider>
    );
    await userEvent.click(screen.getByText('My button'));
    expect(screen.queryByText('Close')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Next button'));
    await act(async () => {});
    expect(screen.queryByText('Close')).toBeInTheDocument();
  });

  test('closeOnFocusOut=false - does not close when tabbing out', async () => {
    render(
      <ResponsiveContext.Provider value={{width: 1600}}>
        <Drawer />
      </ResponsiveContext.Provider>
    );
    await userEvent.click(screen.getByText('My button'));
    expect(screen.queryByText('Close')).toBeInTheDocument();
    await userEvent.keyboard('{Tab}');
    await act(async () => {});
    expect(document.activeElement).toBe(screen.getByText('Next button'));
    expect(screen.queryByText('Close')).toBeInTheDocument();
  });

  test('returns focus when tabbing out then back to close button', async () => {
    render(
      <ResponsiveContext.Provider value={{width: 1600}}>
        <Drawer />
      </ResponsiveContext.Provider>
    );
    await userEvent.click(screen.getByText('My button'));
    expect(screen.queryByText('Close')).toBeInTheDocument();
    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(screen.getByText('Next button'));
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(screen.getByText('Close'));
    await userEvent.click(screen.getByText('Close'));
    expect(document.activeElement).toBe(screen.getByText('My button'));
  });
});

test('trapped combobox prevents focus moving outside floating element', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, floatingStyles, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const role = useRole(context);
    const dismiss = useDismiss(context);
    const click = useClick(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
      role,
      dismiss,
      click,
    ]);

    return (
      <div className="App">
        <input
          ref={refs.setReference}
          {...getReferenceProps()}
          data-testid="input"
          role="combobox"
        />
        {isOpen && (
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
            >
              <button>one</button>
              <button>two</button>
            </div>
          </FloatingFocusManager>
        )}
      </div>
    );
  }

  render(<App />);
  await userEvent.click(screen.getByTestId('input'));
  await act(async () => {});
  expect(screen.getByTestId('input')).not.toHaveFocus();
  expect(screen.getByRole('button', {name: 'one'})).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole('button', {name: 'two'})).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole('button', {name: 'one'})).toHaveFocus();
  cleanup();
});

test('untrapped combobox creates non-modal focus management', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, floatingStyles, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const role = useRole(context);
    const dismiss = useDismiss(context);
    const click = useClick(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
      role,
      dismiss,
      click,
    ]);

    return (
      <>
        <input
          ref={refs.setReference}
          {...getReferenceProps()}
          data-testid="input"
          role="combobox"
        />
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context} initialFocus={-1}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                <button>one</button>
                <button>two</button>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
        <button>outside</button>
      </>
    );
  }

  render(<App />);
  await userEvent.click(screen.getByTestId('input'));
  await act(async () => {});
  expect(screen.getByTestId('input')).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByRole('button', {name: 'one'})).toHaveFocus();
  await userEvent.tab({shift: true});
  expect(screen.getByTestId('input')).toHaveFocus();
  cleanup();
});
