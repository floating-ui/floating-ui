import {
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
import React, {cloneElement, isValidElement, useState} from 'react';
import {useMediaQuery} from 'react-responsive';

import {Button} from '../lib/Button';

export const Main = () => {
  return (
    <>
      <h1 className="text-5xl font-bold mb-8">Drawer</h1>
      <div className="grid place-items-center border border-slate-400 rounded lg:w-[40rem] h-[20rem] mb-4">
        <Drawer
          render={({labelId, descriptionId, close}) => (
            <>
              <h2 id={labelId} className="text-xl font-bold">
                Title
              </h2>
              <p id={descriptionId}>Description</p>
              <Button className="bg-white mt-4" onClick={close}>
                Close
              </Button>
            </>
          )}
        >
          <Button>My button</Button>
        </Drawer>
        <Button>Next button</Button>
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

  const isLargeScreen = useMediaQuery({query: '(min-width: 1400px)'});
  const {refs, context} = useFloating({open, onOpenChange: setOpen});

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

  const content = (
    <FloatingFocusManager
      context={context}
      modal={modal}
      closeOnFocusOut={modal}
    >
      <div
        ref={refs.setFloating}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        className="absolute top-0 right-0 h-full w-48 bg-slate-100 p-4"
        {...getFloatingProps()}
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
        cloneElement(children, getReferenceProps({ref: refs.setReference}))}
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
