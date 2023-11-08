import '@testing-library/jest-dom';

import {cleanup, fireEvent, render, screen} from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import {
  createMemo,
  createSignal,
  JSX,
  mergeProps,
  ParentProps,
  Show,
  splitProps,
} from 'solid-js';
import {vi} from 'vitest';

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
} from '../../src';
import {FloatingFocusManagerProps} from '../../src/components/FloatingFocusManager';
import {Main as Drawer} from '../visual/components/Drawer';
import {Main as Navigation} from '../visual/components/Navigation';

const user = userEvent.setup();
const promiseRequestAnimationFrame = async () =>
  await new Promise((resolve) =>
    requestAnimationFrame(() => {
      //in SolidJS we need to wait for a requestAnimationFrame to be finished because of the enqueueFocus function
      expect(true).toBe(true);
      resolve(null);
    }),
  );
function App(
  props: ParentProps<
    Partial<
      Omit<FloatingFocusManagerProps, 'initialFocus'> & {
        initialFocus?: 'two' | number;
      }
    >
  >,
) {
  const [ref, setRef] = createSignal<HTMLButtonElement>();
  const [open, setOpen] = createSignal(false);
  const {refs, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });
  const [local, rest] = splitProps(props, ['children']);

  return (
    <FloatingTree>
      <button
        data-testid="reference"
        ref={refs.setReference}
        onClick={() => setOpen((prev) => !prev)}
      >
        Reference
      </button>
      <Show when={open()}>
        <FloatingFocusManager
          {...rest}
          initialFocus={
            props.initialFocus === 'two' ? ref() : props.initialFocus
          }
          context={context}
        >
          <div role="dialog" ref={refs.setFloating} data-testid="floating">
            <button data-testid="one">close</button>
            <button data-testid="two" ref={setRef}>
              confirm
            </button>
            <button data-testid="three" onClick={() => setOpen(false)}>
              x
            </button>
            {local.children}
          </div>
        </FloatingFocusManager>
      </Show>
      <div tabIndex={0} data-testid="last">
        x
      </div>
    </FloatingTree>
  );
}

describe('initialFocus', async () => {
  afterEach(cleanup);

  test('number', async () => {
    render(() => <App />);

    fireEvent.click(screen.getByTestId('reference'));
    await promiseRequestAnimationFrame();

    expect(screen.getByTestId('one')).toHaveFocus();

    fireEvent.click(screen.getByTestId('reference'));
    await promiseRequestAnimationFrame();
    fireEvent.click(screen.getByTestId('reference'));
    await promiseRequestAnimationFrame();

    //Rerender
    render(() => <App initialFocus={1} />);
    expect(screen.getByTestId('two')).not.toHaveFocus();

    render(() => <App initialFocus={2} />);
    expect(screen.getByTestId('three')).not.toHaveFocus();
  });

  test('ref', async () => {
    render(() => <App initialFocus="two" />);
    fireEvent.click(screen.getByTestId('reference'));
    await promiseRequestAnimationFrame();

    expect(screen.getByTestId('two')).toHaveFocus();
  });

  test('respects autoFocus', async () => {
    render(() => (
      <App>
        <input autofocus data-testid="input" />
      </App>
    ));
    fireEvent.click(screen.getByTestId('reference'));
    await promiseRequestAnimationFrame();
    expect(screen.getByTestId('input')).toHaveFocus();
  });
});

describe('returnFocus', () => {
  test('true', async () => {
    render(() => <App />);

    screen.getByTestId('reference').focus();
    fireEvent.click(screen.getByTestId('reference'));
    await promiseRequestAnimationFrame();

    expect(screen.getByTestId('one')).toHaveFocus();

    screen.getByTestId('two').focus();
    await Promise.resolve();
    expect(screen.getByTestId('two')).toHaveFocus();

    fireEvent.click(screen.getByTestId('three'));
    expect(screen.getByTestId('reference')).not.toHaveFocus();
  });

  test('false', async () => {
    render(() => <App returnFocus={false} />);

    screen.getByTestId('reference').focus();
    fireEvent.click(screen.getByTestId('reference'));
    await promiseRequestAnimationFrame();

    expect(screen.getByTestId('one')).toHaveFocus();

    fireEvent.click(screen.getByTestId('three'));
    expect(screen.getByTestId('reference')).not.toHaveFocus();
  });

  test('always returns to the reference for nested elements', async () => {
    interface Props {
      open?: boolean;
      render: (props: {close: () => void}) => JSX.Element;
      children: JSX.Element;
      refProps: any;
    }

    const Dialog = (props: Props) => {
      const [open, setOpen] = createSignal(false);
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
          <button
            {...getReferenceProps({ref: refs.setReference})}
            {...props.refProps}
          >
            {props.children}
          </button>
          <FloatingPortal>
            <Show when={open() || !!props.open}>
              <FloatingFocusManager context={context}>
                <div {...getFloatingProps({ref: refs.setFloating})}>
                  {props.render({
                    close: () => setOpen(false),
                  })}
                </div>
              </FloatingFocusManager>
            </Show>
          </FloatingPortal>
        </FloatingNode>
      );
    };

    const NestedDialog = (props: Props) => {
      const parentId = useFloatingParentNodeId();

      return (
        <Show when={() => parentId == null} fallback={<Dialog {...props} />}>
          <FloatingTree>
            <Dialog {...props} />
          </FloatingTree>
        </Show>
      );
    };

    render(() => (
      <NestedDialog
        refProps={{'data-testid': 'open-dialog'}}
        render={({close}) => (
          <>
            <NestedDialog
              refProps={{'data-testid': 'open-nested-dialog'}}
              render={({close}) => (
                <button onClick={close} data-testid="close-nested-dialog" />
              )}
            >
              <button data-testid="open-nested-dialog_" />
            </NestedDialog>
            <button onClick={close} data-testid="close-dialog" />
          </>
        )}
      >
        <button data-testid="open-dialog_" />
      </NestedDialog>
    ));

    await userEvent.click(screen.getByTestId('open-dialog'));
    expect(screen.queryByTestId('open-nested-dialog')).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('open-nested-dialog'));

    expect(screen.queryByTestId('close-nested-dialog')).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByTestId('close-nested-dialog')).not.toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(screen.queryByTestId('close-dialog')).not.toBeInTheDocument();
  });

  describe('guards', () => {
    test('true', async () => {
      render(() => <App guards={true} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();

      expect(document.body).not.toHaveFocus();
    });

    test('false', async () => {
      render(() => <App guards={false} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      await userEvent.tab();
      await userEvent.tab();
      await userEvent.tab();

      expect(document.activeElement).toHaveAttribute('data-floating-ui-inert');
    });
  });

  describe('modal', () => {
    test('true', async () => {
      render(() => <App modal={true} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      await userEvent.tab();
      expect(screen.getByTestId('two')).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByTestId('three')).toHaveFocus();

      await user.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('one')).toHaveFocus();

      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('three')).toHaveFocus();

      await userEvent.tab({shift: true});
      expect(screen.getByTestId('two')).toHaveFocus();

      await userEvent.tab({shift: true});
      expect(screen.getByTestId('one')).toHaveFocus();

      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('three')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('one')).toHaveFocus();
    });

    test('false', async () => {
      render(() => <App modal={false} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      await userEvent.tab();
      expect(screen.getByTestId('two')).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByTestId('three')).toHaveFocus();

      await userEvent.tab();

      // Wait for the setTimeout that wraps onOpenChange(false).
      // await () => new Promise((resolve) => setTimeout(resolve)));

      // Focus leaving the floating element closes it.
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      expect(screen.getByTestId('last')).toHaveFocus();
    });

    test('false — shift tabbing does not trap focus when reference is in order', async () => {
      render(() => <App modal={false} order={['reference', 'content']} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      await userEvent.tab();
      await userEvent.tab({shift: true});
      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.queryByRole('dialog')).toBeInTheDocument();
    });

    test('true - comboboxes hide all other nodes', async () => {
      function App() {
        const [open, setOpen] = createSignal(false);
        const {refs, context} = useFloating({
          open,
          onOpenChange: setOpen,
        });

        return (
          <FloatingTree>
            <input
              role="combobox"
              data-testid="reference"
              ref={refs.setReference}
              onFocus={() => setOpen(true)}
            />
            <button data-testid="btn-1" />
            <button data-testid="btn-2" />
            <Show when={open()}>
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
            </Show>
          </FloatingTree>
        );
      }

      render(() => <App />);

      fireEvent.focus(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('reference')).not.toHaveAttribute(
        'aria-hidden',
      );
      expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('btn-1')).toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('btn-2')).toHaveAttribute('aria-hidden');
    });

    test('false - comboboxes do not hide all other nodes', async () => {
      function App() {
        const [open, setOpen] = createSignal(false);
        const {refs, context} = useFloating({
          open,
          onOpenChange: setOpen,
        });

        return (
          <FloatingTree>
            <input
              role="combobox"
              data-testid="reference"
              ref={refs.setReference}
              onFocus={() => setOpen(true)}
            />
            <button data-testid="btn-1" />
            <button data-testid="btn-2" />
            <Show when={open()}>
              <FloatingFocusManager context={context} modal={false}>
                <div
                  role="listbox"
                  ref={refs.setFloating}
                  data-testid="floating"
                />
              </FloatingFocusManager>
            </Show>
          </FloatingTree>
        );
      }

      render(() => <App />);

      fireEvent.focus(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('reference')).not.toHaveAttribute(
        'aria-hidden',
      );
      expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');
    });

    test('fallback to floating element when it has no tabbable content', async () => {
      function App() {
        const {refs, context} = useFloating({open: true});
        return (
          <FloatingTree>
            <button data-testid="reference" ref={refs.setReference} />
            <FloatingFocusManager
              context={context}
              modal={true}
              order={['content', 'floating']} //added Floating to order. Otherwise test will fail
            >
              <div
                ref={refs.setFloating}
                data-testid="floating"
                tabIndex={-1}
              />
            </FloatingFocusManager>
          </FloatingTree>
        );
      }

      render(() => <App />);
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('floating')).toHaveFocus();
      await userEvent.tab();
      await promiseRequestAnimationFrame();
      //Added "floating" to FocusManager order. Otherwise getTabbableElements() will return an empty array
      expect(screen.getByTestId('floating')).toHaveFocus();
      await userEvent.tab({shift: true});
      expect(screen.getByTestId('floating')).toHaveFocus();
    });

    test('mixed modality and nesting', async () => {
      interface Props {
        open?: boolean;
        modal?: boolean;
        render: (props: {close: () => void}) => JSX.Element;
        children?: JSX.Element;
        sideChildren?: JSX.Element;
      }

      const Dialog = (
        // 	{
        //   render,
        //   open: controlledOpen,
        //   modal = true,
        //   children,
        //   sideChildren,
        // }
        props: Props,
      ) => {
        const [internalOpen, setOpen] = createSignal(false);
        const nodeId = useFloatingNodeId();
        const mergedProps = mergeProps({modal: true}, props);
        const open = createMemo(() =>
          mergedProps.open !== undefined ? mergedProps.open : internalOpen(),
        );

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
            <button {...getReferenceProps()}>{props.children}</button>
            <FloatingPortal>
              <Show when={open()}>
                <FloatingFocusManager
                  context={context}
                  modal={mergedProps.modal}
                >
                  <div {...getFloatingProps({ref: refs.setFloating})}>
                    {mergedProps.render({
                      close: () => setOpen(false),
                    })}
                  </div>
                </FloatingFocusManager>
              </Show>
            </FloatingPortal>
            {mergedProps.sideChildren}
          </FloatingNode>
        );
      };

      const NestedDialog = (props: Props) => {
        const parentId = useFloatingParentNodeId();

        return (
          <Show when={() => parentId == null} fallback={<Dialog {...props} />}>
            <FloatingTree>
              <Dialog {...props} />
            </FloatingTree>
          </Show>
        );
      };
      const App = () => {
        const [sideDialogOpen, setSideDialogOpen] = createSignal(false);
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
                open={sideDialogOpen()}
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

      render(() => <App />);

      await userEvent.click(screen.getByTestId('open-dialog'));
      await userEvent.click(screen.getByTestId('open-nested-dialog'));

      expect(screen.queryByTestId('close-dialog')).toBeInTheDocument();
      expect(screen.queryByTestId('close-nested-dialog')).toBeInTheDocument();
    });

    test('true - applies aria-hidden to outside nodes', async () => {
      function App() {
        const [isOpen, setIsOpen] = createSignal(false);
        const {refs, context} = useFloating({
          open: isOpen,
          onOpenChange: setIsOpen,
        });

        return (
          <FloatingTree>
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
            <Show when={isOpen()}>
              <FloatingFocusManager context={context}>
                <div ref={refs.setFloating} data-testid="floating" />
              </FloatingFocusManager>
            </Show>
          </FloatingTree>
        );
      }

      render(() => <App />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('reference')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
      expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('aria-live')).not.toHaveAttribute(
        'aria-hidden',
      );
      expect(screen.getByTestId('btn-1')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
      expect(screen.getByTestId('btn-2')).toHaveAttribute(
        'aria-hidden',
        'true',
      );

      fireEvent.click(screen.getByTestId('reference'));

      expect(screen.getByTestId('reference')).not.toHaveAttribute(
        'aria-hidden',
      );
      expect(screen.getByTestId('aria-live')).not.toHaveAttribute(
        'aria-hidden',
      );
      expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');
    });

    test('false - does not apply aria-hidden to outside nodes', async () => {
      function App() {
        const [isOpen, setIsOpen] = createSignal(false);
        const {refs, context} = useFloating({
          open: isOpen,
          onOpenChange: setIsOpen,
        });

        return (
          <FloatingTree>
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
            <Show when={isOpen()}>
              <FloatingFocusManager context={context} modal={false}>
                <div
                  role="listbox"
                  ref={refs.setFloating}
                  data-testid="floating"
                />
              </FloatingFocusManager>
            </Show>
          </FloatingTree>
        );
      }

      render(() => <App />);

      fireEvent.click(screen.getByTestId('reference'));
      await Promise.resolve();

      expect(screen.getByTestId('floating')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('aria-live')).not.toHaveAttribute(
        'aria-hidden',
      );
      expect(screen.getByTestId('btn-1')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('btn-2')).not.toHaveAttribute('aria-hidden');
      expect(screen.getByTestId('reference')).toHaveAttribute(
        'data-floating-ui-inert',
      );
      expect(screen.getByTestId('btn-1')).toHaveAttribute(
        'data-floating-ui-inert',
      );
      expect(screen.getByTestId('btn-2')).toHaveAttribute(
        'data-floating-ui-inert',
      );
      expect(screen.getByTestId('original')).toHaveAttribute(
        'data-floating-ui-inert',
      );
      expect(screen.getByTestId('original')).toHaveAttribute(
        'aria-hidden',
        'false',
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
      expect(screen.getByTestId('original')).not.toHaveAttribute(
        'data-floating-ui-inert',
      );
      expect(screen.getByTestId('original')).toHaveAttribute(
        'aria-hidden',
        'false',
      );
    });
  });

  describe('disabled', () => {
    test('true -> false', async () => {
      function App() {
        const [isOpen, setIsOpen] = createSignal(false);
        const [disabled, setDisabled] = createSignal(true);

        const {refs, context} = useFloating({
          open: isOpen,
          onOpenChange: setIsOpen,
        });

        return (
          <FloatingTree>
            <button
              data-testid="reference"
              ref={refs.setReference}
              onClick={() => setIsOpen((v) => !v)}
            />
            <button
              data-testid="toggle"
              onClick={() => setDisabled((v) => !v)}
            />
            <Show when={isOpen()}>
              <FloatingFocusManager context={context} disabled={disabled()}>
                <div ref={refs.setFloating} data-testid="floating" />
              </FloatingFocusManager>
            </Show>
          </FloatingTree>
        );
      }

      render(() => <App />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('floating')).not.toHaveFocus();
      fireEvent.click(screen.getByTestId('toggle'));
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('floating')).toHaveFocus();
    });

    test('false', async () => {
      function App() {
        const [isOpen, setIsOpen] = createSignal(false);
        const [disabled, setDisabled] = createSignal(false);

        const {refs, context} = useFloating({
          open: isOpen,
          onOpenChange: setIsOpen,
        });

        const click = useClick(context);

        const {getReferenceProps, getFloatingProps} = useInteractions([click]);

        return (
          <FloatingTree>
            <button
              data-testid="reference"
              ref={refs.setReference}
              {...getReferenceProps()}
            />
            <button
              data-testid="toggle"
              onClick={() => setDisabled((v) => !v)}
            />
            <Show when={isOpen()}>
              <FloatingFocusManager context={context} disabled={disabled()}>
                <div
                  ref={refs.setFloating}
                  data-testid="floating"
                  {...getFloatingProps()}
                />
              </FloatingFocusManager>
            </Show>
          </FloatingTree>
        );
      }

      render(() => <App />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('floating')).toHaveFocus();
    });
  });

  describe('order', () => {
    test('[reference, content]', async () => {
      render(() => <App order={['reference', 'content']} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('reference')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('one')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('two')).toHaveFocus();
    });

    test('[floating, content]', async () => {
      render(() => <App order={['floating', 'content']} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('floating')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('one')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('two')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('three')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('floating')).toHaveFocus();

      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('three')).toHaveFocus();

      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('two')).toHaveFocus();

      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('one')).toHaveFocus();

      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('floating')).toHaveFocus();
    });

    test('[reference, floating, content]', async () => {
      render(() => <App order={['reference', 'floating', 'content']} />);

      fireEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('reference')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('floating')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('one')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('two')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('three')).toHaveFocus();

      await userEvent.tab();
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('reference')).toHaveFocus();

      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();
      expect(screen.getByTestId('three')).toHaveFocus();

      await userEvent.tab({shift: true});
      await userEvent.tab({shift: true});
      await userEvent.tab({shift: true});
      await userEvent.tab({shift: true});
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('reference')).toHaveFocus();
    });
  });

  describe('non-modal + FloatingPortal', () => {
    test('focuses inside element, tabbing out focuses last document element', async () => {
      function App() {
        const [open, setOpen] = createSignal(false);
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
              <Show when={open()}>
                <FloatingFocusManager
                  context={context}
                  modal={false}
                  // closeOnFocusOut={true}
                >
                  <div data-testid="floating" ref={refs.setFloating}>
                    <span tabIndex={0} data-testid="inside" />
                  </div>
                </FloatingFocusManager>
              </Show>
            </FloatingPortal>
            <span tabIndex={0} data-testid="last" />
          </>
        );
      }

      render(() => <App />);

      await userEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('inside')).toHaveFocus();

      await userEvent.tab();

      expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
      expect(screen.getByTestId('last')).toHaveFocus();
    });

    test('order: [reference, content] focuses reference, then inside, then, last document element', async () => {
      function App() {
        const [open, setOpen] = createSignal(false);
        const {refs, context} = useFloating({
          open,
          onOpenChange: setOpen,
        });

        return (
          <FloatingTree>
            <span tabIndex={0} data-testid="first" />
            <button
              data-testid="reference"
              ref={refs.setReference}
              onClick={() => setOpen(true)}
            />
            <FloatingPortal>
              <Show when={open()}>
                <FloatingFocusManager
                  context={context}
                  modal={false}
                  order={['reference', 'content']}
                >
                  <div data-testid="floating" ref={refs.setFloating}>
                    <span tabIndex={0} data-testid="inside" />
                  </div>
                </FloatingFocusManager>
              </Show>
            </FloatingPortal>
            <span tabIndex={0} data-testid="last" />
          </FloatingTree>
        );
      }

      render(() => <App />);

      await userEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      await userEvent.tab();
      await promiseRequestAnimationFrame();

      expect(screen.getByTestId('inside')).toHaveFocus();

      await userEvent.tab();

      expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
      expect(screen.getByTestId('last')).toHaveFocus();
    });

    test('order: [reference, floating, content] focuses reference, then inside, then, last document element', async () => {
      function App() {
        const [open, setOpen] = createSignal(false);
        const {refs, context} = useFloating({
          open,
          onOpenChange: setOpen,
        });

        return (
          <FloatingTree>
            <span tabIndex={0} data-testid="first" />
            <button
              data-testid="reference"
              ref={refs.setReference}
              onClick={() => setOpen(true)}
            />
            <FloatingPortal>
              <Show when={open()}>
                <FloatingFocusManager
                  context={context}
                  modal={false}
                  order={['reference', 'floating', 'content']}
                >
                  <div data-testid="floating" ref={refs.setFloating}>
                    <span tabIndex={0} data-testid="inside" />
                  </div>
                </FloatingFocusManager>
              </Show>
            </FloatingPortal>
            <span tabIndex={0} data-testid="last" />
          </FloatingTree>
        );
      }

      render(() => <App />);

      await userEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

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
        const [open, setOpen] = createSignal(false);
        const {refs, context} = useFloating({
          open,
          onOpenChange: setOpen,
        });

        return (
          <FloatingTree>
            <span tabIndex={0} data-testid="first" />
            <button
              data-testid="reference"
              ref={refs.setReference}
              onClick={() => setOpen(true)}
            />
            <FloatingPortal>
              <Show when={open()}>
                <FloatingFocusManager context={context} modal={false}>
                  <div data-testid="floating" ref={refs.setFloating}>
                    <span tabIndex={0} data-testid="inside" />
                  </div>
                </FloatingFocusManager>
              </Show>
            </FloatingPortal>
            <span tabIndex={0} data-testid="last" />
          </FloatingTree>
        );
      }

      render(() => <App />);

      await userEvent.click(screen.getByTestId('reference'));
      await promiseRequestAnimationFrame();

      await userEvent.tab({shift: true});

      expect(screen.queryByTestId('floating')).toBeInTheDocument();

      await userEvent.tab({shift: true});

      expect(screen.queryByTestId('floating')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('does not focus reference when hovering it', async () => {
      render(() => (
        <FloatingTree>
          <Navigation />
        </FloatingTree>
      ));
      await userEvent.hover(screen.getByText('Product'));
      await userEvent.unhover(screen.getByText('Product'));
      expect(screen.getByText('Product')).not.toHaveFocus();
    });

    test('returns focus to reference when floating element was opened by hover but is closed by esc key', async () => {
      render(() => (
        <FloatingTree>
          <Navigation />
        </FloatingTree>
      ));
      await userEvent.hover(screen.getByText('Product'));
      await userEvent.keyboard('{Escape}');
      await promiseRequestAnimationFrame();
      expect(screen.getByText('Product')).toHaveFocus();
    });

    test('returns focus to reference when floating element was opened by hover but is closed by an explicit close button', async () => {
      render(() => (
        <FloatingTree>
          <Navigation />
        </FloatingTree>
      ));
      await userEvent.hover(screen.getByText('Product'));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await userEvent.click(screen.getByText('Close').parentElement!);
      await userEvent.keyboard('{Tab}');

      expect(screen.getByText('Close')).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await promiseRequestAnimationFrame();

      expect(screen.getByText('Product')).toHaveFocus();
    });

    test('does not re-open after closing via escape key', async () => {
      render(() => (
        <FloatingTree>
          <Navigation />
        </FloatingTree>
      ));
      await userEvent.hover(screen.getByText('Product'));
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByText('Link 1')).not.toBeInTheDocument();
    });

    test('closes when unhovering floating element even when focus is inside it', async () => {
      render(() => (
        <FloatingTree>
          <Navigation />
        </FloatingTree>
      ));
      await userEvent.hover(screen.getByText('Product'));
      await userEvent.click(screen.getByTestId('subnavigation'));
      await userEvent.unhover(screen.getByTestId('subnavigation'));
      await userEvent.hover(screen.getByText('Product'));
      await userEvent.unhover(screen.getByText('Product'));
      expect(screen.queryByTestId('subnavigation')).not.toBeInTheDocument();
    });
  });

  describe('Drawer', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    test('does not close when clicking another button outside', async () => {
      const user = userEvent.setup();
      render(() => (
        <FloatingTree>
          <Drawer modal={false} />
        </FloatingTree>
      ));
      await user.click(screen.getByText('My button'));
      expect(screen.queryByText('Close')).toBeInTheDocument();

      await user.click(screen.getByText('Next button'));
      expect(screen.queryByText('Close')).toBeInTheDocument();
    });

    test('closeOnFocusOut=false - does not close when tabbing out', async () => {
      render(() => <Drawer modal={false} />);
      await userEvent.click(screen.getByText('My button'));
      await promiseRequestAnimationFrame();
      expect(screen.queryByText('Close')).toBeInTheDocument();
      await userEvent.keyboard('{Tab}');
      await promiseRequestAnimationFrame();

      expect(document.activeElement).toBe(screen.getByText('Next button'));
      expect(screen.queryByText('Close')).toBeInTheDocument();
    });

    test('returns focus when tabbing out then back to close button', async () => {
      render(() => (
        <FloatingTree>
          <Drawer modal={false} />
        </FloatingTree>
      ));
      await userEvent.click(screen.getByText('My button'));
      await promiseRequestAnimationFrame();
      expect(screen.queryByText('Close')).toBeInTheDocument();

      await userEvent.keyboard('{Tab}');
      await promiseRequestAnimationFrame();
      expect(document.activeElement).toBe(screen.getByText('Next button'));

      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
      await promiseRequestAnimationFrame();
      expect(document.activeElement).toBe(screen.getByText('Close'));

      await userEvent.click(screen.getByText('Close'));
      await promiseRequestAnimationFrame();
      expect(document.activeElement).toBe(screen.getByText('My button'));
    });
  });
});
