import * as React from 'react';
import {
  useClick,
  useFloating,
  useFloatingRootContext,
  useInteractions,
} from '@floating-ui/react';
import {act, fireEvent, render, screen} from '@testing-library/react';

test('interaction hooks accept root context', async () => {
  function Root() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [anchor, setAnchor] = React.useState<Element | null>(null);
    const [tooltip, setTooltip] = React.useState<HTMLElement | null>(null);

    const context = useFloatingRootContext({
      open: isOpen,
      onOpenChange: setIsOpen,
      elements: {
        reference: anchor,
        floating: tooltip,
      },
    });

    const hover = useClick(context);

    const {getReferenceProps, getFloatingProps} = useInteractions([hover]);

    return (
      <>
        <button ref={setAnchor} {...getReferenceProps()} />
        {isOpen && (
          <Tooltip
            setTooltip={setTooltip}
            getFloatingProps={getFloatingProps}
            context={context}
          />
        )}
      </>
    );
  }

  function Tooltip({
    setTooltip,
    getFloatingProps,
    context,
  }: {
    setTooltip: (tooltip: HTMLElement | null) => void;
    getFloatingProps: () => Record<string, any>;
    context: ReturnType<typeof useFloatingRootContext>;
  }) {
    const {floatingStyles} = useFloating({rootContext: context});
    return (
      <div ref={setTooltip} style={floatingStyles} {...getFloatingProps()}>
        Tooltip
      </div>
    );
  }

  render(<Root />);

  fireEvent.click(screen.getByRole('button'));
  await act(async () => {});

  expect(screen.getByText('Tooltip')).toBeInTheDocument();
});
