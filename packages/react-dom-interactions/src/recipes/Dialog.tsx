import React, {cloneElement, isValidElement, useState} from 'react';
import {
  useFloating,
  useInteractions,
  useClick,
  useFocusTrap,
  useRole,
  useDismiss,
  useId,
  FloatingPortal,
  FloatingOverlay,
} from '..';

interface Props {
  open?: boolean;
  render: (props: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
}

export const Dialog: React.FC<Props> = ({
  children,
  render,
  open: passedOpen = false,
}) => {
  const [open, setOpen] = useState(passedOpen);

  const {reference, floating, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const labelId = useId();
  const descriptionId = useId();

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useFocusTrap(context),
    useRole(context),
    useDismiss(context),
  ]);

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      <FloatingPortal>
        {open && (
          <FloatingOverlay
            lockScroll
            style={{
              background: 'rgba(25, 25, 25, 0.6)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              padding: '15px 0',
            }}
          >
            <div
              {...getFloatingProps({
                ref: floating,
                style: {
                  background: 'white',
                  padding: 25,
                  color: 'black',
                  maxWidth: 600,
                  margin: 'auto',
                },
                'aria-labelledby': labelId,
                'aria-describedby': descriptionId,
              })}
            >
              {render({
                close: () => setOpen(false),
                labelId,
                descriptionId,
              })}
            </div>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};
