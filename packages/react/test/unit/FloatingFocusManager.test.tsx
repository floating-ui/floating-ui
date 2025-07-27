import * as React from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {test} from 'vitest';
import {cloneElement, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
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
  useHover,
  useInteractions,
  useRole,
} from '../../src';
import type {FloatingFocusManagerProps} from '../../src/components/FloatingFocusManager';
import {Main as Drawer} from '../visual/components/Drawer';
import {Main as Navigation} from '../visual/components/Navigation';
import {Main as MenuVirtual} from '../visual/components/MenuVirtual';
import {isJSDOM} from '../../src/utils';

function App(
  props: Partial<
    Omit<FloatingFocusManagerProps, 'initialFocus'> & {
      initialFocus?: 'two' | number;
    }
  >,
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
        outside
      </div>
    </>
  );
}

interface DialogProps {
  open?: boolean;
  render: (props: {close: () => void}) => React.ReactNode;
  children: React.JSX.Element;
}

const Dialog = ({render, open: passedOpen = false, children}: DialogProps) => {
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
        getReferenceProps({ref: refs.setReference, ...children.props}),
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
      </App>,
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

  test('ref', async () => {
    function Test() {
      const ref = useRef<HTMLInputElement | null>(null);
      return (
        <div>
          <input />
          <input data-testid="focus-target" ref={ref} />
          <input />
          <App returnFocus={ref} />
        </div>
      );
    }

    render(<Test />);
    screen.getByTestId('reference').focus();
    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    fireEvent.click(screen.getByTestId('three'));
    await act(async () => {});
    expect(screen.getByTestId('focus-target')).toHaveFocus();
  });

  test('always returns to the reference for nested elements', async () => {
    const NestedDialog: React.FC<DialogProps> = (props) => {
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
      </NestedDialog>,
    );

    await userEvent.click(screen.getByTestId('open-dialog'));
    await userEvent.click(screen.getByTestId('open-nested-dialog'));

    expect(screen.queryByTestId('close-nested-dialog')).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByTestId('close-nested-dialog')).not.toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByTestId('close-dialog')).not.toBeInTheDocument();
  });

  test('return to the first focusable descendent of the reference, if the reference is not focusable', async () => {
    render(
      <Dialog
        render={({close}) => (
          <>
            <button onClick={close} data-testid="close-dialog" />
          </>
        )}
      >
        <div data-testid="non-focusable-reference">
          <button data-testid="open-dialog" />
        </div>
      </Dialog>,
    );
    screen.getByTestId('open-dialog').focus();
    await userEvent.keyboard('{Enter}');

    expect(screen.queryByTestId('close-dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Esc}');

    expect(screen.queryByTestId('close-dialog')).not.toBeInTheDocument();

    expect(screen.getByTestId('open-dialog')).toHaveFocus();
  });

  test('preserves tabbable context next to reference element if removed (modal)', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);
      const [removed, setRemoved] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const click = useClick(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([click]);

      return (
        <>
          {!removed && (
            <button
              ref={refs.setReference}
              {...getReferenceProps()}
              data-testid="reference"
            />
          )}
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager context={context}>
                <div ref={refs.setFloating} {...getFloatingProps()}>
                  <button
                    data-testid="remove"
                    onClick={() => {
                      setRemoved(true);
                      setIsOpen(false);
                    }}
                  >
                    remove
                  </button>
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
          <button data-testid="fallback" />
        </>
      );
    }

    render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    fireEvent.click(screen.getByTestId('remove'));
    await act(async () => {});

    await userEvent.tab();

    expect(screen.getByTestId('fallback')).toHaveFocus();
  });

  test('preserves tabbable context next to reference element if removed (non-modal)', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);
      const [removed, setRemoved] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const click = useClick(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([click]);

      return (
        <>
          {!removed && (
            <button
              ref={refs.setReference}
              {...getReferenceProps()}
              data-testid="reference"
            />
          )}
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager context={context} modal={false}>
                <div ref={refs.setFloating} {...getFloatingProps()}>
                  <button
                    data-testid="remove"
                    onClick={() => {
                      setRemoved(true);
                      setIsOpen(false);
                    }}
                  >
                    remove
                  </button>
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
          <button data-testid="fallback" />
        </>
      );
    }

    render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    fireEvent.click(screen.getByTestId('remove'));
    await act(async () => {});

    await userEvent.tab();

    expect(screen.getByTestId('fallback')).toHaveFocus();
  });

  test.skipIf(!isJSDOM())(
    'does not return focus to reference on outside press when preventScroll is not supported',
    async () => {
      function App() {
        const [isOpen, setIsOpen] = useState(false);

        const {refs, context} = useFloating({
          open: isOpen,
          onOpenChange: setIsOpen,
        });

        const click = useClick(context);
        const dismiss = useDismiss(context);

        const {getReferenceProps, getFloatingProps} = useInteractions([
          click,
          dismiss,
        ]);

        return (
          <>
            <button ref={refs.setReference} {...getReferenceProps()}>
              reference
            </button>
            {isOpen && (
              <FloatingFocusManager context={context}>
                <div
                  ref={refs.setFloating}
                  {...getFloatingProps()}
                  data-testid="floating"
                />
              </FloatingFocusManager>
            )}
          </>
        );
      }

      render(<App />);

      await userEvent.click(screen.getByText('reference'));
      await act(async () => {});

      expect(screen.getByTestId('floating')).toHaveFocus();

      await userEvent.click(document.body);
      await act(async () => {});

      expect(screen.getByText('reference')).not.toHaveFocus();
    },
  );

  test('returns focus to reference on outside press when preventScroll is supported', async () => {
    const originalFocus = HTMLElement.prototype.focus;
    Object.defineProperty(HTMLElement.prototype, 'focus', {
      configurable: true,
      writable: true,
      value(options: any) {
        options && options.preventScroll;
        return originalFocus.call(this, options);
      },
    });

    function App() {
      const [isOpen, setIsOpen] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const click = useClick(context);
      const dismiss = useDismiss(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([
        click,
        dismiss,
      ]);

      return (
        <>
          <button ref={refs.setReference} {...getReferenceProps()}>
            reference
          </button>
          {isOpen && (
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                {...getFloatingProps()}
                data-testid="floating"
              />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    await userEvent.click(screen.getByText('reference'));
    await act(async () => {});

    expect(screen.getByTestId('floating')).toHaveFocus();

    await userEvent.click(document.body);
    await act(async () => {});

    expect(screen.getByText('reference')).toHaveFocus();

    HTMLElement.prototype.focus = originalFocus;
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

  test.skipIf(!isJSDOM())('false', async () => {
    render(<App guards={false} />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    expect(document.activeElement).toHaveAttribute('inert', '');
  });
});

describe('iframe focus navigation', () => {
  function App({iframe}: {iframe: HTMLElement}) {
    return (
      <div>
        <a href="#">prev iframe link</a>
        <Popover
          portalRef={iframe}
          render={() => (
            <div data-testid="popover">
              <a href="#">popover link 1</a>
              <a href="#">popover link 2</a>
            </div>
          )}
        >
          <button>Open</button>
        </Popover>
        <a href="#">next iframe link</a>
      </div>
    );
  }

  function Popover({
    children,
    render,
    portalRef,
  }: {
    children: React.ReactElement;
    render: () => React.ReactNode;
    portalRef?: HTMLElement;
  }) {
    const [open, setOpen] = useState(false);

    const {floatingStyles, refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
      click,
      dismiss,
    ]);

    return (
      <>
        {React.cloneElement(
          children,
          getReferenceProps({ref: refs.setReference}),
        )}
        {open && (
          <FloatingPortal root={portalRef}>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                {render()}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </>
    );
  }

  function IframeApp() {
    React.useEffect(() => {
      function createIframe() {
        const container = document.querySelector('#innerRoot');
        const iframe = document.createElement('iframe');
        iframe.setAttribute('data-testid', 'iframe');
        iframe.src = 'about:blank';
        iframe.style.height = '300px';

        container?.appendChild(iframe);

        // Properly open, write, and close the iframe document.
        const iframeDoc = iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`<div id="rootIframe"></div>`);
          iframeDoc.close();
        }

        const rootIframe =
          iframe.contentWindow?.document.getElementById('rootIframe');
        return rootIframe;
      }

      const root = createIframe();
      if (root) {
        createRoot(root).render(<App iframe={root} />);
      }
    }, []);

    return (
      <>
        <a href="#">Outside link 1</a>
        <div id="innerRoot"></div>
        <a href="#">Outside link 2</a>
      </>
    );
  }

  // "Should not already be working"(?) when trying to click within the iframe
  // https://github.com/facebook/react/pull/32441
  test.skipIf(!isJSDOM())(
    'tabs from the popover to the next element in the iframe',
    async () => {
      render(<IframeApp />);

      const iframe: HTMLIFrameElement = await screen.findByTestId('iframe');
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      const iframeWithin = iframeDoc ? within(iframeDoc.body) : screen;

      const user = userEvent.setup({document: iframeDoc});

      await user.click(iframeWithin.getByRole('button', {name: 'Open'}));

      expect(iframeWithin.getByTestId('popover')).toBeInTheDocument();

      await user.tab();
      await user.tab();

      expect(iframeWithin.getByText('next iframe link')).toHaveFocus();
    },
  );

  // "Should not already be working"(?) when trying to click within the iframe
  // https://github.com/facebook/react/pull/32441
  test.skipIf(!isJSDOM())(
    'shift+tab from the popover to the previous element in the iframe',
    async () => {
      render(<IframeApp />);

      const iframe: HTMLIFrameElement = await screen.findByTestId('iframe');
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      const iframeWithin = iframeDoc ? within(iframeDoc.body) : screen;

      const user = userEvent.setup({document: iframeDoc});

      await user.click(iframeWithin.getByRole('button', {name: 'Open'}));

      expect(iframeWithin.getByTestId('popover')).toBeInTheDocument();

      await user.tab({shift: true});

      expect(iframeWithin.getByRole('button', {name: 'Open'})).toHaveFocus();
    },
  );
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

  test('true - comboboxes hide all other nodes with aria-hidden', async () => {
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

  test('true - comboboxes hide all other nodes with inert when outsideElementsInert=true', async () => {
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
              outsideElementsInert
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

    expect(screen.getByTestId('reference')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('floating')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-1')).toHaveAttribute('inert');
    expect(screen.getByTestId('btn-2')).toHaveAttribute('inert');
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

    expect(screen.getByTestId('reference')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('floating')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('inert');
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
      children?: React.JSX.Element;
      sideChildren?: React.JSX.Element;
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
              getReferenceProps({ref: refs.setReference, ...children.props}),
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
            <div data-testid="role-status" role="status" />
            <output data-testid="el-output" />
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
      'true',
    );
    expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('role-status')).not.toHaveAttribute(
      'aria-hidden',
    );
    expect(screen.getByTestId('el-output')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('btn-2')).toHaveAttribute('aria-hidden', 'true');

    fireEvent.click(screen.getByTestId('reference'));

    expect(screen.getByTestId('reference')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('role-status')).not.toHaveAttribute(
      'aria-hidden',
    );
    expect(screen.getByTestId('el-output')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');
  });

  test('true - applies inert to outside nodes when outsideElementsInert=true', async () => {
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
            <div data-testid="role-status" role="status" />
            <output data-testid="el-output" />
            <button data-testid="btn-1" />
            <button data-testid="btn-2" />
          </div>
          {isOpen && (
            <FloatingFocusManager context={context} outsideElementsInert>
              <div ref={refs.setFloating} data-testid="floating" />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);

    fireEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('reference')).toHaveAttribute('inert');
    expect(screen.getByTestId('floating')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('role-status')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('el-output')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-1')).toHaveAttribute('inert');
    expect(screen.getByTestId('btn-2')).toHaveAttribute('inert');

    fireEvent.click(screen.getByTestId('reference'));

    expect(screen.getByTestId('reference')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('role-status')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('el-output')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('inert');
  });

  test('false - does not apply inert to outside nodes', async () => {
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

    expect(screen.getByTestId('floating')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('aria-live')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('reference')).toHaveAttribute(
      'data-floating-ui-inert',
    );
    expect(screen.getByTestId('btn-1')).toHaveAttribute(
      'data-floating-ui-inert',
    );
    expect(screen.getByTestId('btn-2')).toHaveAttribute(
      'data-floating-ui-inert',
    );

    fireEvent.click(screen.getByTestId('reference'));

    expect(screen.getByTestId('reference')).not.toHaveAttribute(
      'data-floating-ui-inert',
    );
    expect(screen.getByTestId('btn-1')).not.toHaveAttribute(
      'data-floating-ui-inert',
    );
    expect(screen.getByTestId('btn-2')).not.toHaveAttribute(
      'data-floating-ui-inert',
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
              <div
                ref={refs.setFloating}
                data-testid="floating"
                role="dialog"
              />
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

  test('supports keepMounted behavior', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const click = useClick(context);
      const dismiss = useDismiss(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([
        click,
        dismiss,
      ]);

      return (
        <>
          <button
            data-testid="reference"
            ref={refs.setReference}
            {...getReferenceProps()}
          />
          <FloatingFocusManager
            context={context}
            disabled={!isOpen}
            modal={false}
          >
            <div
              ref={refs.setFloating}
              data-testid="floating"
              {...getFloatingProps()}
            >
              <button data-testid="child" />
            </div>
          </FloatingFocusManager>
          <button data-testid="after" />
        </>
      );
    }

    render(<App />);

    await act(async () => {});

    expect(screen.getByTestId('floating')).not.toHaveFocus();

    fireEvent.click(screen.getByTestId('reference'));

    await act(async () => {});

    expect(screen.getByTestId('child')).toHaveFocus();

    await userEvent.tab();

    expect(screen.getByTestId('after')).toHaveFocus();

    await userEvent.tab({shift: true});

    fireEvent.click(screen.getByTestId('reference'));

    expect(screen.getByTestId('child')).toHaveFocus();

    await userEvent.keyboard('{Escape}');

    expect(screen.getByTestId('reference')).toHaveFocus();
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
    await act(async () => {});
    await userEvent.keyboard('{Escape}');
    expect(screen.getByText('Product')).toHaveFocus();
  });

  test('returns focus to reference when floating element was opened by hover but is closed by an explicit close button', async () => {
    render(<Navigation />);
    await userEvent.hover(screen.getByText('Product'));
    await act(async () => {});
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
      </ResponsiveContext.Provider>,
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
      </ResponsiveContext.Provider>,
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
      </ResponsiveContext.Provider>,
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

describe('restoreFocus', () => {
  function App({restoreFocus = true}: {restoreFocus?: boolean}) {
    const [isOpen, setIsOpen] = useState(false);
    const [removed, setRemoved] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const click = useClick(context);
    const {getReferenceProps, getFloatingProps} = useInteractions([click]);

    return (
      <>
        <button onClick={() => setRemoved(true)}>remove</button>
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          data-testid="reference"
        />
        {isOpen && (
          <FloatingFocusManager
            context={context}
            restoreFocus={restoreFocus}
            initialFocus={1}
          >
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              data-testid="floating"
            >
              <button>one</button>
              {!removed && <button>two</button>}
              <button>three</button>
            </div>
          </FloatingFocusManager>
        )}
      </>
    );
  }

  test.skipIf(isJSDOM())(
    'true: restores focus to nearest tabbable element if currently focused element is removed',
    async () => {
      render(<App />);

      await userEvent.click(screen.getByTestId('reference'));
      await act(async () => {});

      const two = screen.getByRole('button', {name: 'two'});
      const three = screen.getByRole('button', {name: 'three'});
      const remove = screen.getByText('remove');

      expect(two).toHaveFocus();

      fireEvent.click(remove);

      await waitFor(() => {
        expect(three).toHaveFocus();
      });
    },
  );

  test.skipIf(isJSDOM())(
    'false: does not restore focus to nearest tabbable element if currently focused element is removed',
    async () => {
      render(<App restoreFocus={false} />);

      await userEvent.click(screen.getByTestId('reference'));
      await act(async () => {});

      const two = screen.getByRole('button', {name: 'two'});
      const remove = screen.getByText('remove');

      expect(two).toHaveFocus();

      fireEvent.click(remove);
      await act(async () => {});

      await waitFor(() => {
        expect(document.body).toHaveFocus();
      });
    },
  );
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
            <FloatingFocusManager
              context={context}
              initialFocus={-1}
              modal={false}
            >
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
});

test('returns focus to last connected element', async () => {
  function Drawer({
    open,
    onOpenChange,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    const {refs, context} = useFloating({open, onOpenChange});
    const dismiss = useDismiss(context);
    const {getFloatingProps} = useInteractions([dismiss]);

    return (
      <FloatingFocusManager context={context}>
        <div ref={refs.setFloating} {...getFloatingProps()}>
          <button data-testid="child-reference" />
        </div>
      </FloatingFocusManager>
    );
  }

  function Parent() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const dismiss = useDismiss(context);
    const click = useClick(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([
      click,
      dismiss,
    ]);

    return (
      <>
        <button
          ref={refs.setReference}
          data-testid="parent-reference"
          {...getReferenceProps()}
        />
        {isOpen && (
          <FloatingFocusManager context={context}>
            <div ref={refs.setFloating} {...getFloatingProps()}>
              Parent Floating
              <button
                data-testid="parent-floating-reference"
                onClick={() => {
                  setIsDrawerOpen(true);
                  setIsOpen(false);
                }}
              />
            </div>
          </FloatingFocusManager>
        )}
        {isDrawerOpen && (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
        )}
      </>
    );
  }

  render(<Parent />);
  await userEvent.click(screen.getByTestId('parent-reference'));
  await act(async () => {});
  expect(screen.getByTestId('parent-floating-reference')).toHaveFocus();
  await userEvent.click(screen.getByTestId('parent-floating-reference'));
  await act(async () => {});
  expect(screen.getByTestId('child-reference')).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(screen.getByTestId('parent-reference')).toHaveFocus();
});

test('focus is placed on element with floating props when floating element is a wrapper', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const role = useRole(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([role]);

    return (
      <>
        <button
          ref={refs.setReference}
          {...getReferenceProps({
            onClick: () => setIsOpen((v) => !v),
          })}
        />
        {isOpen && (
          <FloatingFocusManager context={context}>
            <div ref={refs.setFloating} data-testid="outer">
              <div {...getFloatingProps()} data-testid="inner"></div>
            </div>
          </FloatingFocusManager>
        )}
      </>
    );
  }

  render(<App />);

  await userEvent.click(screen.getByRole('button'));
  await act(async () => {});

  expect(screen.getByTestId('inner')).toHaveFocus();
});

test('floating element closes upon tabbing out of modal combobox', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const click = useClick(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([click]);

    return (
      <>
        <input
          ref={refs.setReference}
          {...getReferenceProps()}
          data-testid="input"
          role="combobox"
        />
        {isOpen && (
          <FloatingFocusManager context={context} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              data-testid="floating"
            >
              <button tabIndex={-1}>one</button>
            </div>
          </FloatingFocusManager>
        )}
        <button data-testid="after" />
      </>
    );
  }

  render(<App />);
  await userEvent.click(screen.getByTestId('input'));
  await act(async () => {});
  expect(screen.getByTestId('input')).toHaveFocus();
  await userEvent.tab();
  await act(async () => {});
  expect(screen.getByTestId('after')).toHaveFocus();
});

test('focus does not return to reference when floating element is triggered by hover', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const hover = useHover(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

    return (
      <>
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          data-testid="reference"
        />
        {isOpen && (
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              data-testid="floating"
            />
          </FloatingFocusManager>
        )}
      </>
    );
  }

  render(<App />);

  const reference = screen.getByTestId('reference');

  act(() => reference.focus());

  await userEvent.hover(reference);
  await act(async () => {});

  expect(screen.getByTestId('floating')).toHaveFocus();

  await userEvent.unhover(screen.getByTestId('floating'));

  expect(screen.getByTestId('reference')).not.toHaveFocus();
});

test('uses aria-hidden instead of inert on outside nodes if opened with hover and modal=true', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    const hover = useHover(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

    return (
      <>
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          data-testid="reference"
        />
        {isOpen && (
          <FloatingFocusManager context={context}>
            <div
              ref={refs.setFloating}
              {...getFloatingProps()}
              data-testid="floating"
            />
          </FloatingFocusManager>
        )}
        <button>outside</button>
      </>
    );
  }

  render(<App />);

  await userEvent.hover(screen.getByTestId('reference'));
  await act(async () => {});

  expect(screen.getByText('outside')).not.toHaveAttribute('inert');
  expect(screen.getByText('outside')).toHaveAttribute('aria-hidden', 'true');
});

test('aria-hidden is not applied on root combobox with virtual nested menu', async () => {
  render(<MenuVirtual />);

  await userEvent.click(screen.getByRole('combobox'));
  await act(async () => {});

  await userEvent.keyboard('{ArrowDown}'); // undo
  await userEvent.keyboard('{ArrowDown}'); // redo
  await userEvent.keyboard('{ArrowDown}'); // copy as
  await userEvent.keyboard('{ArrowRight}'); // submenu -> text

  expect(screen.queryByRole('combobox')).not.toBe(null);

  await userEvent.keyboard('{ArrowDown}'); // video
  await userEvent.keyboard('{ArrowDown}'); // image
  await userEvent.keyboard('{ArrowRight}'); // submenu -> .png

  expect(screen.queryByRole('combobox')).not.toBe(null);
});

describe('getInsideElements', () => {
  test('returns a list of elements that should be considered part of the floating element', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const click = useClick(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([click]);

      return (
        <>
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            data-testid="reference"
          />
          <div data-testid="inside" />
          {isOpen && (
            <FloatingFocusManager
              context={context}
              getInsideElements={() => {
                const inside = document.querySelector<HTMLElement>(
                  '[data-testid="inside"]',
                );
                return inside ? [inside] : [];
              }}
            >
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

    await userEvent.click(screen.getByTestId('reference'));
    await act(async () => {});

    expect(screen.getByTestId('inside')).not.toHaveAttribute(
      'data-floating-ui-inert',
    );
  });
});

test('floating element with no focusable elements and no listbox role gets tabIndex=0 when initialFocus is -1', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    return (
      <>
        <button
          data-testid="reference"
          ref={refs.setReference}
          onClick={() => setIsOpen(true)}
        />
        {isOpen && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            modal={false}
          >
            <div ref={refs.setFloating} data-testid="floating" role="dialog" />
          </FloatingFocusManager>
        )}
      </>
    );
  }

  render(<App />);

  const reference = screen.getByTestId('reference');
  await userEvent.click(reference);
  await act(async () => {});
  fireEvent.focusOut(reference);
  await act(async () => {});

  expect(screen.getByTestId('floating')).toHaveAttribute('tabindex', '0');
});

test('floating element with listbox role ignores tabIndex setting', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

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
          onClick={() => setIsOpen(true)}
          {...getReferenceProps()}
        >
          ref
        </button>
        {isOpen && (
          <FloatingFocusManager
            context={context}
            initialFocus={-1}
            modal={false}
          >
            <div
              ref={refs.setFloating}
              role="listbox"
              data-testid="floating"
              {...getFloatingProps()}
            >
              floating
            </div>
          </FloatingFocusManager>
        )}
      </>
    );
  }

  render(<App />);
  await userEvent.click(screen.getByTestId('reference'));
  await act(async () => {});

  expect(screen.getByTestId('floating')).toHaveAttribute('tabindex', '-1');
});

test('handles manual tabindex on dialog floating element', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

    const {refs, context} = useFloating({
      open: isOpen,
      onOpenChange: setIsOpen,
    });

    return (
      <>
        <button
          data-testid="reference"
          ref={refs.setReference}
          onClick={() => setIsOpen(true)}
        />
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div ref={refs.setFloating} data-testid="floating" role="dialog" />
          </FloatingFocusManager>
        )}
      </>
    );
  }

  render(<App />);

  await userEvent.click(screen.getByTestId('reference'));
  await act(async () => {});

  expect(screen.getByTestId('floating')).toHaveAttribute('tabindex', '0');
  await userEvent.tab({shift: true});
  expect(screen.getByTestId('reference')).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByTestId('floating')).toHaveFocus();
});

test('standard tabbing back and forth of a non-modal floating element', async () => {
  function App() {
    const [isOpen, setIsOpen] = useState(false);

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
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                data-testid="floating"
                role="dialog"
                {...getFloatingProps()}
              >
                <button data-testid="inner">inner</button>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </>
    );
  }
  render(<App />);

  await userEvent.click(screen.getByTestId('reference'));
  await act(async () => {});

  expect(screen.getByTestId('inner')).toHaveFocus();
  await userEvent.tab({shift: true});
  expect(screen.getByTestId('reference')).toHaveFocus();
  await userEvent.tab();
  expect(screen.getByTestId('inner')).toHaveFocus();
});

describe('closeOnFocusOut', () => {
  describe('with FloatingPortal', () => {
    function CloseOnFocusOut({
      closeOnFocusOut = true,
    }: {
      closeOnFocusOut?: boolean;
    }) {
      const [isOpen, setIsOpen] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      return (
        <>
          <button
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setIsOpen(true)}
          />
          {isOpen && (
            <FloatingPortal>
              <FloatingFocusManager
                context={context}
                modal={false}
                closeOnFocusOut={closeOnFocusOut}
              >
                <div ref={refs.setFloating} data-testid="floating">
                  <button>inside</button>
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
          <button>outside</button>
        </>
      );
    }

    it('true: closes when focus moves outside', async () => {
      render(<CloseOnFocusOut />);

      await userEvent.click(screen.getByTestId('reference'));
      await act(async () => {});
      await userEvent.tab();

      expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
    });

    it('false: does not close when focus moves outside', async () => {
      render(<CloseOnFocusOut closeOnFocusOut={false} />);

      await userEvent.click(screen.getByTestId('reference'));
      await act(async () => {});
      await userEvent.tab();

      expect(screen.getByTestId('floating')).toBeInTheDocument();
    });
  });

  describe('without FloatingPortal', () => {
    function CloseOnFocusOut({
      closeOnFocusOut = true,
    }: {
      closeOnFocusOut?: boolean;
    }) {
      const [isOpen, setIsOpen] = useState(false);

      const {refs, context} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      return (
        <>
          <button
            data-testid="reference"
            ref={refs.setReference}
            onClick={() => setIsOpen(true)}
          />
          {isOpen && (
            <FloatingFocusManager
              context={context}
              modal={false}
              closeOnFocusOut={closeOnFocusOut}
            >
              <div ref={refs.setFloating} data-testid="floating">
                <button>inside</button>
              </div>
            </FloatingFocusManager>
          )}
          <button>outside</button>
        </>
      );
    }

    it('true: closes when focus moves outside', async () => {
      render(<CloseOnFocusOut />);

      await userEvent.click(screen.getByTestId('reference'));
      await act(async () => {});
      await userEvent.tab();

      expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
    });

    it('false: does not close when focus moves outside', async () => {
      render(<CloseOnFocusOut closeOnFocusOut={false} />);

      await userEvent.click(screen.getByTestId('reference'));
      await act(async () => {});
      await userEvent.tab();

      expect(screen.getByTestId('floating')).toBeInTheDocument();
    });
  });
});
