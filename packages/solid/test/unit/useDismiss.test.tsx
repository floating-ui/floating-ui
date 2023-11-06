import '@testing-library/jest-dom';

import {
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
} from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import {createSignal, JSXElement, Show, splitProps} from 'solid-js';
import {Portal} from 'solid-js/web';
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
} from '../../src';
import {
  normalizeBubblesProp,
  UseDismissProps,
} from '../../src/hooks/useDismiss';
import {promiseRequestAnimationFrame} from '../helper';

function App(props: UseDismissProps) {
  const [open, setOpen] = createSignal(true);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const {getReferenceProps, getFloatingProps} = useInteractions([
    useDismiss(context, props),
  ]);

  return (
    <>
      <button {...getReferenceProps({ref: refs.setReference})} />
      <Show when={open()}>
        <div role="tooltip" {...getFloatingProps({ref: refs.setFloating})} />
      </Show>
    </>
  );
}

describe('true', () => {
  test('dismisses with escape key', () => {
    render(() => <App />);
    fireEvent.keyDown(document.body, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with outside pointer press', async () => {
    render(() => <App />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with reference press', async () => {
    render(() => <App referencePress />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('dismisses with ancestor scroll', async () => {
    render(() => <App ancestorScroll />);
    fireEvent.scroll(window);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });

  test('outsidePress function guard', async () => {
    render(() => <App outsidePress={() => false} />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('outsidePress ignored for third party elements', async () => {
    function App() {
      const [isOpen, setIsOpen] = createSignal(true);

      const {context, refs} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const dismiss = useDismiss(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([dismiss]);

      return (
        <>
          <button {...getReferenceProps({ref: refs.setReference})} />
          <Show when={isOpen()}>
            <FloatingFocusManager context={context}>
              <div
                role="dialog"
                {...getFloatingProps({ref: refs.setFloating})}
              />
            </FloatingFocusManager>
          </Show>
        </>
      );
    }

    render(() => <App />);
    await promiseRequestAnimationFrame();

    const thirdParty = document.createElement('div');
    thirdParty.setAttribute('data-testid', 'third-party');
    document.body.append(thirdParty);
    await userEvent.click(thirdParty);
    expect(screen.queryByRole('dialog')).toBeInTheDocument();
    thirdParty.remove();
  });

  test('outsidePress not ignored for nested floating elements', async () => {
    function Popover(props // 	{
    //   children,
    //   id,
    //   modal,
    // }
    : {
      children?: JSXElement;
      id: string;
      modal?: boolean | null;
    }) {
      const [isOpen, setIsOpen] = createSignal(true);

      const {context, refs} = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
      });

      const dismiss = useDismiss(context);

      const {getReferenceProps, getFloatingProps} = useInteractions([dismiss]);

      const dialogJsx = (
        <div
          role="dialog"
          data-testid={props.id}
          {...getFloatingProps({ref: refs.setFloating})}
        >
          {props.children}
        </div>
      );

      return (
        <>
          <button {...getReferenceProps({ref: refs.setReference})} />
          <Show when={isOpen()}>
            <>
              <Show when={!!props.modal} fallback={dialogJsx}>
                <FloatingFocusManager context={context} modal={!!props.modal}>
                  {dialogJsx}
                </FloatingFocusManager>
              </Show>
            </>
          </Show>
        </>
      );
    }

    function App(props: {modal: [boolean, boolean] | null}) {
      return (
        <Popover id="popover-1" modal={props.modal ? props.modal[0] : true}>
          <Popover id="popover-2" modal={props.modal ? props.modal[1] : null} />
        </Popover>
      );
    }

    const {unmount} = render(() => <App modal={[true, true]} />);
    await promiseRequestAnimationFrame();

    let popover1 = screen.getByTestId('popover-1');
    let popover2 = screen.getByTestId('popover-2');
    await userEvent.click(popover2);
    expect(popover1).toBeInTheDocument();
    expect(popover2).toBeInTheDocument();
    await userEvent.click(popover1);
    expect(popover2).not.toBeInTheDocument();

    unmount();

    const {unmount: unmount2} = render(() => <App modal={[true, false]} />);
    await promiseRequestAnimationFrame();

    popover1 = screen.getByTestId('popover-1');
    popover2 = screen.getByTestId('popover-2');

    await userEvent.click(popover2);
    expect(popover1).toBeInTheDocument();
    expect(popover2).toBeInTheDocument();
    await userEvent.click(popover1);
    expect(popover2).not.toBeInTheDocument();

    unmount2();

    const {unmount: unmount3} = render(() => <App modal={[false, true]} />);
    await promiseRequestAnimationFrame();

    popover1 = screen.getByTestId('popover-1');
    popover2 = screen.getByTestId('popover-2');

    await userEvent.click(popover2);
    expect(popover1).toBeInTheDocument();
    expect(popover2).toBeInTheDocument();
    await userEvent.click(popover1);
    expect(popover2).not.toBeInTheDocument();

    unmount3();

    render(() => <App modal={null} />);
    await promiseRequestAnimationFrame();

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
    render(() => <App escapeKey={false} />);
    fireEvent.keyDown(document.body, {key: 'Escape'});
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with outside press', async () => {
    render(() => <App outsidePress={false} />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with reference pointer down', async () => {
    render(() => <App referencePress={false} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('dismisses with ancestor scroll', async () => {
    render(() => <App ancestorScroll={false} />);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    fireEvent.scroll(window);
    expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    cleanup();
  });

  test('does not dismiss when clicking portaled children', async () => {
    function App(props: any) {
      const [open, setOpen] = createSignal(true);
      const {refs, context} = useFloating({
        open,
        onOpenChange: setOpen,
      });

      const {getReferenceProps, getFloatingProps} = useInteractions([
        useDismiss(context, {outsidePressEvent: 'click'}),
      ]);

      return (
        <>
          <button ref={refs.setReference} {...getReferenceProps()} />
          <Show when={open()}>
            <div
              data-testid="floating"
              ref={refs.setFloating}
              {...getFloatingProps()}
            >
              <FloatingPortal>
                <button
                  data-testid="portaled-button"
                  // onPointerDown={props.pointerDown}
                >
                  Portaled-Button
                </button>
              </FloatingPortal>
            </div>
          </Show>
        </>
      );
    }
    const pointerDown = vi.fn();

    render(() => (
      <>
        <App pointerDown={pointerDown} />
      </>
    ));

    const btn = screen.queryByTestId('portaled-button');
    fireEvent.click(screen.getByTestId('portaled-button'), {
      bubbles: true,
    });
    expect(btn).toBeInTheDocument();

    cleanup();
  });

  test('outsidePress function guard', async () => {
    render(() => <App outsidePress={() => true} />);
    await userEvent.click(document.body);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    cleanup();
  });
});

describe('bubbles', () => {
  const fn = vi.fn();
  const Dialog = (
    props: UseDismissProps & {testId: string; children: JSXElement},
  ) => {
    const [open, setOpen] = createSignal(true);
    const nodeId = useFloatingNodeId();
    const [local, dismissProps] = splitProps(props, ['children', 'testId']);
    const {refs, context} = useFloating({
      open,
      onOpenChange: setOpen,
      nodeId,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useDismiss(context, dismissProps),
    ]);

    return (
      <FloatingNode id={nodeId}>
        <button ref={refs.setReference} {...getReferenceProps()}>
          Reference {nodeId}
        </button>
        <Show when={open()}>
          {/* <FloatingFocusManager context={context}> */}
          <div
            ref={refs.setFloating}
            {...getFloatingProps({onKeyDown: (e) => fn(e)})}
            data-testid={local.testId}
          >
            {local.children}
          </div>
          {/* </FloatingFocusManager> */}
        </Show>
      </FloatingNode>
    );
  };

  const NestedDialog = (
    props: UseDismissProps & {testId: string; children: JSXElement},
  ) => {
    const parentId = useFloatingParentNodeId();

    return (
      <Show when={parentId == null} fallback={<Dialog {...props} />}>
        <FloatingTree>
          <Dialog {...props} />
        </FloatingTree>
      </Show>
    );
  };

  describe('prop resolution', () => {
    test('undefined', () => {
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp();

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(true);
      cleanup();
    });

    test('false', () => {
      const {escapeKeyBubbles, outsidePressBubbles} =
        normalizeBubblesProp(false);

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(false);
      cleanup();
    });

    test('{}', () => {
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp({});

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(true);
      cleanup();
    });

    test('{ escapeKey: false }', () => {
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp({
        escapeKey: false,
      });

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(true);
      cleanup();
    });

    test('{ outsidePress: false }', () => {
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp({
        outsidePress: false,
      });

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(false);
      cleanup();
    });
  });

  describe('outsidePress', () => {
    test('true', async () => {
      render(() => (
        <NestedDialog testId="outer">
          <NestedDialog testId="inner">
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>
      ));

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      fireEvent.pointerDown(document.body);

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });

    test('false', async () => {
      render(() => (
        <NestedDialog testId="outer" bubbles={{outsidePress: false}}>
          <NestedDialog testId="inner" bubbles={{outsidePress: false}}>
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>
      ));

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
      render(() => (
        <NestedDialog testId="outer" bubbles={{outsidePress: true}}>
          <NestedDialog testId="inner" bubbles={{outsidePress: false}}>
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>
      ));

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
        const [popoverOpen, setPopoverOpen] = createSignal(true);
        const [tooltipOpen, setTooltipOpen] = createSignal(false);

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
          useFocus(tooltip.context),
          useDismiss(tooltip.context),
        ]);

        return (
          <>
            <button
              ref={popover.refs.setReference}
              {...popoverInteractions.getReferenceProps()}
            />
            <Show when={popoverOpen()}>
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
            </Show>

            <Show when={tooltipOpen()}>
              <div
                role="tooltip"
                ref={tooltip.refs.setFloating}
                {...tooltipInteractions.getFloatingProps()}
              />
            </Show>
          </>
        );
      }

      render(() => <App />);

      screen.getByTestId('focus-button').focus();

      expect(screen.queryByRole('tooltip')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).toBeInTheDocument();

      cleanup();
    });

    test('true', async () => {
      render(() => (
        <NestedDialog testId="outer" bubbles>
          <NestedDialog testId="inner" bubbles>
            <button data-testid="btn">test button</button>
          </NestedDialog>
        </NestedDialog>
      ));

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();
      screen.getByTestId('btn').focus();
      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });

    test('false', async () => {
      render(() => (
        <NestedDialog testId="outer" bubbles={{escapeKey: false}}>
          <NestedDialog testId="inner" bubbles={{escapeKey: false}}>
            <button data-testid="btn">test button</button>
          </NestedDialog>
        </NestedDialog>
      ));

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();
      screen.getByTestId('btn').focus();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();

      await userEvent.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });

    test('mixed', async () => {
      render(() => (
        <NestedDialog testId="outer" bubbles={{escapeKey: true}}>
          <NestedDialog testId="inner" bubbles={{escapeKey: false}}>
            <button data-testid="btn">test button</button>
          </NestedDialog>
        </NestedDialog>
      ));
      const ev = userEvent.setup();
      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).toBeInTheDocument();

      screen.getByTestId('btn').focus();
      await ev.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();

      await ev.keyboard('{Escape}');

      expect(screen.queryByTestId('outer')).not.toBeInTheDocument();
      expect(screen.queryByTestId('inner')).not.toBeInTheDocument();
      cleanup();
    });
  });
});
