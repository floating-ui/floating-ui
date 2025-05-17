import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {ReactNode} from 'react';
import {useState} from 'react';
import {vi} from 'vitest';

import {
  FloatingFocusManager,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFocus,
  useInteractions,
  useClick,
} from '../../src';
import type {UseDismissProps} from '../../src/hooks/useDismiss';
import {normalizeProp} from '../../src/hooks/useDismiss';

function App(
  props: UseDismissProps & {
    onClose?: () => void;
  },
) {
  const [open, setOpen] = useState(true);
  const {refs, context} = useFloating({
    open,
    onOpenChange(open, _, reason) {
      setOpen(open);
      if (props.outsidePress) {
        expect(reason).toBe('outside-press');
      } else if (props.escapeKey) {
        expect(reason).toBe('escape-key');
        if (!open) {
          props.onClose?.();
        }
      } else if (props.referencePress) {
        expect(reason).toBe('reference-press');
      } else if (props.ancestorScroll) {
        expect(reason).toBe('ancestor-scroll');
      }
    },
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useDismiss(context, props),
  ]);

  return (
    <>
      <button {...getReferenceProps({ref: refs.setReference})} />
      {open && (
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})}>
          <input />
        </div>
      )}
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

  test('does not dismiss with escape key if IME is active', async () => {
    const onClose = vi.fn();

    render(<App onClose={onClose} escapeKey />);

    const textbox = screen.getByRole('textbox');

    fireEvent.focus(textbox);

    await act(async () => {});

    // Simulate behavior when "あ" (Japanese) is entered and Esc is pressed for IME
    // cancellation.
    fireEvent.change(textbox, {target: {value: 'あ'}});
    fireEvent.compositionStart(textbox);
    fireEvent.keyDown(textbox, {key: 'Escape'});
    fireEvent.compositionEnd(textbox);

    // Wait for the compositionend timeout tick due to Safari
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(onClose).toHaveBeenCalledTimes(0);

    fireEvent.keyDown(textbox, {key: 'Escape'});

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('dismisses with outside pointer press', async () => {
    render(<App />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with reference press', async () => {
    render(<App referencePress />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with native click', async () => {
    render(<App referencePress />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with ancestor scroll', async () => {
    render(<App ancestorScroll />);
    fireEvent.scroll(window);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('outsidePress function guard', async () => {
    render(<App outsidePress={() => false} />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('outsidePress ignored for third party elements', async () => {
    function App() {
      const [isOpen, setIsOpen] = useState(true);

      const {context, refs} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const dismiss = useDismiss(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([dismiss]);

      return (
        <>
          <button {...getReferenceProps({ref: refs.setReference})} />
          {isOpen && (
            <FloatingFocusManager context={context}>
              <div
                role="dialog"
                {...getFloatingProps({ref: refs.setFloating})}
              />
            </FloatingFocusManager>
          )}
        </>
      );
    }

    render(<App />);
    await act(async () => {});

    const thirdParty = document.createElement('div');
    thirdParty.setAttribute('data-testid', 'third-party');
    document.body.append(thirdParty);
    await userEvent.click(thirdParty);
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    thirdParty.remove();
  });

  test('outsidePress not ignored for nested floating elements', async () => {
    function Popover({
      children,
      id,
      modal,
    }: {
      children?: ReactNode;
      id: string;
      modal?: boolean | null;
    }) {
      const [isOpen, setIsOpen] = useState(true);

      const {context, refs} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const dismiss = useDismiss(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([dismiss]);

      const dialogJsx = (
        <div
          role="dialog"
          data-testid={id}
          {...getFloatingProps({ref: refs.setFloating})}
        >
          {children}
        </div>
      );

      return (
        <>
          <button {...getReferenceProps({ref: refs.setReference})} />
          {isOpen && (
            <>
              {modal == null ? (
                dialogJsx
              ) : (
                <FloatingFocusManager context={context} modal={modal}>
                  {dialogJsx}
                </FloatingFocusManager>
              )}
            </>
          )}
        </>
      );
    }

    function App({modal}: {modal: [boolean, boolean] | null}) {
      return (
        <Popover id="popover-1" modal={modal ? modal[0] : true}>
          <Popover id="popover-2" modal={modal ? modal[1] : null} />
        </Popover>
      );
    }

    const {unmount} = render(<App modal={[true, true]} />);
    await act(async () => {});

    let popover1 = screen.getByTestId('popover-1');
    let popover2 = screen.getByTestId('popover-2');
    await userEvent.click(popover2);
    expect(popover1).toBeInTheDocument();
    expect(popover2).toBeInTheDocument();
    await userEvent.click(popover1);
    expect(popover2).not.toBeInTheDocument();

    unmount();

    const {unmount: unmount2} = render(<App modal={[true, false]} />);
    await act(async () => {});

    popover1 = screen.getByTestId('popover-1');
    popover2 = screen.getByTestId('popover-2');

    await userEvent.click(popover2);
    expect(popover1).toBeInTheDocument();
    expect(popover2).toBeInTheDocument();
    await userEvent.click(popover1);
    expect(popover2).not.toBeInTheDocument();

    unmount2();

    const {unmount: unmount3} = render(<App modal={[false, true]} />);
    await act(async () => {});

    popover1 = screen.getByTestId('popover-1');
    popover2 = screen.getByTestId('popover-2');

    await userEvent.click(popover2);
    expect(popover1).toBeInTheDocument();
    expect(popover2).toBeInTheDocument();
    await userEvent.click(popover1);
    expect(popover2).not.toBeInTheDocument();

    unmount3();

    render(<App modal={null} />);
    await act(async () => {});

    popover1 = screen.getByTestId('popover-1');
    popover2 = screen.getByTestId('popover-2');

    await userEvent.click(popover2);
    expect(popover1).toBeInTheDocument();
    expect(popover2).toBeInTheDocument();
    await userEvent.click(popover1);
    expect(popover2).not.toBeInTheDocument();
  });
});

describe('false', () => {
  test('dismisses with escape key', () => {
    render(<App escapeKey={false} />);
    fireEvent.keyDown(document.body, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with outside press', async () => {
    render(<App outsidePress={false} />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with reference pointer down', async () => {
    render(<App referencePress={false} />);
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
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      const {getReferenceProps, getFloatingProps} = useInteractions([
        useDismiss(context),
      ]);

      return (
        <>
          <button ref={refs.setReference} {...getReferenceProps()} />
          {open && (
            <div ref={refs.setFloating} {...getFloatingProps()}>
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

  test('outsidePress function guard', async () => {
    render(<App outsidePress={() => true} />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });
});

describe('bubbles', () => {
  const Dialog = ({
    testId,
    children,
    ...props
  }: UseDismissProps & {testId: string; children: ReactNode}) => {
    const [open, setOpen] = useState(true);
    const nodeId = useFloatingNodeId();

    const {refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
      nodeId,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useDismiss(context, props),
    ]);

    return (
      <FloatingNode id={nodeId}>
        <button {...getReferenceProps({ref: refs.setReference})} />
        {open && (
          <FloatingFocusManager context={context}>
            <div
              {...getFloatingProps({ref: refs.setFloating})}
              data-testid={testId}
            >
              {children}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingNode>
    );
  };

  const NestedDialog = (
    props: UseDismissProps & {testId: string; children: ReactNode},
  ) => {
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

  describe('prop resolution', () => {
    test('undefined', () => {
      const {escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles} =
        normalizeProp();

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(true);
    });

    test('false', () => {
      const {escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles} =
        normalizeProp(false);

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(false);
    });

    test('{}', () => {
      const {escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles} =
        normalizeProp({});

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(true);
    });

    test('{ escapeKey: false }', () => {
      const {escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles} =
        normalizeProp({
          escapeKey: false,
        });

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(true);
    });

    test('{ outsidePress: false }', () => {
      const {escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles} =
        normalizeProp({
          outsidePress: false,
        });

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(false);
    });
  });

  describe('outsidePress', () => {
    test('true', async () => {
      render(
        <NestedDialog testId="outer">
          <NestedDialog testId="inner">
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>,
      );

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      fireEvent.pointerDown(document.body);

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });

    test('false', async () => {
      render(
        <NestedDialog testId="outer" bubbles={{outsidePress: false}}>
          <NestedDialog testId="inner" bubbles={{outsidePress: false}}>
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>,
      );

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      fireEvent.pointerDown(document.body);

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();

      fireEvent.pointerDown(document.body);

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });

    test('mixed', async () => {
      render(
        <NestedDialog testId="outer" bubbles={{outsidePress: true}}>
          <NestedDialog testId="inner" bubbles={{outsidePress: false}}>
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>,
      );

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      fireEvent.pointerDown(document.body);

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();

      fireEvent.pointerDown(document.body);

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });
  });

  describe('escapeKey', () => {
    test('without FloatingTree', async () => {
      function App() {
        const [popoverOpen, setPopoverOpen] = useState(true);
        const [tooltipOpen, setTooltipOpen] = useState(false);

        const popover = useFloating({
          open: popoverOpen,
          onOpenChange: setPopoverOpen,
        });
        const tooltip = useFloating({
          open: tooltipOpen,
          onOpenChange: setTooltipOpen,
        });

        const popoverInteractions = useInteractions([
          useDismiss(popover.context),
        ]);
        const tooltipInteractions = useInteractions([
          useFocus(tooltip.context, {visibleOnly: false}),
          useDismiss(tooltip.context),
        ]);

        return (
          <>
            <button
              ref={popover.refs.setReference}
              {...popoverInteractions.getReferenceProps()}
            />
            {popoverOpen && (
              <div
                role="dialog"
                ref={popover.refs.setFloating}
                {...popoverInteractions.getFloatingProps()}
              >
                <button
                  data-testid="focus-button"
                  ref={tooltip.refs.setReference}
                  {...tooltipInteractions.getReferenceProps()}
                />
              </div>
            )}
            {tooltipOpen && (
              <div
                role="tooltip"
                ref={tooltip.refs.setFloating}
                {...tooltipInteractions.getFloatingProps()}
              />
            )}
          </>
        );
      }

      render(<App />);

      act(() => screen.getByTestId('focus-button').focus());

      expect(screen.queryByRole('tooltip')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).toBeInTheDocument();

      cleanup();
    });

    test('true', async () => {
      render(
        <NestedDialog testId="outer" bubbles>
          <NestedDialog testId="inner" bubbles>
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>,
      );

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });
    test('false', async () => {
      render(
        <NestedDialog testId="outer" bubbles={{escapeKey: false}}>
          <NestedDialog testId="inner" bubbles={{escapeKey: false}}>
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>,
      );

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });

    test('mixed', async () => {
      render(
        <NestedDialog testId="outer" bubbles={{escapeKey: true}}>
          <NestedDialog testId="inner" bubbles={{escapeKey: false}}>
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>,
      );

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });
  });
});

describe('capture', () => {
  describe('prop resolution', () => {
    test('undefined', () => {
      const {escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture} =
        normalizeProp();

      expect(escapeKeyCapture).toBe(false);
      expect(outsidePressCapture).toBe(true);
    });

    test('{}', () => {
      const {escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture} =
        normalizeProp({});

      expect(escapeKeyCapture).toBe(false);
      expect(outsidePressCapture).toBe(true);
    });

    test('true', () => {
      const {escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture} =
        normalizeProp(true);

      expect(escapeKeyCapture).toBe(true);
      expect(outsidePressCapture).toBe(true);
    });

    test('false', () => {
      const {escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture} =
        normalizeProp(false);

      expect(escapeKeyCapture).toBe(false);
      expect(outsidePressCapture).toBe(false);
    });

    test('{ escapeKey: true }', () => {
      const {escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture} =
        normalizeProp({
          escapeKey: true,
        });

      expect(escapeKeyCapture).toBe(true);
      expect(outsidePressCapture).toBe(true);
    });

    test('{ outsidePress: false }', () => {
      const {escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture} =
        normalizeProp({
          outsidePress: false,
        });

      expect(escapeKeyCapture).toBe(false);
      expect(outsidePressCapture).toBe(false);
    });
  });

  const Overlay = ({children}: {children: ReactNode}) => {
    return (
      <div
        style={{width: '100vw', height: '100vh'}}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
          }
        }}
      >
        <span>outside</span>
        {children}
      </div>
    );
  };

  const Dialog = ({
    id,
    children,
    ...props
  }: UseDismissProps & {id: string; children: ReactNode}) => {
    const [open, setOpen] = useState(true);
    const nodeId = useFloatingNodeId();

    const {refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
      nodeId,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useDismiss(context, props),
    ]);

    return (
      <FloatingNode id={nodeId}>
        <button {...getReferenceProps({ref: refs.setReference})} />
        {open && (
          <FloatingPortal>
            <FloatingFocusManager context={context}>
              <div {...getFloatingProps({ref: refs.setFloating})}>
                <span>{id}</span>
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </FloatingNode>
    );
  };

  const NestedDialog = (
    props: UseDismissProps & {id: string; children: ReactNode},
  ) => {
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

  describe('outsidePress', () => {
    test('false', async () => {
      const user = userEvent.setup();

      render(
        <Overlay>
          <NestedDialog id="outer" capture={{outsidePress: false}}>
            <NestedDialog id="inner" capture={{outsidePress: false}}>
              {null}
            </NestedDialog>
          </NestedDialog>
        </Overlay>,
      );

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.getByText('inner')).toBeInTheDocument();

      await user.click(screen.getByText('outer'));

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.getByText('inner')).toBeInTheDocument();

      await user.click(screen.getByText('outside'));

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.getByText('inner')).toBeInTheDocument();
      cleanup();
    });

    test('true', async () => {
      const user = userEvent.setup();

      render(
        <Overlay>
          <NestedDialog id="outer" capture={{outsidePress: true}}>
            <NestedDialog id="inner" capture={{outsidePress: true}}>
              {null}
            </NestedDialog>
          </NestedDialog>
        </Overlay>,
      );

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.getByText('inner')).toBeInTheDocument();

      await user.click(screen.getByText('outer'));

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.queryByText('inner')).not.toBeInTheDocument();

      await user.click(screen.getByText('outside'));

      expect(screen.queryByText('outer')).not.toBeInTheDocument();
      expect(screen.queryByText('inner')).not.toBeInTheDocument();
      cleanup();
    });
  });

  describe('escapeKey', () => {
    test('false', async () => {
      const user = userEvent.setup();

      render(
        <Overlay>
          <NestedDialog id="outer" capture={{escapeKey: false}}>
            <NestedDialog id="inner" capture={{escapeKey: false}}>
              {null}
            </NestedDialog>
          </NestedDialog>
        </Overlay>,
      );

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.getByText('inner')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.queryByText('inner')).not.toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByText('outer')).not.toBeInTheDocument();
      expect(screen.queryByText('inner')).not.toBeInTheDocument();
      cleanup();
    });

    test('true', async () => {
      const user = userEvent.setup();

      render(
        <Overlay>
          <NestedDialog id="outer" capture={{escapeKey: true}}>
            <NestedDialog id="inner" capture={{escapeKey: true}}>
              {null}
            </NestedDialog>
          </NestedDialog>
        </Overlay>,
      );

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.getByText('inner')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.getByText('outer')).toBeInTheDocument();
      expect(screen.queryByText('inner')).not.toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByText('outer')).not.toBeInTheDocument();
      expect(screen.queryByText('inner')).not.toBeInTheDocument();
      cleanup();
    });
  });
});

describe('outsidePressEvent click', () => {
  test('dragging outside the floating element does not close', () => {
    render(<App outsidePressEvent="click" />);
    const floatingEl = screen.getByRole('tooltip');
    fireEvent.mouseDown(floatingEl);
    fireEvent.mouseUp(document.body);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dragging inside the floating element does not close', () => {
    render(<App outsidePressEvent="click" />);
    const floatingEl = screen.getByRole('tooltip');
    fireEvent.mouseDown(document.body);
    fireEvent.mouseUp(floatingEl);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dragging outside the floating element then clicking outside closes', async () => {
    render(<App outsidePressEvent="click" />);
    const floatingEl = screen.getByRole('tooltip');
    fireEvent.mouseDown(floatingEl);
    fireEvent.mouseUp(document.body);
    // A click event will have fired before the proper outside click.
    fireEvent.click(document.body);
    fireEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });
});

test('nested floating elements with different portal roots', async () => {
  function ButtonWithFloating({
    children,
    portalRoot,
    triggerText,
  }: {
    children?: React.ReactNode;
    portalRoot?: HTMLElement | null;
    triggerText: string;
  }) {
    const [open, setOpen] = useState(false);
    const {refs, floatingStyles, context} = useFloating({
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
        <button ref={refs.setReference} {...getReferenceProps()}>
          {triggerText}
        </button>
        {open && (
          <FloatingPortal root={portalRoot}>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
              >
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </>
    );
  }

  function App() {
    const [otherContainer, setOtherContainer] =
      useState<HTMLDivElement | null>();

    const portal1 = undefined;
    const portal2 = otherContainer;

    return (
      <>
        <ButtonWithFloating portalRoot={portal1} triggerText="open 1">
          <ButtonWithFloating portalRoot={portal2} triggerText="open 2">
            <button>nested</button>
          </ButtonWithFloating>
        </ButtonWithFloating>
        <div ref={setOtherContainer} />
      </>
    );
  }

  render(<App />);

  await userEvent.click(screen.getByText('open 1'));
  expect(screen.getByText('open 2')).toBeInTheDocument();

  await userEvent.click(screen.getByText('open 2'));
  await act(async () => {});

  expect(screen.queryByText('open 1')).toBeInTheDocument();
  expect(screen.queryByText('open 2')).toBeInTheDocument();
  expect(screen.queryByText('nested')).toBeInTheDocument();
});
