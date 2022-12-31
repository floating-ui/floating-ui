import {
  autoUpdate,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import React, {cloneElement, isValidElement, useEffect, useState} from 'react';
import {useMediaQuery} from 'react-responsive';

export const Main = () => {
  return (
    <>
      <h1>Drawer</h1>
      <p>
        A dialog component that splits the screen on large screens and renders
        as modal on small screens.
      </p>
      <div className="DrawerContainer">
        <div className="container">
          <Drawer
            render={({labelId, descriptionId, close}) => (
              <>
                <h2 id={labelId}>A label/title</h2>
                <p id={descriptionId}>A description/paragraph</p>
                <button onClick={close}>Close</button>
              </>
            )}
          >
            <button>My button</button>
          </Drawer>
          <button>Next button</button>
        </div>
        <div id="drawer-root"></div>
      </div>
    </>
  );
};
interface Props {
  render: (data: {
    close: () => void;
    labelId: string;
    descriptionId: string;
  }) => React.ReactNode;
  children?: React.ReactNode;
}

export function Drawer({children, render}: Props) {
  const [open, setOpen] = useState(false);

  const isLargeScreen = useMediaQuery({
    query: '(min-width: 1400px)',
  });
  const {reference, floating, refs, update, context} = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const modal = !isLargeScreen;

  const {getReferenceProps, getFloatingProps} = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context, {
      outsidePress: modal,
      outsidePressEvent: 'mousedown',
    }),
  ]);

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && open) {
      return autoUpdate(refs.reference.current, refs.floating.current, update);
    }
  }, [open, update, refs.reference, refs.floating]);

  const content = (
    <FloatingFocusManager
      context={context}
      modal={modal}
      closeOnFocusOut={modal}
    >
      <div
        {...getFloatingProps({
          className: 'Drawer' + (modal ? ' DrawerModal' : ''),
          ref: floating,
          'aria-labelledby': labelId,
          'aria-describedby': descriptionId,
        })}
      >
        {render({
          labelId,
          descriptionId,
          close: () => setOpen(false),
        })}
      </div>
    </FloatingFocusManager>
  );

  return (
    <>
      {isValidElement(children) &&
        cloneElement(children, getReferenceProps({ref: reference}))}
      <FloatingPortal id="drawer-root">
        {open &&
          (modal ? (
            <FloatingOverlay
              lockScroll
              style={{background: 'rgba(0, 0, 0, 0.8)', zIndex: 1}}
            >
              {content}
            </FloatingOverlay>
          ) : (
            content
          ))}
      </FloatingPortal>
    </>
  );
}
