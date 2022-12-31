import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ReactNode, useState} from 'react';

import {
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useInteractions,
} from '../../src';
import {normalizeBubblesProp, Props} from '../../src/hooks/useDismiss';

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
  }: Props & {testId: string; children: ReactNode}) => {
    const [open, setOpen] = useState(true);
    const nodeId = useFloatingNodeId();

    const {reference, floating, context} = useFloating({
      open,
      onOpenChange: setOpen,
      nodeId,
    });

    const {getReferenceProps, getFloatingProps} = useInteractions([
      useDismiss(context, props),
    ]);

    return (
      <FloatingNode id={nodeId}>
        <button {...getReferenceProps({ref: reference})} />
        {open && (
          <div {...getFloatingProps({ref: floating})} data-testid={testId}>
            {children}
          </div>
        )}
      </FloatingNode>
    );
  };

  const NestedDialog = (
    props: Props & {testId: string; children: ReactNode}
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
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp();

      expect(escapeKeyBubbles).toBe(true);
      expect(outsidePressBubbles).toBe(true);
    });

    test('false', () => {
      const {escapeKeyBubbles, outsidePressBubbles} =
        normalizeBubblesProp(false);

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(false);
    });

    test('{}', () => {
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp({});

      expect(escapeKeyBubbles).toBe(true);
      expect(outsidePressBubbles).toBe(true);
    });

    test('{ escapeKey: false }', () => {
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp({
        escapeKey: false,
      });

      expect(escapeKeyBubbles).toBe(false);
      expect(outsidePressBubbles).toBe(true);
    });

    test('{ outsidePress: false }', () => {
      const {escapeKeyBubbles, outsidePressBubbles} = normalizeBubblesProp({
        outsidePress: false,
      });

      expect(escapeKeyBubbles).toBe(true);
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
        </NestedDialog>
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
        </NestedDialog>
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
    test('true', async () => {
      render(
        <NestedDialog testId="outer">
          <NestedDialog testId="inner">
            <button>test button</button>
          </NestedDialog>
        </NestedDialog>
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
        </NestedDialog>
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
