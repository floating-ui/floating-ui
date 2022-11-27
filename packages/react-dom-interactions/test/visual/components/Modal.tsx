import React, {cloneElement, useState} from 'react';

import {
  useFloating,
  useInteractions,
  useClick,
  useRole,
  useDismiss,
  useId,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager,
} from '@floating-ui/react-dom-interactions';

interface Props {
  open?: boolean;
  render: (props: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
  children: JSX.Element;
}

export const Main = () => {
  return (
    <>
      <h1>Dialog</h1>
      <p>A floating element that displays rich content.</p>
      <div className="container">
        <Dialog render={() => 'hi'}>
          <button>My button</button>
        </Dialog>
      </div>
    </>
  );
};

export const Dialog = ({render, open: passedOpen = false, children}: Props) => {
  const [open, setOpen] = useState(passedOpen);

  const {reference, floating, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ]);

  return (
    <>
      {cloneElement(
        children,
        getReferenceProps({ref: reference, ...children.props})
      )}
      <FloatingPortal>
        {open && (
          <FloatingOverlay
            lockScroll
            style={{
              display: 'grid',
              placeItems: 'center',
              background: 'rgba(25, 25, 25, 0.8)',
            }}
          >
            <FloatingFocusManager context={context}>
              <div
                {...getFloatingProps({
                  ref: floating,
                  className: 'Dialog',
                  'aria-labelledby': labelId,
                  'aria-describedby': descriptionId,
                  style: {
                    background: 'rgba(255, 255, 255, 0.5)',
                    height: 1000,
                    width: 500,
                    margin: 100,
                  },
                })}
              >
                {render({
                  close: () => setOpen(false),
                  labelId,
                  descriptionId,
                })}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};
